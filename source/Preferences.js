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
		console.log(JSON.stringify(inSender));
		if(result.length === 0){
			this._first();
		}else{
			this.prefs = result[0];
			console.log("GOT PREFS!  ===   " + JSON.stringify(this.prefs));
		}
		
	    if (result.length > 1) {
			console.log("Too Many Results");
           var latestPrefIndex = 0;
           var latestPrefRev = results[0]._rev;
           var idsToDelete = [results[0]._id];
           //find the latest one
           for (var i = 1; i < resultsLength; i++) {
               var rev = results[i]._rev;
               idsToDelete.push(results[i]._id);
               if (rev > latestPrefRev) {
                   latestPrefIndex = i;
                   latestPrefRev = rev;
               }
           }
           this.prefs = results[latestPrefIndex];
           //this.plog("gotPrefs: spare prefs in the db!");
           idsToDelete.splice(latestPrefIndex, 1);

           //delete the spares
           this.databaseManager.deleteByIds(idsToDelete, this.deleteCB, this.deleteCB);
       }
	},
	//First time setup:
	_first: function(){
		//TODO: Defaults
		this.prefs = {
			_kind: "org.webosports.calendarprefs:1",
			firstlaunch: true
		};
		this._put(this.prefs);
	    //this.prefs = enyo.clone(calendar.PrefsManager.defaultPrefs);
	},
	//Puts the actual settings object into the database and calls the signal so that all listening elements get the update.
	//This should only be called internally. The implementation of this is hidden a few layers up.
	_put: function(prefs){
		if(!prefs){
			return false;
		}
		this.prefs = prefs;
		
		if(this.prefs._id){
			console.log("ID ALREADY EXISTS, MERGE");
			return;
			//The preferences already exist, call merge:
			navigator.service.Request("palm://com.palm.db/", {
				"method": "merge",
				"parameters": {
					"query": {
						"from": "org.webosports.calendarprefs:1"
					}
				},
				onSuccess: enyo.bind(this, "gotPrefs"),
				onFailure: function(inSender){
					console.log("FAILED MERGE");
					console.log(JSON.stringify(inSender));
				}
			});
		}else{
			//First time inserting prefs:
			navigator.service.Request("palm://com.palm.db/", {
				"method": "put",
				"parameters": {
					"objects": [prefs]
				},
				onSuccess: enyo.bind(this, "savedPrefs"),
				onFailure: function(inSender){
					console.log("FAILED PUT");
					console.log(JSON.stringify(inSender));
				}
			});
		}
		
		//We could defer this until after the db8 process is complete, but there's no need to because we know what the settings are:
		enyo.Signals.send("onSettingsChange", this.prefs);
	},
	savedPrefs: function(inSender){
		if(inSender && inSender.returnValue){
			console.log("PREFERENCES SET!");
			this.prefs._id = inSender.results[0]._id || null;
		}
	}
});

