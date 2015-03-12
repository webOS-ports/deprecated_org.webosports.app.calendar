// build the sun+date  mon+date........  across the top
enyo.kind({
	name: "calendar.WeekItem",
	kind: "enyo.FittableColumns",
	style: "width: 100%;",
	published: {
		
	},
	handlers: {
	
	},
	components: [
		{classes: "week-page-inner", kind: "FittableRows", fit: true, components: [
			{name: "d", content: "date :)" + this.date, classes: "week-days"},

		]}
	],
	date: "",
	number: "",
	create: function(){
		this.inherited(arguments);
		var options = {};		
		options.template = "EEE d",
		this.fmtWide = new ilib.DateFmt(options);
		options.length = "long";
		options.template = "E d",
		this.fmtNarrow = new ilib.DateFmt(options);
		
		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}

		//Check to see if this day is today:

		this.generateView();
		//TODO: Should call this somehow to update the events
//		this.displayEvents();
	},
	
	generateView: function(){
		//Get date formatter:
		
		if(enyo.Panels.isScreenNarrow()){
			this.$.d.setContent(this.fmtNarrow.format(this.date.toDate()));
			this.$.d.addClass("week-days-narrow");
			console.log("here");
		}else{
			//Display the title:
			this.$.d.setContent(this.fmtWide.format(this.date.toDate()));
		}
	}
});

