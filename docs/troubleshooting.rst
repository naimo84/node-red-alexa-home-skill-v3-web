**********
Troubleshooting
**********
When a flow/ state update isn't working you have a few things you can check.

Add a Debug Node
################
Add a debug node after any "alexa-smart-home-v3" node, you can then verify that the command output is being recieved when you issue a voice command, or interact with a device using the Alexa/ Google Home applications.

Node-RED Debug Console
################
You should keep an eye on the built-in debug console, available in the Node-RED web-interface. The skill will send messages to your individual Node-RED instance if you send an incorrect state update/ an update that is in the wrong format. You will also be warned if your usage is being throttled.

MQTT Subscription
################
No errors in the Node-RED debug console? You can use mosquitto_sub to check your account-specific MQTT messages using the commands below - this will enable you to confirm your Node-RED instance is communicating with the skill itself::

    mosquitto_sub -h mq-red.cb-net.co.uk -t '#' -v -u <bridge_username> -P '<bridge password>' --capath /etc/ssl/certs --id test-<bridge_username> -p 8883

.. note:: You'll only see messages for your account, the service uses access control to filter MQTT messages.

Node-RED Console Log
################
A final, and more "involved" approach, is to look at the Node-RED console logs. The skill related Nodes/ contrib output significant information to the console log. Include any output here, and from the commands/ views above if you end up raising an issue on GuitHub.

For Docker-deployed instances, this is as simple as executing the command (container name dependant)::

    sudo docker logs -f nodered

Still Stuck?
################
Check out the `GitHub repository <https://github.com/coldfire84/node-red-alexa-home-skill-v3-web>`_ for this project where you can raise questions, bugs and feature requests.

There is also a new `Slack channel <https://join.slack.com/t/cb-net/shared_invite/enQtODc1ODgzNzkxNTM3LTYwZGZmNjAxZWZmYTU4ZDllOGM3OTMxMzI4NzRlZmUzZmQ4NDljZWZiOTIwNTYzYjJmZjVlYzhhYWFiNThlMDA>`  where you can engage in the discussion.

.. warning:: Node-RED Smart Home Control is an open source, free to use service. There is no warranty or support, implied or otherwise and the creators and contributors of this service and/ or related website are not responsible for any issues arising from it's use, including loss or damage relating to equipment, property, injury or life. You consume this service at your own risk.