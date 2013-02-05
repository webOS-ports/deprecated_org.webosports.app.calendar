enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx",
	handlers: {
		onFirstUseDone: "doneFirstUse"
	},
	components: [
		
		{kind: "AppMenu", components: [
			{content: "Preferences"}
		]},
		
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
	
	showMainApp: function(){
		this.$.raw.setIndex(2);
		this.$.mainapp.navigated();
	},
	
	create: function(){
		this.inherited(arguments);
		var params = (PalmSystem.launchParams && navigator.window.launchParams()) || {};
		console.log(PalmSystem.launchParams);
		if(params && !params.firstLaunch){
			this.showMainApp();
		}else{
			this.$.raw.setIndex(2);
		}
		//Used for browser debugging:
		if(!window.PalmSystem){
			this.$.raw.setIndex(1);
		}
	}
});
