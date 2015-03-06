#!/bin/bash
node enyo/tools/deploy.js -o deploy/org.webosports.app.calendar
adb push deploy/org.webosports.app.calendar /usr/palm/applications/org.webosports.app.calendar

adb shell luna-send -n 1 luna://com.palm.applicationManager/rescan {}

adb shell systemctl restart luna-next
  