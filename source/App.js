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
		//TODO: Do we really need the splash page anymore?
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
		var params = enyo.getWindowParams();
		if(params && !params.firstlaunch){
			this.showMainApp();
		}else{
			this.$.raw.setIndex(1);
		}
		//Used for browser debugging:
		if(!window.PalmSystem){
			this.$.raw.setIndex(1);
		}
	}
});
