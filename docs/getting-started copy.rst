**********
Deploy Your Own
**********

.. warning:: This is for advanced users/ scenarios only

Pre-requisites
################
To deploy your own instance your going to need:

1. A cloud-based Linux server (this guide assumes Ubuntu server)
2. An AWS account where you can run a lambda instance
3. An email service that supports programmatic sending/ receiving of email
4. A registered domain
5. A CloudFlare account, configured to perform DNS for your registered domain

You will require two DNS host names/ A records to be defined for the skill:
1. Web interface/ API - where you/ your users will login and define their devices
2. MQTT service

These should be separate A records to enable caching/ security functionality via CloudFlare - you cannot route MQTT traffic through the CloudFlare security platform.

Both of these
.. tip:: You can of course choose to run your environment differently, if you will have to workout how to modify the setup instructions accordingly.

Define Service Accounts
***************
You need to define three user accounts/ passwords:

1. MongoDB admin account
2. MongoDB account for the skill to connect to the database
3. MQTT account for the skill to connect with to the MQTT server

Define these as environment variables to make container setup easier::

    export MONGO_ADMIN=<username>
    export MONGO_PASSWORD=<password>
    export MQTT_USER=<username>
    export MQTT_PASSWORD=<password>
    export WEB_USER=<username>
    export WEB_PASSWORD=<password>

.. warning:: Once the skill is setup you should clear your shell history.

Install Docker CE
***************
For Ubuntu 18.04 follow `this Digital Ocean guide. <https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04>`_

Create Docker Network
***************
To isolate our application from other Docker workloads we will create a dedicated Docker network::

    sudo docker network create nr-alexav3

MongoDB Container/ Account Creation
***************
Docker image is used for mongo, with auth enabled.

Skill-required user accounts are created automatically via docker-entrypoint-initdb.d script, use the following commands to setup the MongoDB database (modifying the environment variables to suit)::

    sudo mkdir -p /var/docker/mongodb/docker-entrypoint-initdb.d
    sudo mkdir -p /var/docker/mongodb/etc
    sudo mkdir -p /var/docker/mongodb/data
    cd /var/docker/mongodb/docker-entrypoint-initdb.d

    sudo wget -O mongodb-accounts.sh https://gist.github.com/coldfire84/93ae246f145ef09da682ee3a8e297ac8/raw/7b66fc4c4821703b85902c85b9e9a31dc875b066/mongodb-accounts.sh
    sudo chmod +x mongodb-accounts.sh

    sudo sed -i "s|<mongo-admin-user>|$MONGO_ADMIN|g" mongodb-accounts.sh
    sudo sed -i "s|<mongo-admin-password>|$MONGO_PASSWORD|g" mongodb-accounts.sh
    sudo sed -i "s|<web-app-user>|$WEB_USER|g" mongodb-accounts.sh
    sudo sed -i "s|<web-app-password>|$WEB_PASSWORD|g" mongodb-accounts.sh
    sudo sed -i "s|<mqtt-user>|$MQTT_USER|g" mongodb-accounts.sh
    sudo sed -i "s|<mqtt-password>|$MQTT_PASSWORD|g" mongodb-accounts.sh

    sudo docker create \
    --name mongodb -p 27017:27017 \
    --network nr-alexav3 \
    -e MONGO_INITDB_ROOT_USERNAME=$MONGO_ADMIN \
    -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASSWORD \
    -v /var/docker/mongodb/docker-entrypoint-initdb.d/:/docker-entrypoint-initdb.d/ \
    -v /var/docker/mongodb/etc/:/etc/mongo/ \
    -v /var/docker/mongodb/data/:/data/db/ \
    -v /var/docker/backup:/backup/ \
    --log-opt max-size=100m \
    --log-opt max-file=5 \
    mongo

    sudo docker start mongodb

On first launch the init script should run, creating all of the required MongoDB users, as outlined above.

The credentials defined under WEB_USER/ WEB_PASSWORD are your superuser account, required for setting up OAuth in the Web Service.

Certificates
***************
We will use the same SSL certificate to protect the NodeJS and MQTT services. Ensure that, before running these commands, your hosting solution has HTTPS connectivity enabled.

We'll use certbot to request a free certificate for the Web App, and its integration with CloudFlare.

First, install certbot::

    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install python3-certbot-dns-cloudflare

Create cloudflare.ini file under /home/username/.secrets/cloudflare.ini::

    # Cloudflare API credentials used by Certbot
    dns_cloudflare_email = <cloudflare email address>
    dns_cloudflare_api_key = <cloudflare API key>

