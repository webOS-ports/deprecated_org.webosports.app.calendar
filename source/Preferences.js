//Create a settings manager.
//Using a singleton lets us just maintain one set of preferences and access it from other kinds.
enyo.singleton({
	name: "calendar.Preferences",
	kind: "Control",
	components: [
		{kind: "Signals", ondeviceready: "deviceready"}
	],
	deviceready: function(){
		this.getPrefs();
	},
	getPrefs: function(){
		navigator.service.Request("palm://com.palm.db/", {
			"method": "find",
			"parameters": {
				"query": {
					"from": "org.webosports.calendarprefs:1"
				}
			},
			onSuccess: enyo.bind(this, "gotPrefs"),
			onFailure: function(inSender){
				console.log("F");
				console.log(JSON.stringify(inSender));
			}
		});
	},
	gotPrefs: function(inSender){
		var result = inSender && inSender.results;
		if(result.length === 0){
			this._first();
		}
	},
	//First time setup:
	_first: function(){
		console.log("TODO: Set up db");
		this.prefs = "TEST";
		this._put();
	    //this.prefs = enyo.clone(calendar.PrefsManager.defaultPrefs);
	},
	//Puts the actual settings object into the database and calls the signal so that all listening elements get the update.
	//This should only be called internally. The implementation of this is hidden a few layers up.
	_put: function(){
		enyo.Signals.send("onSettingsChange", this.prefs);
	}
});