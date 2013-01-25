enyo.depends(
	"$lib/layout",
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
	"$lib/webos-ports-lib",
	"$lib/moment",
	"App.css",
	"App.js",
	"AppPanels.js",
	//The kind used to manage displaying an infinite amount of panels:
	"InfinitePanels.js",
	//Now the different view type kinds:
	"Day.js"
);