Request your certificates::

    sudo certbot certonly \
    --agree-tos \
    --renew-by-default \
    --dns-cloudflare \
    --dns-cloudflare-credentials <path to cloudflare.ini> \
    --dns-cloudflare-propagation-seconds 60 \
    -d <fqdn of web API> \
    --email <your email address>

    sudo certbot certonly \
    --agree-tos \
    --renew-by-default \
    --dns-cloudflare \
    --dns-cloudflare-credentials <path to cloudflare.ini> \
    --dns-cloudflare-propagation-seconds 60 \
    -d <fqdn of MQTT> \
    --email <your email address>

Renewals will be handled automatically by certbot, but we will need to configure a script to run on renewal that sends a SIGHUP to NGINX and a restart to mosquitto. We have to restart Mosquitto as it will not reload the TLS certificate on SIGHUP, see here::

    sudo vi /etc/letsencrypt/renewal-hooks/deploy/reload-containers.sh

Now paste the following contents into this script::

    #!/bin/bash
    docker kill --signal=HUP nginx
    docker restart mosquitto
    Finally, make this script executable:

    sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-containers.sh

Mosquitto Container
***************
A custom mosquitto/ mosquitto-auth-plug container is used in this deployment::

    sudo mkdir -p /var/docker/mosquitto/config/conf.d
    sudo mkdir -p /var/docker/mosquitto/data
    sudo mkdir -p /var/docker/mosquitto/log
    sudo chown -R 1883:1883 /var/docker/mosquitto/config
    sudo chown -R 1883:1883 /var/docker/mosquitto/data
    sudo chown -R 1883:1883 /var/docker/mosquitto/log

    cd /var/docker/mosquitto/config
    sudo wget -O mosquitto.conf https://gist.githubusercontent.com/coldfire84/9f497c131d80763f5bd8408762581fe6/raw/e656ca5ace3a4183dfa6f7bcbcb8acb9c16c0438/mosquitto.conf

    cd /var/docker/mosquitto/config/conf.d/
    sudo wget -O node-red-alexa-smart-home-v3.conf https://gist.github.com/coldfire84/51eb34808e2066f866e6cc26fe481fc0/raw/88b69fd7392612d4be968501747c138e54391fe4/node-red-alexa-smart-home-v3.conf

    export MQTT_DNS_HOSTNAME=<IP/ hostname used for SSL Certs>
    export MONGO_SERVER=<mongodb container name>
    export MQTT_USER=<username>
    export MQTT_PASSWORD=<password>

    sudo sed -i "s/<mongo-server>/$MONGO_SERVER/g" node-red-alexa-smart-home-v3.conf
    sudo sed -i "s/<user>/$MQTT_USER/g" node-red-alexa-smart-home-v3.conf
    sudo sed -i "s/<password>/$MQTT_PASSWORD/g" node-red-alexa-smart-home-v3.conf
    sudo sed -i "s/<dns-hostname>/$MQTT_DNS_HOSTNAME/g" node-red-alexa-smart-home-v3.conf
    sudo sed -i "s|/usr/local/src|/usr/local/lib|g" node-red-alexa-smart-home-v3.conf

Then start the container::

    sudo docker create --name mosquitto \
    --network nr-alexav3 \
    -p 1883:1883 \
    -p 8883:8883 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/docker/mosquitto/config:/mosquitto/config \
    -v /var/docker/mosquitto/data:/mosquitto/data \
    -v /var/docker/mosquitto/log:/mosquitto/log \
    --restart=always \
    --log-opt max-size=10m \
    --log-opt max-file=5 \
    coldfire84/mosquitto-auth:development

Redis Container
***************
Redis server container is used by express-limiter::

    sudo mkdir -p /var/docker/redis/data
    sudo docker create --name redis \
    --network nr-alexav3 \
    -v /var/docker/redis/data:/data \
    --restart always \
    --log-opt max-size=10m \
    --log-opt max-file=5 \
    redis

NodeJS WebApp Container
***************
Create .env file
---------------
Copy the supplied template .env.template to a secure folder on your Docker host, i.e::

    sudo mkdir -p /var/docker/red
    sudo vi /var/docker/red/.env
    # Copy contents from template and populate accordingly
    sudo chmod 600 /var/docker/red/.env

Create Google Home Graph JWT
---------------
If you planning on using Google Home integration you need to setup an account and obtain the associated JWT to send state reports to the Home Graph API::

    sudo mkdir -p /var/docker/red
    sudo vi /var/docker/red/.ghomejwt
    # Copy contents from downloaded JWT, supplied by Google
    sudo chmod 600 /var/docker/red/.ghomejwt

.. tip:: More information on this process `here. <https://developers.google.com/assistant/smarthome/develop/report-state#service-account-key>`_

