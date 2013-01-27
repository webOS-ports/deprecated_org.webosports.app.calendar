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
		"subject": "",
		"transp": "",
		"tzId": "",
		"url": ""
	}
];

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

	create: function(){
		this.inherited(arguments);
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
		this.formatter = new enyo.g11n.DateFmt({locale: this.locale});

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
		//TODO: Not sure if we want to display the date number this way.
		//Possibly look into removing the "th", "nd", etc. after numbers.
		this.$.title.setContent(this.date.format("dddd, MMMM Do, YYYY"));

		var is12Hour = this.formatter.isAmPm();

		//Create all of the date rows:
		for(var i = 0; i < 24; i++){
			this.$.times.createComponent({kind: "DayRow", time: i, is12Hour: is12Hour});
		}
	},
	displayEvents: function(){

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
			this.$.time.setContent(this.time + ":00");
		}
	}
});

//An event for the day.
//Note that this is only visual right now. We'll probably have to rework this based on the calendar data is actually formatted on webOS.
enyo.kind({
	name: "DayEvent"
});