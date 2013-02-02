enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx",
	handlers: {
		onFirstUseDone: "doneFirstUse"
	},
	components: [
		{kind: "Signals", onSettingsLoad: "loadSettings"},

		{kind: "Panels", draggable: false, name: "raw", fit: true, components: [
			{name: "splash", kind: "calendar.Splash", fit: true},
			{name: "firstuse", kind: "calendar.FirstUse", fit: true},
			{name: "mainapp", kind: "calendar.MainApp", fit: true}
		]},

		{kind: "CoreNavi", fingerTracking: true}
	],

	doneFirstUse: function(){
		this.showMainApp();
	},
	
	loadSettings: function(inSender, inPrefs){
		//TODO: Move this outside to the nowindow manager?
		if(inPrefs.firstlaunch){
			//First Launch:
			this.$.raw.setIndex(1);
		}else{
			//Databased have already been set up.
			this.showMainApp();
		}
	},
	
	showMainApp: function(){
		this.$.raw.setIndex(2);
		this.$.mainapp.navigated();
	},
	
	create: function(){
		this.inherited(arguments);
		//Used for browser debugging:
		if(!window.PalmSystem){
			this.$.raw.setIndex(1);
		}
	}
});
