enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx",
	handlers: {
		onFirstUseDone: "doneFirstUse",
		onNewEvent: "showNewEvent",
		onShowCalendar: "showCalendar",
	},
	components: [
		
		{kind: "AppMenu", components: [
			{content: "Preferences"}
		]},
		
		{kind: "Panels", draggable: false, name: "raw", fit: true, components: [
			//TODO: Do we really need the splash page anymore?
			{name: "splash", kind: "calendar.Splash", fit: true},
			{name: "firstuse", kind: "calendar.FirstUse", fit: true},
			{name: "mainapp", kind: "calendar.MainApp", fit: true},
			{name: "newevent", kind: "calendar.NewEvent"},
			{name: "prefview", kind: "calendar.PreferencesView"}
		]},

		{kind: "CoreNavi", fingerTracking: true}
	],

	doneFirstUse: function(){
		this.showMainApp();
	},
	
	showNewEvent: function(){
		this.$.raw.setIndex(3);
	},
	
	showMainApp: function(){
		this.$.raw.setIndex(2);
		this.$.mainapp.navigated();
	},
	
	showCalendar: function(){
		this.$.raw.setIndex(2);
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
