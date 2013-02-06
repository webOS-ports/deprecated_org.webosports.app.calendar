//Create a settings manager.
//Using a singleton lets us just maintain one set of preferences and access it from other kinds.
enyo.singleton({
	name: "calendar.Events",
	kind: "Control",
	
	
	memevt: {},
	
	
	requestEvents: function(range){
		//Load events from a range into memory.
	},
	getEvents: function(){
		//Get events out of the memory, if it exists. If it does not, then request it, and then send it back.
	},
	freeEvents: function(){
		//Free events from memory.
	},
	
	
	
	createEvent: function(){
		
	},
	deleteEvent: function(){
		
	},
	updateEvent: function(){
		
	}
});

