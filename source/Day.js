//The day layout is easy. There's always 24 hours, and it's just a list.
enyo.kind({
	name: "Day",
	kind: "FittableRows",
	handlers: {
		onNext: "loadNext",
		onPrev: "loadPrev"
	},
	components: [
		{kind: "vi.Inf", name: "inf", fit: true, coreNavi: true, style: "background: white", components: [
			{kind: "DayPage", date: moment().subtract("days", 1)},
			{kind: "DayPage", date: moment()},
			{kind: "DayPage", date: moment().add("days", 1)}
		]}
	],

	//Set up current viewed date:
	now: moment(),

	//This function is called whenever the page is navigated to using the tab button.
	navigated: function(){
		if(!this.$.inf.getActive() || moment().diff(this.$.inf.getActive().date, "days") !== 0){
			this.jumpToDate(moment());
		}
	},

	//Jumps to a specific date:
	jumpToDate: function(date){
		this.now = moment(date);
		this.$.inf.reset([
			{kind: "DayPage", date: moment(this.now).subtract("days", 1)},
			{kind: "DayPage", date: moment(this.now)},
			{kind: "DayPage", date: moment(this.now).add("days", 1)}
		]);
		this.$.inf.render();
	},
	
	//Load up different days based on where we are in the panels:
	loadNext: function(inSender, inEvent){
		this.$.inf.provideNext({kind: "DayPage", date: moment(this.now).add("days", inEvent.current+1)});
	},
	loadPrev: function(inSender, inEvent){
		this.$.inf.providePrev({kind: "DayPage", date: moment(this.now).add("days", inEvent.current-1)});
	}
});