//The hour/half and hour rows across the screen for the list.
enyo.kind({
	name: "calendar.WeekRow",
	kind: "enyo.FittableColumns",
	classes: "week-container",
	fit: true,
	published: {
		time: 0,
		is12Hour: true
	},
	components: [
//		{classes: "week-row-half"},
		{classes: "week-row",
		components: [
			{classes: "week-row-half", fit : true},
			{classes: "week-row-label", components: [
				{content: "", name: "time"},
				{content: "", name: "ampm", classes: "week-row-label-ampm"}
			]},
//			{classes: "week-row-half", fit: true},
		]},
	
		{kind: "enyo.Control", classes: "week-row", components: [
			{classes: "week-row-half"},
//			{content: " I'am here", classes: "week-row-label"}
		]},
		
		{kind: "enyo.Control", classes: "week-row", components: [
			{classes: "week-row-half"},
//			{content: " I'am here", classes: "week-row-label"}
		]},
		
		{kind: "enyo.Control", classes: "week-row", components: [
			{classes: "week-row-half"},
//			{content: " I'am here", classes: "week-row-label"}
		]},
		
		{kind: "enyo.Control", classes: "week-row", components: [
			{classes: "week-row-half"},
//			{content: " I'am here", classes: "week-row-label"}
		]},
		
		{kind: "enyo.Control", classes: "week-row", components: [
			{classes: "week-row-half"},
//			{content: " I'am here", classes: "week-row-label"}
		]},
		
		{kind: "enyo.Control", classes: "week-row", components: [
			{classes: "week-row-half"},
//			{content: " I'am here", classes: "week-row-label"}
		]},
		
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

// the view or layout of the week
enyo.kind({
	name: "calendar.WeekPage",
	kind: "enyo.FittableRows",
	fit: true,
	classes: "week-page",
	published: {
		date: "",
		rowHeight: 56
	},

	components: [
		{classes: "week-page-inner", kind: "FittableRows", fit: true, components: [
			{name: "title", classes: "week-title", content: ""},
			{kind: "enyo.FittableColumns", style: "width: 14.28%;", classes: "week-view", components: [
				{name: "weekView", tag: "tbody", classes: "week-tbody", components: [
					//Dynamically generated rows.
					//	{kind: "calendar.WeekItem"},
				]},
			]},
			{kind: "Scroller", name: "times", classes: "day-scroller", horizontal: "hidden", fit: true, touch: true, thumb: false, components: [
				{name: "weekContainer", className: "week-container", kind: enyo.Control, components: [
					{name: "allDayContainer", className: "allday-header", kind: "enyo.FittableColumns", components: [
						{name: "allDayLabel", className: "label enyo-text-ellipsis events-header"}
					]},
				//	{name: "hourLabels", className: "hours", kind: "calendar.day.DayHours"},
					{name: "CurrentTime", style: "width: 100%;", showing: false},
					{name: "week", className: "days enyo-fit", kind: "enyo.FittableColumns"}
						//Dynamically loaded.
					//Note that we don't use a List because that has too much overhead. A simple for loop accomplishes everything we need.
				]}
		
			]}
		]}
	],
	
	sigScroll: 0,
	//Set up current viewed date:
	now: moment(),
	
	create: function() {
		this.inherited(arguments);
		var options = {};		
		options.date = "d m";
		options.length = "full";
		options.week = "E";
		options.length = "long";
		
		this.fmtWide = new ilib.DateFmt(options);
		
	
		this.fmtNarrow = new ilib.DateFmt(options);
		this.we = new ilib.DateFmt(options);
		
		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}
		this.generateView();
		this.setTimeBar();
	},
	
	rendered: function(){
		this.inherited(arguments);
		//Set the time bar initially
		if(moment().diff(this.date, "days") === 0){
			this.$.CurrentTime.show();
			this.setTimeBar();
		}else{
			this.$.CurrentTime.hide();
		}
		this.significantScroll();
	},
	
	generateView: function(){
		var is12Hour = "";
		var options = {};
		var v =	moment(this.date).day(0);
		var ve = moment(this.date).day(6);
		if(this.fmtWide.getClock() === "12"){
			is12Hour = true;
		}else{
			is12Hour = false;
		}
	
		if(v.format("MMMM") === ve.format("MMMM")){
			this.$.title.setContent( v.format("MMMM D") + " " + "- " + ve.format("D") + ", " + v.format("YYYY"));	// the month and year title
		}else {
			this.$.title.setContent( v.format("MMMM D") + " " + "- " + " "+ ve.format("MMMM D") + ", " +   v.format("YYYY"));	// the month and year title
		}
	
		if(enyo.Panels.isScreenNarrow()){
			this.$.title.addClass("week-title-narrow");
		}
			//Create all of the week days:
		for(var i = 0; i < 7; i++){
			var n = moment(this.date).day(i);
			this.$.weekView.createComponent({kind: "calendar.WeekItem", date: n, number: n.format("D")  });
		}
			//Create all of the hour rows:
		for(var j = 0; j < 24; j++){
			this.$.times.createComponent({kind: "calendar.WeekRow", time: j, is12Hour: is12Hour});
		}
	},

	//Scrolls to the most significant time of the day:
	significantScroll: function(){
		var c = this.$.times.getClientControls();
		var ts = this.$.times;
		var st = ts.getScrollTop();
		
		if(this.sigScroll < 2){
			this.sigScroll++;
			if(moment().diff(this.date, "days") === 0){
				//Scroll to current time:
				ts.scrollToControl(c[moment().hours() + 3], true);
				ts.setScrollTop(st+1);
				if(st !== ts.getScrollTop()){
					ts.setScrollTop(ts.getScrollTop()-15);
				}
			}else{
				//Scroll to current time:
				ts.scrollToControl(c[8 + 3], true);
				ts.setScrollTop(st+1);
				if(st !== ts.getScrollTop()){
					ts.setScrollTop(ts.getScrollTop()-15);
				}
			}
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
});

// the three panel for this week the week before and the week after
enyo.kind({
	name: "calendar.Week",
	kind: "FittableRows",
	handlers: {
		onNext: "loadNext",
		onPrev: "loadPrev"
	},
	components: [
		{kind: "vi.Inf", name: "inf", fit: true, coreNavi: true, style: "background: white", components: [
			{kind: "calendar.WeekPage", fit: true},
			{kind: "calendar.WeekPage", fit: true},
			{kind: "calendar.WeekPage", fit: true},
		
		]}
	],

	//Set up current viewed date:
	now: moment(),

	//This function is called whenever the page is navigated to using the tab button.
	navigated: function(reload){
		this.jumpToDate(moment());

	},

	//Called whenever the function is navigated away:
	away: function(){
		this.log("away");
		this.$.inf.setCoreNavi(false);
	},

	//Jumps to a specific date:
	jumpToDate: function(date){
		this.$.inf.setCoreNavi(true);
		this.now = moment(date);
		this.$.inf.reset([
			{kind: "calendar.WeekPage", date: moment(this.now).subtract("weeks", 1)},
			{kind: "calendar.WeekPage", date: moment(this.now)},
			{kind: "calendar.WeekPage", date: moment(this.now).add("weeks", 1)}
		]);
		this.$.inf.render();
	},

	//Load up different days based on where we are in the panels:
	loadNext: function(inSender, inEvent){
		this.$.inf.provideNext({kind: "calendar.WeekPage", date: moment(this.now).add("weeks", inEvent.current + 1)});
	},
	
	loadPrev: function(inSender, inEvent){
		this.$.inf.providePrev({kind: "calendar.WeekPage", date: moment(this.now).add("weeks", inEvent.current - 1 )});
	}
});

