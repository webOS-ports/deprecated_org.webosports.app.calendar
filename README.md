NO LONGER ACTIVELY DEVELOPED
========

Pending the uncertain future of Enyo 2, it was decided to no longer actively develop the Enyo 2 version of the Calendar app. It was not having much functionality anyway. We have switched back to the Enyo 1 based Calendar app which seems to behave pretty well nowadays on our UI.

Calendar
========

The Calendar app for webOS Ports, built with Enyo2.

Info
----

This application is built from scratch using 

Building
--------

A makefile is included for easing the building processes. The makefile assumes you have Node installed, as well as the Palm/HP webOS command-line tools. The makefile also provides some utilities that are just aimed at testing the application on a connected webOS device.

#### make build

Runs the standard Enyo2 minification and deployment process. This also creates an IPK for the app.

#### make run

First, runs `build`, then installs and launches the application on a connected device using palm-install and palm-launch.

#### make debug

Runs `build` and `make`, and then follows logs on the device the application launched on.

#### make clean

Removes the build and deploy directories and uninstalls the application from the connected device. 

#### make db8

Installs the db8 configurations on the currently connected webOS device. The configurations are set up when the operating system is built, and are not established by the app itself. Because of this, you will need to install the db kinds and permissions separately. 

Todo
----

There are several elements of the application that are still in development. Below is an incomplete list of the functionality that has yet to be added to the app.

- Finalize core functionality (event handling, db management, event display).
- Solidify nowindow handling.
- Accept "Just Type" launch arguments as well as app icon change.
- Make sure that activities work.
- Week view.
- Manage reminders, build out reminder service.
- Localize the entire application (am/pm too).
- Figure out the multi-calendar situation with account manager.
