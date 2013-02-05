enyo.depends(
	//Include Libraries:
	"$lib/layout",
	"$lib/g11n",
	"$lib/onyx",
	"$lib/webos-ports-lib",
	"$lib/util",
	"$lib/moment",
	
	//Main app css. Views have their own CSS files too.
	"App.css",
	
	//Load up the utilities to save events, preferences, etc:
	"utilities",

	//Core UI JavaScript:
	"App.js",
	"AppPanels.js",
	
	//Preferences View:
	"PreferencesView.js",
	
	//Splash Scrren:
	"Splash.js",

	//First Use Manager:
	"firstuse",

	//The kind used to manage displaying an infinite amount of panels:
	"InfinitePanels.js",

	//Now the different view type kinds:
	"Day.js",
	"Day.css",
	"Month.js",
	"Month.css"
);
