SHELL=/bin/sh
VERSION=0.0.3

debug: run
	@echo "Debugging the application"
	@palm-log -f org.webosports.app.calendar
	
clean: 
	@echo "Removing Deploy Locations"
	@rm -r build
	@rm -r deploy
	@echo "Removing Application"
	@palm-install -r org.webosports.app.calendar
	@echo "Application Removed"

run: build
	@echo "Installing org.webosports.app.calendar_$(VERSION)_all"
	@palm-install deploy/org.webosports.app.calendar_$(VERSION)_all.ipk
	@palm-launch org.webosports.app.calendar

build:
	@echo "Building Application"
	@tools/deploy.sh --cordova-webos
	@echo "Application Built"
	@echo "Creating IPK"
	@palm-package -o deploy/ deploy/org.webosports.app.calendar
	@echo "Application IPK Created"
	
db8: 
	@echo "Copying db8 Configurations to Device"
	@ssh -p 10022 root@localhost 'mount -o remount,rw /'
	@scp -P 10022 configuration/db/kinds/* root@localhost:/etc/palm/db/kinds/
	@echo "Copy Complete"
	@echo "Copying Activities"
	@scp -P 10022 configuration/activities/org.webosports.app.calendar/* root@localhost:/etc/palm/activities/
	@echo "Added Activities!"
	@echo "Restarting Device"
	@ssh -p 10022 root@localhost 'mount -o remount,ro /'
	@ssh -p 10022 root@localhost 'reboot'
	@echo "DB8 Setup Complete"
	
.PHONY: build