**********
Node Outputs
**********
Note that outputs are consistent across Alexa and Google Home issued commands, this is intentional in order to eliminate the need to re-engineer flows/ create complex logic to manage the different command directives.

Light-Specific Capabilities/ Traits
################

Brightness Control
***************
Set Brightness command output, used when specifying a specific percentage, such as 80%::

    msg : {
                topic: ""
                name: "Bedroom Light"
                _messageId: "9c289ee2-fd71-4222-ad55-8a894f70b319"
                _endpointId: "29"
                _confId: "bfd0fcf4.bc90e"
                command: "SetBrightness"
                extraInfo: object
                payload: 80
                acknowledge: true
                _msgid: "c484148c.0aa918"
            }

Adjust Brightness command output, used when reducing/ increasing brightness (either by a specific amount or stating increase/ decrease)::

    msg : {
                topic: ""
                name: "Bedroom Light"
                _messageId: "8cbe1407-34f1-4eef-97c9-007b4b4edcfd"
                _endpointId: "29"
                _confId: "bfd0fcf4.bc90e"
                command: "AdjustBrightness"
                extraInfo: object
                payload: -25
                acknowledge: true
                _msgid: "87891d99.acdbb"
            }

Color Control
***************
Set colour command output, used when specifying a specific colour, such as green::

    msg : {
                topic: ""
                name: "Test Smartlight"
                _messageId: "245ae0ea-40cb-4a44-8618-fdea822de1bf"
                _endpointId: "99"
                _confId: "bfd0fcf4.bc90e"
                command: "SetColor"
                extraInfo: object
                payload: {
                    "hue": 350.5,
                    "saturation": 0.7138,
                    "brightness": 0.6524
                    }
                acknowledge: true
                _msgid: "334fa7b2.f8d148"
                }

.. tip:: msg.payload will be a JSON object containing hue, saturation and brightness values.

Color Temperature Control
***************
Set color temperature command output, used when specifying values either by name, or numerical value in Kelvin:

    -  warm \|\| warmwhite: 2200
    -  incandescent \|\| soft white: 2700
    -  white: 4000
    -  daylight \|\| daylight white:5500
    -  cool \|\| cool white: 7000

::
    msg : {
                topic: ""
                name: "Bedroom Light"
                _messageId: "d506edb8-29a4-4009-9882-b17fe18e982d"
                _endpointId: "99"
                _confId: "bfd0fcf4.bc90e"
                command: "SetColorTemperature"
                extraInfo: object
                payload: 2200
                acknowledge: true
                _msgid: "47f1c84f.65f138"
            }


Lock-Specific Capabilities/ Traits
################
Lock/ unlock command output::

    msg : {
                topic: ""
                name: "Door Lock"
                _messageId: "5a15c0c4-1e05-4ca6-bf40-fca4393c2ec4"
                _endpointId: "128"
                _confId: "bfd0fcf4.bc90e"
                command: "Lock"
                extraInfo: object
                payload: "Lock"
                acknowledge: true
                _msgid: "7ce7f0e3.e96bd"
            }

Media-Specific Capabilities/ Traits
################

Channel Control
***************
Change channel command output, used when specifying a specific channel number, such as 101::

    msg : {
                topic: ""
                name: "Lounge TV"
                _messageId: "01843371-f3e1-429c-9a68-199b77ffe577"
                _endpointId: "11"
                _confId: "bfd0fcf4.bc90e"
                command: "ChangeChannel"
                extraInfo: object
                payload: "101"
                acknowledge: true
                _msgid: "bd3268f0.742d98"
            }

Command output, used when specifying a specific channel number, such as BBC 1::

    msg : {
                topic: ""
                name: "Lounge TV"
                _messageId: "c3f8fb2d-5882-491f-b0ce-7aa79eaad2fe"
                _endpointId: "11"
                _confId: "bfd0fcf4.bc90e"
                command: "ChangeChannel"
                extraInfo: object
                payload: "BBC 1"
                acknowledge: true
                _msgid: "db9cc171.e30de"
            }

.. warning:: Channel names are only supported by Alexa, you can only use channel numbers when using this capability/ trait with Google Assistant.

Input Control
***************
Select input command output, used when specifying a specific input such as "HDMI 2"::

    msg : {
                topic: ""
                name: "Lounge TV"
                _messageId: "4e12b3dd-c5a0-457a-ad8b-db1799e10398"
                _endpointId: "11"
                _confId: "bfd0fcf4.bc90e"
                command: "SelectInput"
                extraInfo: object
                payload: "HDMI 2"
                acknowledge: true
                _msgid: "74f61e13.34871"
            }

Playback Control
***************
For playback control, msg.command changes, base dupon the requested action (i.e. Play, Pause etc)::

    msg : {
                topic: ""
                name: "Lounge TV"
                _messageId: "f4379dcb-f431-4662-afdc-dc0452d313a0"
                _endpointId: "11"
                _confId: "bfd0fcf4.bc90e"
                command: "Play"
                extraInfo: object
                acknowledge: true
                _msgid: "fda4a47c.e79c08"
            }
