enyo.depends(
	//Include Libraries:
	"$lib/g11n",
	"$lib/util",
	"$lib/layout",
	"$lib/moment",
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
	"$lib/webos-lib",

	// CSS/LESS style files
	"style",
	// Model and data definitions
	"data",
	// View kind definitions
	"views",
	//Load up the utilities to save events, preferences, etc:
	"utilities",
	// Frist Use
	"firstuse",
	// Include our default entry point
	"app.js"
);
