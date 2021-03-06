# Tempomat, a CI monitor for all your devices

Tempomat is a macOS/iPhone/iPad application to monitor your CI pipelines in all of your devices.

## [Get it on the app store](https://apps.apple.com/de/app/tempomat-ci-status-monitor/id1509296762?l=en)

![Tempomat Banner](https://github.com/ospfranco/tempomat/blob/master/assets/Banner1.jpg?raw=true)

## Features
- See all of your repository branches in a single view
- Securely store API tokens on your device
- Connects with different CI systems APIs to provide a rich integration
- Written in React-Native, runs everywhere (and is performant)
- Receive a notification when a build breaks

## Licensing
Tempomat is licensed under the Outrun Labs EULA 1.1.

The TL;DR is:

- Free for non-commercial and educational use.
- Commercial use requires the purchase of a license.
- You may not redistribute source code or binaries under a different license.

That being said, there is nothing stopping you from building the project from the source and just running it yourself, that's ok, just don't try to rebrand it an sell it under a different name, there is a packaged version on the app stores for a small fee which would be a great way of giving back.

## Android Support
This being a RN app can also run on android, however I have run out of free time to add such big features without receiving some economic incentive, if you do create a PR I would gladly merge it and release it though, you only need to create a small amount of native code to securely store strings on mobile devices.

## Contributing
Feel free to open a PR, I will gladly review it and merge into master and manage all the release cycle.

Tempomat is probably the worlds first RN app built with [react-native-macos](https://github.com/microsoft/react-native-macos) and the worlds first commercially released RN menu bar app, so it is definitely a very interesting technology, feel free to hit me up on [twitter](https://twitter.com/osfrnc)