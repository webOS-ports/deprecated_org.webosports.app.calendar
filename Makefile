SHELL=/bin/sh
VERSION=0.0.2

debug: run
	@echo "Debugging the application"
	@palm-log -f org.webosports.app.calendar

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
	
.PHONY: build