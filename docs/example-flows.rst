**********
Example Flows
**********
This section of the documentation includes example flows, you're welcome to submit further flows either via a `pull request on GitHub <https://github.com/coldfire84/node-red-alexa-home-skill-v3-web/pulls>`_, via Slack or by contacting `node-red@cb-net.co.uk <mailto:node-red@cb-net.co.uk>`_.

Motion Sensor
################
.. note:: Google Home does not currently support motion sensors, and as a result you cannot use these devices as triggers to perform other actions.

Use the flow below to send motion sensor updates to Amazon/ Alexa - useful if you want to be able to perform actions that may not be achievable locally via NBode-RED or MQTT (for example getting Alexa to speak or interact with other Alexa-connected smart home devices and services).

.. image:: montionsensor-eample.png
    :alt: Screenshot of initial account configuration.

Function code needed to submit the state updates to the Node-RED Smart Home Control service, and in-turn Amazon::

    // Motion State
    if (msg.payload == "ON") {
        return { "payload" : { "state" : { "motion" : "DETECTED" } }, "acknowledge" : true };
    }
    else if (msg.payload == "OFF") {
        return { "payload" : { "state" : { "motion" : "NOT_DETECTED" } }, "acknowledge" : true };
    }

.. tip:: In the majority of cases it will be more performant and more reliable to use your local Node-RED instance or MQTT server perform actions based upon motion sensor state changes.