*****
Getting Started
*****
Before you can use this service with Alexa or Google Home you need to:

* Create and verify an `account. <https://red.cb-net.co.uk/new-user>`_
* Define one or more `devices. <https://red.cb-net.co.uk/devices>`_
* Install the associated Node-RED nodes. `Install Node-RED Nodes`_
* Setup Node-RED flows using your devices.

Install Node-RED Nodes
########
Install the Node-RED Nodes by either:

* Using the palette look for "node-red-contrib-alexa-smart-home"
* Using the command: `npm i node-red-contrib-alexa-smart-home`

Concept Flows
########
Refer to this table for capabilities that support state.

Essentially, to use this service your Node-RED flows will require:

* An "alexa-smart-home-v3" node (set to `Auto Acknowledge`_)
* A receiving node for commands, such as MQTT out/ publishing

You may also require a standard Node-RED function node (with your own code) to format command output appropriately for your chosen endpoint.

If the devices you define in have 'Report State' enabled, you will also require:

* An "alexa-smart-home-v3-state" node

Finally, if you want to send state updates to the bridge (to ensure that the Alexa and Google Home applications show the current state of your devices) you will require:

* A sending node for state data, such as MQTT in/ subscription
* A function node (with your own code) to format state input appropriately for your chosen endpoint

.. note:: When both an "alexa-smart-home-v3" and "alexa-smart-home-v3-state" node are used in a flow you must ensure that these nodes are configured for the same device.


Start Simple
***************
If you are only planning to use voice control you only need:

* An "alexa-smart-home-v3" node (set to `Auto Acknowledge`_)
* A receiving node for commands, such as MQTT out/ publishing that enables you to interact with the device itself

This is a good starting point for any flow, or first-time users. You can then extend the flow to enable state updates, out-of-band state updates or to perform other functions as outlined below.

.. image:: basic-flow.png
    :width: 606px
    :align: left
    :height: 105px
    :alt: Screenshot of basic concept flow example

.. warning:: You should only include a single 'default' and single 'state' node per device.

Add State
***************
Now you have basic voice commands working, let's add state updates to your flow.

If you only plan on interacting with the device using the Alexa/ Google app, or voice assistants you can simply take state from the "alexa-smart-home-v3" node and feed it straight into the "alexa-smart-home-v3-state" node.

.. image:: basic-flow.png
    :width: 606px
    :align: left
    :height: 105px
    :alt: Screenshot of concept flow with basic state updates

If, however, you will physically interact with the device, or it has a timer function or there are any other means for you to change its state, you will need to ensure you are sending "out of band" state updates (where the changes in state have not come from activity within the service itself) to the Node-RED Smart Home Control service.

.. image:: concept-oob-state.png
    :width: 606px
    :align: left
    :height: 105px
    :alt: Screenshot of basic concept flow example

In the example above you can see a function node that has been created to intercept MQTT messages for the device and "translate" them to the required format to send back to Node-RED Smart Home Control.

Auto-Acknowledge
***************
So, you're feeling brave? By default, when you add an "alexa-smart-home-v3" node to a flow it is configured for Auto-Acknowledge, this means that a response is sent back to the web API confirming that the command has been received, and it is **assumed** that the command was successful. This may not be desirable, depending upon the criticality of the command you have issued.

It is possible to disable Auto-Acknowledge and use your own logic to establish whether the command was successful, before setting `msg.acknowledge` to `true` or `false` and sending the message to a `alexa-smart-home-v3-resp` node. Note that you must send the **original** message, as output from the "alexa-smart-home-v3" node, modified to include msg.acknowledge.

.. image:: concept-response.png
    :width: 606px
    :align: left
    :height: 105px
    :alt: Screenshot of basic concept flow example

.. note:: This is the most advanced flow type, the gross majority of scenarios do not warrant/ require this level of complexity - it's just available should you want it!