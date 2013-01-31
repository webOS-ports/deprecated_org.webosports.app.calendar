Calendar
========

The Calendar app, built with Enyo2, for webOS Ports.

Info
----

Don't mind me. Yet...

Building
--------

A makefile is including for easing the building processes. The makefile assumes you have Node installed, as well as the Palm/HP webOS command-line tools.

#### make build

Runs the standard Enyo2 minification and deployment process

#### make run

First, runs `build`, then installs and launches the application on a connected device using palm-install and palm-launch.

#### make debug

Runs `build` and `make`, and then follows logs on the device the application launched on.

Todo
----
Figure out the appinfo.json settings.
Make everything work.
Week view.
First use DB setup.