Build/ Create NodeJS Docker Container
---------------
It is currently recommended to use source to build your container::

    cd ~
    rm -rf nodejs-webapp
    mkdir nodejs-webapp
    cd nodejs-webapp/
    git clone --single-branch -b development https://github.com/coldfire84/node-red-alexa-home-skill-v3-web.git .
    sudo docker build -t red:0.11 -f Dockerfile .

    sudo docker create --name red \
    --network nr-alexav3 \
    -p 3000:3000 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/docker/red/credentials:/root/.aws/credentials \
    -v /var/docker/red/.env:/usr/src/app/.env \
    -v /var/docker/red/.ghomejwt:/usr/src/app/ghomejwt.json \
    --restart always \
    --log-opt max-size=100m \
    --log-opt max-file=5 \
    red:0.11

    sudo docker start red
    sudo docker logs -f red

Nginx
---------------
Create the NGINX container using the following commands::

    sudo mkdir -p /var/docker/nginx/conf.d
    sudo mkdir -p /var/docker/nginx/stream_conf.d
    sudo mkdir -p /var/docker/nginx/includes
    sudo mkdir -p /var/docker/nginx/www

    export WEB_HOSTNAME=<external FQDN of web app>
    export MQTT_DNS_HOSTNAME=<external FDQN of MQTT service>

    # Get Config Files
    sudo wget -O /var/docker/nginx/conf.d/default.conf https://gist.github.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/65bb04af575ab637fa279faef03444f2525793db/default.conf

    sudo wget -O /var/docker/nginx/includes/header.conf https://gist.github.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/65bb04af575ab637fa279faef03444f2525793db/header.conf

    sudo wget -O /var/docker/nginx/includes/letsencrypt.conf https://gist.github.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/65bb04af575ab637fa279faef03444f2525793db/letsencrypt.conf

    sudo wget -O /var/docker/nginx/conf.d/nr-alexav3.cb-net.co.uk.conf https://gist.githubusercontent.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/e38df9035789676bdf13093af0ef1a7c657176af/nr-alexav3.cb-net.co.uk.conf

    sudo wget -O /var/docker/nginx/includes/restrictions.conf https://gist.github.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/65bb04af575ab637fa279faef03444f2525793db/restrictions.conf

    sudo wget -O /var/docker/nginx/includes/ssl-params.conf https://gist.github.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/65bb04af575ab637fa279faef03444f2525793db/ssl-params.conf

    sudo wget -O /var/docker/nginx/conf.d/mq-alexav3.cb-net.co.uk.conf https://gist.github.com/coldfire84/47f90bb19a91f218717e0b7632040970/raw/c234985e379a08c7836282b7efaff8669368dc41/mq-alexav3.cb-net.co.uk.conf

    sudo sed -i "s/<web-dns-name>/$WEB_HOSTNAME/g" /var/docker/nginx/conf.d/nr-alexav3.cb-net.co.uk.conf
    sudo sed -i "s/<web-dns-name>/$WEB_HOSTNAME/g" /var/docker/nginx/conf.d/mq-alexav3.cb-net.co.uk.conf
    sudo sed -i "s/<mq-dns-name>/$MQTT_DNS_HOSTNAME/g" /var/docker/nginx/conf.d/mq-alexav3.cb-net.co.uk.conf

    if [ ! -f /etc/letsencrypt/dhparams.pem ]; then
        sudo openssl dhparam -out /etc/letsencrypt/dhparams.pem 2048
    fi

    sudo docker create --network nr-alexav3 --name nginx -p 80:80 -p 443:443 \
    -v /var/docker/nginx/conf.d/:/etc/nginx/conf.d/ \
    -v /var/docker/nginx/stream_conf.d/:/etc/nginx/stream_conf.d/ \
    -v /etc/letsencrypt:/etc/nginx/ssl/ \
    -v /var/docker/nginx/includes:/etc/nginx/includes/ \
    -v /var/docker/nginx/www/:/var/www \
    --restart always \
    --log-opt max-size=100m \
    --log-opt max-file=5 \
    nginx

Dynamic DNS
---------------
Depending on how/ where you deploy you may suffer from "ephemeral" IP addresses (i.e. on Google Cloud Platform).

You can pay for a Static IP address, or use ddclient to update CloudFlare or similar services::

    mkdir -p /var/docker/ddclient/config

    docker create \
    --name=ddclient \
    -v /var/docker/ddclient/config:/config \
    linuxserver/ddclient

    sudo vi /var/docker/ddclient/config/ddclient.conf

    ##
    ## Cloudflare (cloudflare.com)
    ##
    daemon=300
    verbose=yes
    debug=yes
    use=web, web=ipinfo.io/ip
    ssl=yes
    protocol=cloudflare
    login=<cloudflare username>
    password=<cloudflare global API key>
    zone=<DNS zone>
    <FQDN of web service>, <FQDN of MQTT service>

