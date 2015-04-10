

enyo.kind({
	name: "calendar.MainView",
	kind: "FittableRows",
	classes: "onyx",
	handlers: {
		onFirstUseDone: "doneFirstUse",
		onNewEvent: "showNewEvent",
		onShowCalendar: "showCalendar",
	},
	components: [
		{kind: "Panels", draggable: false, name: "raw", fit: true, components: [
			//TODO: Do we really need the splash page anymore?
			{name: "splash", kind: "calendar.Splash", fit: true},
			{name: "firstuse", kind: "calendar.FirstUse", fit: true},
			{name: "mainapp", kind: "calendar.MainApp", fit: true},
			{name: "newevent", kind: "calendar.NewEvent"},
			{name: "prefview", kind: "calendar.PreferencesView"}
		]},

		{kind: "CoreNavi", fingerTracking: true},
		
		{kind: "enyo.AppMenu", components: [
			{content: $L("Preferences") , ontap: "showPrefview"},
		]},
	],

	doneFirstUse: function(){
		this.showMainApp();
	},
	showMainApp: function(){
		this.$.raw.setIndex(2);
		this.$.mainapp.navigated();
	},
	showCalendar: function(){
		this.$.raw.setIndex(2);
	},
	showNewEvent: function(){
		this.$.newevent.resetView();
		this.$.raw.setIndex(3);
	},	
	showPrefview: function(){
		this.$.raw.setIndex(4);
	},
	
	create: function(){
		this.inherited(arguments);
		
		//Used for browser debugging:
		if(!window.PalmSystem){
			this.$.raw.setIndex(1);
			return;
		}
		
		var params = enyo.getWindowParams();
		if(params && !params.firstlaunch){
			this.showMainApp();
		}else{
			this.$.raw.setIndex(1);
		}
	}
});
