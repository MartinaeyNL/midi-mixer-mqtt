# MQTT Plugin - Fork by MartinaeyNL

## Enable MQTT communication for controlling your devices.

A fork of the MQTT Plugin by Theo428, trying to add more flexibility in use cases.
This is a plugin allows you to send messages from your MIDI device to any MQTT broker / external system.
Listening to MQTT subscriptions is not supported at this time.

### Features:
- Send updates over MQTT to a external broker / device of your choice.
- Customize MQTT topic and message per trigger. (such as 'volume change' or 'mute press')
- Allows string variables like `{id}`, `{value}`, and `{host}` to be used within the settings.
- Configurable throttle of volume slider to prevent a large load on the broker.

## Getting Started

Before getting started, make sure you have MIDI Mixer installed, and **you have a MQTT broker set up to connect to.**
For example, a custom broker, or any built in ones in [Home Assistant](https://github.com/home-assistant/addons/blob/master/mosquitto/DOCS.md), [OpenRemote](https://github.com/openremote/openremote/wiki/User-Guide%3A-Manager-APIs#mqtt-api-mqtt-broker) or any other IoT platform.

1. Download the plugin with the latest release from the [releases](https://github.com/MartinaeyNL/midi-mixer-mqtt/releases) page on GitHub.
2. Run the `.midiMixerPlugin` file.
3. In MIDI Mixer, go to the plugins page, and it should appear there. If not, press the refresh button on top.
4. Select the plugin, go to the [settings](#settings) tab, and fill in your preferences. Details of the options are below.
5. Activate the plugin.

## Settings

A short description of the plugin options that are available.
The configurable events are listed below.

|  Option | Default | Description |
|--|--|--|
| MQTT Broker Host | `mqtt://localhost:1183` | The address used to connect to the MQTT broker. |
| MQTT Username | *empty* | Username to use for authentication. |
| MQTT Password | *empty* | Password / secret to use for authentication. |
| MQTT Client ID | `midi-mixer-app-1` | The client ID to use when connecting. This is normally only used as unique identifier, but you can adjust this if needed. |
| Number of Assignments to create | 3 | This is the amount of "assignments" it needs to create within MIDI Mixer. To explain; "the entries you can link with, for example, a volume slider or button." |
| On **(event)** - MQTT Publish topic | `{clientId}/write/{id}` | MQTT topic to send messages to when any of the assignments trigger this type of event. You can use `{id}` to differentiate the sliders. |
| On **(event)** - MQTT Publish message | `{value}` | MQTT message/content to send to the topic specified above when any of the assignments trigger this type of event. |
| Throttle in ms for volume sliders | 100 | Minimum amount of milliseconds between sending MQTT messages for volume sliders. |

The configurable events are:
- On volume change
- On assign button press
- On mute button press
- On run button press


## Variables

Within the settings you can use the following variables;
| Variable | Description |
|---|---|
| `{host}` | MQTT host url |
| `{username}` | MQTT username |
| `{password}` | MQTT password |
| `{clientId}` | MQTT client ID / unique identifier |

<br />

Only applicable for "On (event)" options;

| Variable | Description |
|---|---|
| `{id}` | ID of the MIDI Mixer assignment. It's a primary that counts from 0 to ... |
| `{value}` | Value sent by the MIDI Mixer assignment. For the volume slider this is a value from 0 to 1, buttons will provide an empty string `''`. |


## FAQ

- **"Can I also listen for MQTT messages?"**
  No this is not supported yet.

- **"It doesn't seem to connect to my MQTT broker!"**
  Double check this using a separate application to be sure.
  A desktop notification should appear when an error appears. You can also enable dev mode to see logs.
  This fork has a very basic setup, so I wouldn't be surprised if it breaks in some scenarios.
  Make an issue and/or contribute if it did.

- **"The MQTT Broker I want to use doesn't have authentication."**
  'You should!' is the simple answer, but it's currently not supported. Will work on this.


## Contributing
This fork started out at as a simple "I want it to work for my setup"-project, what is basically still is.
However I'm happy if developers want to contribute to this plugin; open an issue / PR / or send me a message!
