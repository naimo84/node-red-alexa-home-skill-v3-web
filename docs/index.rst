.. toctree::
    :glob:
    :hidden:

    self
    getting-started.rst

**********
Introduction
**********
With 1200+ users, and 3500+ defined devices, available in 12 Amazon Alexa markets and due for launch (shortly!) in 11 Google Assistant markets, Node-RED Smart Home Control enables you to quickly bring voice-control to your Node-RED flows, using Amazon Alexa and/ or Google Assistant.

.. warning:: Node-RED Smart Home Control is an Open Source, free to use service. There is no warranty or support, implied or otherwise and the creators and contributors of this service and/ or related website are not responsible for any issues arising from it's use, including loss or damage relating to equipment, property, injury or life. You consume this service at your own risk.

Key Features
################
* Amazon Alexa and Google Assistant support, either enabled individually or in parallel.
* Support for a large array of device types including blinds, smart plugs, lights, thermostats (see more here).
* Supports "out of band" state updates (from physical or other automated device interactions) whilst providing real-time visibility of device state across Smart Assistant applications.

Supported Capabilities
################

   +-------------+---------------+-------------+-------------+-------------+
   | Alexa       | Google        | Supported   | Example     | Example     |
   | Interface   | Trait         | Controls    | Usage       | Commands    |
   +=============+===============+=============+=============+=============+
   | Brightness  | Brightness    | 0-100%,     | M           | "Alexa, set |
   | Control     |               | increase,   | QTT-enabled | Lounge      |
   |             |               | decrease    | smart bulb/ | Light to    |
   |             |               |             | light       | 50%",       |
   |             |               |             |             | "Alexa,     |
   |             |               |             |             | (increase   |
   |             |               |             |             | \| reduce   |
   |             |               |             |             | \| dim)     |
   |             |               |             |             | Lounge      |
   |             |               |             |             | Light",     |
   |             |               |             |             | "Hey        |
   |             |               |             |             | Google, set |
   |             |               |             |             | Lounge      |
   |             |               |             |             | Light to    |
   |             |               |             |             | 50%"        |
   +-------------+---------------+-------------+-------------+-------------+
   | Channel     | Experimental  | Channel     | HTTP Out    | "Alexa, set |
   | Control     | (number only) | number or   | node        | Lounge TV   |
   |             |               | name etc.   |             | channel to  |
   |             |               |             |             | (101 \|     |
   |             |               |             |             | BBC1)",     |
   |             |               |             |             | "Hey        |
   |             |               |             |             | Google, set |
   |             |               |             |             | Lounge TV   |
   |             |               |             |             | to channel  |
   |             |               |             |             | 101"        |
   +-------------+---------------+-------------+-------------+-------------+
   | Color       | C             | Red, Green, | M           | "Alexa, set |
   | Control     | olorSetting   | Blue etc.   | QTT-enabled | Lounge      |
   |             |               |             | smart bulb/ | Light to    |
   |             |               |             | light       | (Green \|   |
   |             |               |             |             | Red \|      |
   |             |               |             |             | Yellow \|   |
   |             |               |             |             | etc)", "Hey |
   |             |               |             |             | Google, set |
   |             |               |             |             | Lounge      |
   |             |               |             |             | Light to    |
   |             |               |             |             | (Green \|   |
   |             |               |             |             | Red \|      |
   |             |               |             |             | Yellow \|   |
   |             |               |             |             | etc)"       |
   +-------------+---------------+-------------+-------------+-------------+
   | Color       | ColorSetting  | Warm, Warm  | M           | "Alexa, set |
   | Temperature |               | White,      | QTT-enabled | Lounge      |
   | Control     |               | In          | smart bulb/ | Light to    |
   |             |               | candescent, | light       | Warm        |
   |             |               | Soft White, |             | White",     |
   |             |               | White,      |             | "Hey        |
   |             |               | Daylight,   |             | Google, set |
   |             |               | Daylight    |             | Lounge      |
   |             |               | White,      |             | Light to    |
   |             |               | Cool, Cool  |             | Warm White" |
   |             |               | White       |             |             |
   +-------------+---------------+-------------+-------------+-------------+
   | Contact     | ContactSensor | \*No        | N/A         | "Alexa, is  |
   | Sensor      |               | commands\*  |             | the Kitchen |
   |             |               |             |             | window      |
   |             |               |             |             | open?" Note |
   |             |               |             |             | you can     |
   |             |               |             |             | also use    |
   |             |               |             |             | this        |
   |             |               |             |             | interface   |
   |             |               |             |             | as a        |
   |             |               |             |             | trigger.    |
   +-------------+---------------+-------------+-------------+-------------+
   | Input       | None          | HDMI1,      | Yamaha      | "Alexa, on  |
   | Control     |               | HDMI2,      | Music Cast  | AV Receiver |
   |             |               | HDMI3,      | Amplifier   | change      |
   |             |               | HDMI4,      |             | input to    |
   |             |               | phono,      |             | HDMI1"      |
   |             |               | audio1,     |             |             |
   |             |               | audio2 and  |             |             |
   |             |               | "           |             |             |
   |             |               | chromecast" |             |             |
   +-------------+---------------+-------------+-------------+-------------+
   | Lock        | Experimental\*| Lock/       | MQTT        | "Alexa,     |
   | Control     |               | Unlock      | connected   | Lock Front  |
   |             |               |             | Lock        | Door", "OK  |
   |             |               |             |             | Google,     |
   |             |               |             |             | unlock      |
   |             |               |             |             | Front Door" |
   +-------------+---------------+-------------+-------------+-------------+
   | Motion      | MotionSensor  | \*No        | N/A         | You can use |
   | Sensor      |               | commands\*  |             | this        |
   |             |               |             |             | interface   |
   |             |               |             |             | as a        |
   |             |               |             |             | trigger     |
   |             |               |             |             | with Alexa  |
   +-------------+-------------+-------------+-------------+-------------+
   | Playback    | Experimental  | Play,       | Kodi RPC    | "Alexa,     |
   | Control     |               | Pause,      | (including  | (pause \|   |
   |             |               | Stop, Fast  | Plex Addon  | play \|     |
   |             |               | Forward,    | control)    | stop)       |
   |             |               | Rewind,     |             | Kitchen     |
   |             |               | Next,       |             | TV", "Hey   |
   |             |               | Previous,   |             | Google,     |
   |             |               | Start Over  |             | pause       |
   |             |               |             |             | Kitchen TV  |
   +-------------+---------------+-------------+-------------+-------------+
   | Percentage  | None          | Increase    | Any MQTT    | "Alexa, set |
   | Control     |               | by%,        | enabled Fan | Bedroom Fan |
   |             |               | decrease by |             | to 50%"     |
   |             |               | %, set to   |             |             |
   |             |               | specific %  |             |             |
   +-------------+---------------+-------------+-------------+-------------+
   | Power       | OnOff         | On/ Off     | Any MQTT    | "Alexa,     |
   | Control     |               |             | enabled     | turn (on \| |
   |             |               |             | sm          | off)        |
   |             |               |             | art-switch/ | Kitchen     |
   |             |               |             | plug, KODI  | Light",     |
   |             |               |             | RPC (w/     | "Alexa,     |
   |             |               |             | HDMI CEC)   | turn (on \| |
   |             |               |             |             | off)        |
   |             |               |             |             | Kitchen     |
   |             |               |             |             | TV", "Hey   |
   |             |               |             |             | Google,     |
   |             |               |             |             | turn (on \| |
   |             |               |             |             | off)        |
   |             |               |             |             | Kitchen     |
   |             |               |             |             | Light"      |
   +-------------+---------------+-------------+-------------+-------------+
   | Range       | OpenClose     | 0-100       | Any MQTT    | "Alexa,     |
   | Control     | (Support      | (Blinds),   | enabled     | (raise \|   |
   |             | for Blinds/   | 0-10        | smart       | lower)      |
   |             | Awning        | (Anything   | blinds.     | Kitchen     |
   |             | only)         | else)       |             | Blind",     |
   |             |               |             |             | "Alexa, set |
   |             |               |             |             | Kitchen     |
   |             |               |             |             | Blind to    |
   |             |               |             |             | 100", "Hey  |
   |             |               |             |             | Google,     |
   |             |               |             |             | (close \|   |
   |             |               |             |             | open)       |
   |             |               |             |             | Kitchen     |
   |             |               |             |             | Blind"      |
   +-------------+---------------+-------------+-------------+-------------+
   | Scene       | Scene         | On/ Off     | Any MQTT    | "Alexa,     |
   | Control     |               |             | enabled     | turn on     |
   |             |               |             | s           | Movie       |
   |             |               |             | mart-switch | Night",     |
   |             |               |             |             | "Hey        |
   |             |               |             |             | Google,     |
   |             |               |             |             | start Movie |
   |             |               |             |             | Night"      |
   +-------------+---------------+-------------+-------------+-------------+
   | Speaker     | Experimental  | Set volume  | Amplifier,  | "Alexa,     |
   | Control     |               | to #,       | AVR, any    | (increase   |
   |             |               | increase/   | device that | \| decrease |
   |             |               | decrease    | can be set  | \| mute)    |
   |             |               | volume,     | to a        | volume on   |
   |             |               | mute,       | specific    | AV          |
   |             |               | unmute      | volume      | Receiver,"  |
   |             |               |             |             | "Alexa, set |
   |             |               |             |             | volume on   |
   |             |               |             |             | AV Receiver |
   |             |               |             |             | to 50",     |
   |             |               |             |             | "Hey        |
   |             |               |             |             | Google, set |
   |             |               |             |             | AV Reciver  |
   |             |               |             |             | volume to   |
   |             |               |             |             | 25%"        |
   +-------------+---------------+-------------+-------------+-------------+
   | Step        | None          | Increase/   | Device that | "Alexa,     |
   | Speaker     |               | decrease    | cannot be   | (increase   |
   | Control     |               | volume,     | set to      | \| decrease |
   |             |               | mute,       | specific    | \| mute)    |
   |             |               | unmute      | volume,     | volume on   |
   |             |               |             | only        | AV          |
   |             |               |             | increase/   | Receiver"   |
   |             |               |             | decrease    |             |
   |             |               |             | and mute    |             |
   +-------------+---------------+-------------+-------------+-------------+
   | Temperature | None          | \*No        | N/A         | "Alexa,     |
   | Sensor      |               | commands\*  |             | what is the |
   |             |               |             |             | temperature |
   |             |               |             |             | the         |
   |             |               |             |             | Lounge?"    |
   +-------------+---------------+-------------+-------------+-------------+
   | Thermostat  | Temperature   | Auto, Eco,  | Any         | "Alexa, set |
   | Control     | Setting       | Heat, Cool, | Thermostat  | Thermostat  |
   | (Single     |               | specific    | endpoint in | to 22       |
   | Point)      |               | temperature | Node-Red    | degrees",   |
   |             |               |             |             | "Hey        |
   |             |               |             |             | Google, set |
   |             |               |             |             | Thermostat  |
   |             |               |             |             | to 22       |
   |             |               |             |             | degrees"    |
   +-------------+---------------+-------------+-------------+-------------+