//The actual page for one day.
enyo.kind({
	name: "DayPage",
	kind: "FittableRows",
	classes: "day-page",
	published: {
		date: "",
		//TODO: Adjust for smaller screens:
		rowHeight: 56
	},
	components: [
		{classes: "day-page-inner", kind: "FittableRows", fit: true, components: [
			{classes: "day-header", components: [
				{name: "istoday", showing: false, classes: "day-istoday", content: "Today"},
				{name: "title", classes: "day-title", content: ""}
			]},
			{classes: "day-allday", name: "allday", showing: false, components: [
				{content: "Events:", classes:"day-allday-label"},
				{name: "alldayevents", style: "display: inline-block;"}
			]},
			{kind: "Scroller", name: "times", classes: "day-scroller", horizontal: "hidden", fit: true, touch: true, thumb: false, components: [
				{style: "height: 20px"},
				{name: "CurrentTime", classes: "day-current-time", showing: false},
				{name: "eventLayer", classes: "day-events"}
				//Dynamically loaded.
				//Note that we don't use a List because that has too much overhead. A simple for loop accomplishes everything we need.
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);

		//Get date formatter:
		this.locale = enyo.g11n.currentLocale().getLocale();
		this.formatter = new enyo.g11n.DateFmt({format: "EEEE, MMMM d, yyyy", locale: this.locale});

		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}

		//Check to see if this day is today:
		var today = moment();
		if(today.diff(this.date, "days") === 0){
			this.$.istoday.show();
		}

		//Display the title:
		this.$.title.setContent(this.formatter.format(this.date.toDate()));

		var is12Hour = this.formatter.isAmPm();

		//Create all of the date rows:
		for(var i = 0; i < 24; i++){
			this.$.times.createComponent({kind: "DayRow", time: i, is12Hour: is12Hour});
		}

		//TODO: Should call this somehow to update the events
		this.displayEvents();
	},
	//TODO: Dates spanning multiple days generally will break the checker that makes sure the date is in range.
	//TODO: Pull in data from the DB8 database.
	displayEvents: function(){
		this.$.allday.hide();
		var showAllDay = false;

		//Used to determine when to scale events:
		var conflicts = [];

		enyo.forEach(eventsforday, function(evt){
			//Clone date:
			var checker = moment(this.date);
			//Check to make sure that this day fits in the event range:
			if(checker.sod().diff(moment.unix(evt.dtstart).sod(), "days") === 0 || checker.sod().diff(moment.unix(evt.dtend).sod(), "days") === 0){
				//Render all day events: 
				if(evt.allDay){
					showAllDay = true;
					this.$.alldayevents.createComponent({kind: "DayEvent", date: this.date, evt: evt});
				}else{

					//Create the event in the event layer:
					var el = this.$.eventLayer.createComponent({kind: "DayEvent", date: this.date, evt: evt});
					
					//Create a moment for the event start time and end time:
					var elstart = moment.unix(evt.dtstart);
					var elend = moment.unix(evt.dtend);

					var top, height;
					//Set up the top of the event:
					var dstart = this.date.sod().diff(elstart.sod(), "days");
					if(dstart === 0){
						top = (elstart.hours() * this.getRowHeight()) + Math.floor(((elstart.minutes()/60) * this.getRowHeight()));
					}else{
						//Event started before today, Show it for the entire day:
						top = 0;
						//This also breaks the standard height handling: 
						height = (elend.diff(this.date.sod(), "minutes")/60) * this.getRowHeight();
					}
					//Set up the height:
					var dend = this.date.sod().diff(elend.sod(), "days");
					if(dend === 0 && !height){
						height = (elend.diff(elstart, "minutes")/60) * this.getRowHeight();
					}else{
						if(!height){
							//Event doesn't end today, run to the end:
							height = (24 * this.getRowHeight()) - top;
						}
					}

					el.applyStyle("top", top + "px");
					el.applyStyle("height", height + "px");

					//Resolve conflicts:
					enyo.forEach(conflicts, function(conflict){
						if((top >= conflict.top && top <= conflict.bottom) || ((top + height) >= conflict.top && (top + height) <= conflict.bottom)){
							conflict.el.addConflict(1);
							el.addConflict(1, conflict.el.offsetElements + 1);
						}
					}, this);

					//Add events to possible conflicts:
					conflicts.push({top: top, bottom: top + height, el: el});
				}
			}
		}, this);

		//Show the all day events bar at the top if there are events that last all day today.
		if(showAllDay){
			this.$.allday.render();
			this.$.allday.show();
		}
	},
	//This let's us only scroll to the day once:
	hasScrolled: -1,
	rendered: function(){
		this.inherited(arguments);
		//Set the time bar initially
		if(moment().diff(this.date, "days") === 0){
			this.$.CurrentTime.show();
			this.setTimeBar();
		}else{
			this.$.CurrentTime.hide();
		}
		//Scroll the current time into view:
		//TODO: Only do this if the date is today?
		if(this.hasScrolled < 1){
			//The render method gets called a little bit more than I would like, so we have to do it this way.
			this.hasScrolled++;
			this.scrollToDay();
		}
	},
	setTimeBar: function(){
		//Don't keep setting the time bar if the date moves off this day:
		if(moment().diff(this.date, "days") === 0){
			//Set Bar:
			var height = moment().hours() * this.getRowHeight();
			height += Math.floor((this.getRowHeight())*((moment().minutes()/60)));
			this.$.CurrentTime.applyStyle("top", height + "px");
			if(this.timer){
				window.clearTimeout(this.timer);
			}
			this.timer = window.setTimeout(enyo.bind(this, "setTimeBar"), 120000);
		}else{
			if(this.timer){
				window.clearTimeout(this.timer);
			}
			this.$.CurrentTime.hide();
		}
	},
	destroy: function(){
		window.clearTimeout(this.timer);
		this.inherited(arguments);
	},
	scrollToDay: function(){
		var c = this.$.times.getClientControls();
		var ts = this.$.times;
		ts.scrollToControl(c[moment().hours() + 3], true);
		var st = ts.getScrollTop();
		ts.setScrollTop(st+1);
		if(st !== ts.getScrollTop()){
			ts.setScrollTop(ts.getScrollTop()-15);
		}
	}
});

//The row for the list.
enyo.kind({
	name: "DayRow",
	classes: "day-row",
	published: {
		time: 0,
		is12Hour: true
	},
	components: [
		{classes: "day-row-half"},
		{classes: "day-row-label", components: [
			{content: "", name: "time"},
			{content: "", name: "ampm", classes: "day-row-label-ampm"}
		]}
	],
	create: function(){
		this.inherited(arguments);
		if(this.is12Hour){
			var time = this.time % 12;
			if(time === 0){
				time = 12;
			}
			this.$.time.setContent(time);
			this.$.ampm.setContent(this.time >= 12 ? "pm" : "am");
		}else{
			this.$.time.setContent(((this.time + "").length > 1 ? this.time : "0" + this.time) + ":00");
		}
	}
});

//An event for the day.
//Note that this is only visual right now. We'll probably have to rework this based on the calendar data is actually formatted on webOS.
enyo.kind({
	name: "DayEvent",
	classes: "day-event-container enyo-border-box",
	published: {
		evt: {},
		date: ""
	},
	components: [
		{name: "event", classes: "day-event enyo-border-box", components: [
			{name: "label", classes: "day-event-label"},
			{name: "location", classes: "day-event-location"}
		]}
	],
	conflictingElements: 1,
	offsetElements: 0,
	addConflict: function(number, offset){
		this.conflictingElements += number;
		if(offset){
			this.offsetElements = offset;
		}
	},
	rendered: function(){
		this.inherited(arguments);
		this.applyStyle("width", (100 / this.conflictingElements) + "%");
		if(this.offsetElements > 0){
			this.applyStyle("left", ((this.offsetElements/this.conflictingElements) * 100) + "%");
		}
	},
	create: function(){
		this.inherited(arguments);
		var checker = moment(this.date);
		//Make sure that either the start time or end time are on the same day as the page:
		if(checker.sod().diff(moment.unix(this.evt.dtstart).sod(), "days") === 0 || checker.sod().diff(moment.unix(this.evt.dtend).sod(), "days") === 0){
			if(this.evt.allDay){
				this.removeClass("day-event-container");
				this.$.event.removeClass("day-event");
				this.$.event.addClass("day-event-allday");
				this.$.location.hide();
			}
			this.$.label.setContent(this.evt.subject || "No Subject");
			this.$.location.setContent(this.evt.location || "");
		}else{
			this.destroy();
		}
	}
});














var eventsforday = [
	{
		"alarm": [],
		"allDay": false,
		"attach": [],
		"attendees": [],
		"calendarId": "Palm Profile",
		"categories": "",
		"classification": "PUBLIC",
		"comment": "",
		"contact": "",
		"created": moment().unix(),
		"dtend": moment().add("hours", 0.5).unix(),
		"dtstart": moment().subtract("hours", 0.5).unix(),
		"dtstamp": "",
		"exdates": [],
		"geo": "",
		"lastModified": moment().unix(),
		"location": "Olive garden",
		"note": "",
		"parentDtstart": 0,
		"parentId": 0,
		"priority": 0,
		"rdates": [],
		"recurrenceId": "",
		"relatedTo": "",
		"requestStatus": "",
		"resources": "",
		"rrule": {
			"freq": "DAILY",
			"interval": 1
		},
		"sequence": 0,
		"subject": "Some Event",
		"transp": "",
		"tzId": "",
		"url": ""
	},
	{
		"alarm": [],
		"allDay": false,
		"attach": [],
		"attendees": [],
		"calendarId": "Palm Profile",
		"categories": "",
		"classification": "PUBLIC",
		"comment": "",
		"contact": "",
		"created": moment().unix(),
		"dtend": moment().add("hours", 1).unix(),
		"dtstart": moment().unix(),
		"dtstamp": "",
		"exdates": [],
		"geo": "",
		"lastModified": moment().unix(),
		"location": "Olive garden",
		"note": "",
		"parentDtstart": 0,
		"parentId": 0,
		"priority": 0,
		"rdates": [],
		"recurrenceId": "",
		"relatedTo": "",
		"requestStatus": "",
		"resources": "",
		"rrule": {
			"freq": "DAILY",
			"interval": 1
		},
		"sequence": 0,
		"subject": "Some Event",
		"transp": "",
		"tzId": "",
		"url": ""
	},
	{
		"alarm": [],
		"allDay": true,
		"attach": [],
		"attendees": [],
		"calendarId": "Palm Profile",
		"categories": "",
		"classification": "PUBLIC",
		"comment": "",
		"contact": "",
		"created": moment().unix(),
		"dtend": moment().unix(),
		"dtstart": moment().unix(),
		"dtstamp": "",
		"exdates": [],
		"geo": "",
		"lastModified": moment().unix(),
		"location": "Olive garden",
		"note": "",
		"parentDtstart": 0,
		"parentId": 0,
		"priority": 0,
		"rdates": [],
		"recurrenceId": "",
		"relatedTo": "",
		"requestStatus": "",
		"resources": "",
		"rrule": {
			"freq": "DAILY",
			"interval": 1
		},
		"sequence": 0,
		"subject": "Some All Day Event That Also Is Super Long And Should Test The Overflow",
		"transp": "",
		"tzId": "",
		"url": ""
	}
];