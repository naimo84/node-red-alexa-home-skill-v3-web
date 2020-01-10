**********
Node Outputs
**********
Note that outputs are consistent across Alexa and Google Home issued commands, this is intentional in order to eliminate the need to re-engineer flows/ create complex logic to manage the different command directives.

Brightness Control
################

Set Brightness
***************
Command output, used when specifying a specific percentage, such as 80%::

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

Adjust Brightness
***************
Command output, used when reducing/ increasing brightness::

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

Channel Control
################

Change Channel
***************
Command output, used when specifying a specific channel number, such as 101::
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

Change Channel
***************
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