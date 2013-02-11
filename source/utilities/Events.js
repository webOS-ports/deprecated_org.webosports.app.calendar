//Create a settings manager.
//Using a singleton lets us just maintain one set of preferences and access it from other kinds.
enyo.singleton({
	name: "calendar.Events",
	kind: "Control",
	
	
	memevt: {},
	
	//Always keep these months in the cache:
	retain: [moment().startOf("month").subtract("months", 1), moment().startOf("month").add("months", 1)],
	
	components: [
		{kind: "Signals", ondeviceready: "deviceready"}
	],
	
	deviceready: function(){
		this.loadEvents();
	},
	
	//Load events from DB:
	loadEvents: function(q, cb){
		var query = {
			"from": "org.webosports.calendarevent:1",
			"orderBy": "eventDisplayRevset",
		};
		if(q && q.page){
			query.page = q.page;
		}
		this._query = query;
		navigator.service.Request("palm://com.palm.db/", {
			"method": "find",
			"parameters": {
				"query": query
			},
			onSuccess: enyo.bind(this, "loadEventsHandler"),
			onFailure: function(inSender){
				console.log("FAILED DELETE");
				console.log(JSON.stringify(inSender));
			}
		});
	},
	loadEventsHandler: function(inSender){
		var response = inSender && inSender.results;
		console.log("GOT EVENTS");
		console.log(JSON.stringify(inSender));


		if(!response){
			console.error("Event Manager: query failed");
			return false;
		}
		
		this.queryResults = this._query.page ? this.queryResults.concat(response) : response;
		
		if (inSender.next) {
            this.loadEvents({page: inSender.page});
			return true;
		}
		
		//TODO: Implement this stuff?
		/*
		delete query.page;													// Last or only page of results so clear query's page.

		var revsetNum1 = getRevsetNumber(revsetResponse1) || 0;
		var revsetNum2 = getRevsetNumber(revsetResponse2) || 0;

		thi$.lastRevsetNumber = Math.max(revsetNum1, revsetNum2);

		thi$.utils.loadTimezones (thi$.queryResults);						// Cache any new timezone rules.
		thi$.notifyObservers();												// Notify listeners of event changes.
		watchEvents();														// Continue observing DB changes.
		return true;
		*/
		
		this.finishLoad();
		return true;
	},
	finishLoad: function(){
		//Events are now all loaded, prepare them:
		this.prepareEvents({from: this.retain[0], to: this.retain[1]});
	},
	queryResults: [],
	
	//Prepare events from a specific range and load them into the cache.
	prepareEvents: function(range){
		//TODO: We may have some JS Execution Timeout issues here, so we'll have to look into chunking the processing like webOS 3.0 does.
		//TODO: Allow batch processing so that this function doesn't get called multiple times and thus so we do not loop through the entire queryResults array multiple times? We ideally don't need to do this because batch results really should not happen. But in the events that they do, we should avoid looping that much.
		
		//TODO: We may want to keep an arry of processed time ranges so that we can load them up instead of looping. Either that or use getEvents/getEventsRange exclusively.
		return;
		
		//Array of the occurences of events in this range:
		var occurrences = [];
		var events;
		
		//Loop through all of the loaded events:
		enyo.forEach(this.queryResults, enyo.bind(this, function(event){
			okEvent = ("dtstart" in event) && ("dtend" in event) && isFinite(event.dtstart) && isFinite(event.dtend);
			if(!okEvent){
				console.error("===== Skipping malformed calendar event: " + event._id);
				return;
			}
			
			//TODO: Implement all of this:
			
			//The event is not a repeating event, so simply push it to the occurences.
			if (!event.rrule) {
				if (this.utils.occursInRange(event, tempRange)) {
					occurrences.push(event);
				}
			}
			//This is a repeating event, so it needs some processing done.
			else {
				if(event.rrule.count){
					events = this.utils.findRepeatsInRangeCountVersion(event, tempRange);
				}
				else{
					//Repeating events may occur multiple times in the range
					events = this.utils.findRepeatsInRange(event, tempRange, limit);
				}

				if (events.length > 0) {
					occurrences = occurrences.concat(events);
				}
			}
		}));
	},
	
	//TODO: What happens if the events aren't ready when this is called?
	//Loads the events from the memory for one specific day.
	getEvents: function(date){
		//Get events out of the memory, if it exists. If it does not, then request it, and then send it back.
		if(this.memevt[moment(date).startOf("day")]){
			return this.memevt[moment.unix(date).startOf("day").unix()];
		}
		//Pad the prepare by a month in each direction.
		this.prepareEvents({from: moment.unix(date).subtract("months", 1), to: moment.unix(date).add("months", 1)});
		return this.memevt[moment.unix(date).startOf("day").unix()];
	},
	//Loads the events from memory for a range of days, which can be helpful if you don't want to call getEvents multiple time.
	//This should be used for calendar and month views. The day view doesn't really need this, it only needs one day, so it should call getEvents.
	getEventsRange: function(range){
		
	},
	
	
	createEvent: function(evt){
		//Add in the kind:
		evt._kind = "";
		//Create a new event based on the one we just passed:
		var nevt = new CalendarEvent(evt);
		console.log("Creating New Event...");
		console.log(nevt);
		return;
		//Put it in the database:
		navigator.service.Request("palm://com.palm.db/", {
			"method": "put",
			"parameters": {
				"objects": [nevt]
			},
			onSuccess: enyo.bind(this, "loadEventsHandler"),
			onFailure: function(inSender){
				console.log("FAILED PUT");
				console.log(JSON.stringify(inSender));
			}
		});
	},
	deleteEvent: function(){
		
	},
	updateEvent: function(){
		
	}
});

