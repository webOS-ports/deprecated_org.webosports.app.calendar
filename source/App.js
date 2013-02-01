enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx",

	handlers: {
		onFirstUseDone: "doneFirstUse"
	},

	components: [
		{kind: "Signals",
		ondeviceready: "deviceready",
		onbackbutton: "handleBackGesture",
		onCoreNaviDragStart: "handleCoreNaviDragStart",
		onCoreNaviDrag: "handleCoreNaviDrag",
		onCoreNaviDragFinish: "handleCoreNaviDragFinish",
		onSettingsLoad: "loadSettings"},

		{kind: "Panels", draggable: false, name: "raw", fit: true, components: [
			//TODO: Splash:
			{fit: true, name: "splash", components: [
				{kind: "Image", src: "assets/icon-256x256.png", style: "margin: 0px auto; display: block; position: relative; top: 50%; margin-top: -128px;"}
			]},
			{name: "firstuse", kind: "calendar.FirstUse", fit: true},
			{name: "MainApp", kind: "calendar.MainApp", fit: true}
		]},

		{kind: "CoreNavi", fingerTracking: true}
	],

	doneFirstUse: function(){
		this.$.raw.setIndex(2);
	},
	
	loadSettings: function(inSender, inPrefs){
		//TODO: Move this outside to the nowindow manager?
		if(inPrefs.firstlaunch){
			//First Launch:
			this.$.raw.setIndex(1);
		}else{
			//Databased have already been set up.
			this.$.raw.setIndex(2);
		}
	}
});
