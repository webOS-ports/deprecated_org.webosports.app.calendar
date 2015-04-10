// the three panel for this week the week before and the week after
enyo.kind({
	name: "calendar.Week",
	kind: "FittableRows",
	handlers: {
		onNext: "loadNext",
		onPrev: "loadPrev"
	},
	components: [
		{kind: "vi.Inf", name: "weekinf", fit: true, coreNavi: true, style: "background: white", components: [
			{kind: "calendar.WeekPage", date: moment(this.now).subtract("weeks", 1), showing: false},
			{kind: "calendar.WeekPage", date: moment(this.now), showing: false},
			{kind: "calendar.WeekPage", date: moment(this.now).add("weeks", 1), showing: false}
		
		]}
	],

	//Set up current viewed date:
	now: moment(),

	//Called when the app is loaded the first time:
	first: function(){
		//Because the scroll position is lost on render, we have reset it after we view ourselves.
		this.$.weekinf.callAll("significantScroll");
	},
	
	//This function is called whenever the page is navigated to using the tab button.
	navigated: function(reload){
		this.jumpToDate(moment());
	},

	//Called whenever the function is navigated away:
	away: function(){
		this.$.weekinf.setCoreNavi(false);
	},

	//Jumps to a specific date:
	jumpToDate: function(date){
		this.$.weekinf.setCoreNavi(true);
		this.now = moment(date);
		this.$.weekinf.reset([
			{kind: "calendar.WeekPage", date: moment(this.now).subtract("weeks", 1), showing: false},
			{kind: "calendar.WeekPage", date: moment(this.now), showing: true},
			{kind: "calendar.WeekPage", date: moment(this.now).add("weeks", 1), showing: false}
		]);
		this.$.weekinf.render();
		
	},

	//Load up different days based on where we are in the panels:
	loadNext: function(inSender, inEvent){
		this.$.weekinf.provideNext({kind: "calendar.WeekPage", date: moment(this.now).add("weeks", inEvent.current + 1)});
	},
	
	loadPrev: function(inSender, inEvent){
		this.$.weekinf.providePrev({kind: "calendar.WeekPage", date: moment(this.now).add("weeks", inEvent.current - 1 )});
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
		rowHeight: 55
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
			{name: "allDayContainer", className: "allday-header", kind: "enyo.FittableColumns", components: [
				{name: "allDayLabel", className: "label enyo-text-ellipsis events-header"}
			]},
			{kind: "Scroller", name: "weekTimes", classes: "day-scroller", horizontal: "hidden", fit: true, touch: true, thumb: false, components: [
				{style: "height: 20px"},
//				{name: "weekContainer", className: "week-container", kind: enyo.Control, components: [

				//	{name: "hourLabels", className: "hours", kind: "calendar.day.DayHours"},
					{name: "WeekCurrentTime", classes: "week-current-time", showing: false},
					{name: "week", className: "days enyo-fit", kind: "enyo.FittableColumns"}
						//Dynamically loaded.
					//Note that we don't use a List because that has too much overhead. A simple for loop accomplishes everything we need.
//				]}
		
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
		this.rendered;
	},
	
	rendered: function(){
		this.inherited(arguments);
		//Set the time bar initially
		if(moment().diff(this.date, "days") === 0){
			this.$.WeekCurrentTime.show();
			this.setTimeBar();
		}else{
			this.$.WeekCurrentTime.hide();
		}
		this.significantScroll();
	},
	
	generateView: function(){
		var is12Hour = "";
		var options = {};
//		var fmt = new ilib.DateFmt();
		var v =	moment(this.date).day(0);
		var ve = moment(this.date).day(6);

		if(this.fmtWide.getClock() === "12"){
			is12Hour = true;
		}else{
			is12Hour = false;
		}
	
		if(v.format("MMMM") === ve.format("MMMM")){
			this.$.title.setContent( v.format("MMMM D") + " " + "- " + ve.format("D") + ", " + v.format("YYYY")); // the month and year title
		}else {
			this.$.title.setContent( v.format("MMMM D") + " " + "- " + " " + ve.format("MMMM D") + ", " + v.format("YYYY"));	// the month and year title wide format
		}
		
		if(enyo.Panels.isScreenNarrow() ){
			this.$.title.addClass("week-title-narrow");
		}
	
		//Create all of the week days:
		for(var i = 0; i < 7; i++){
			var n = moment(this.date).day(i);
			this.$.weekView.createComponent({kind: "calendar.WeekItem", date: n, number: n.format("D")  });
		}
			//Create all of the hour rows:
		for(var j = 0; j < 24; j++){
			this.$.weekTimes.createComponent({kind: "calendar.WeekRow", time: j, is12Hour: is12Hour});
		}
	},

	//Scrolls to the most significant time of the day:
	significantScroll: function(){
		var c = this.$.weekTimes.getClientControls();
		var ts = this.$.weekTimes;	
		var scrolltop = ts.getScrollTop();
	//	console.log("scrolling",c,ts,scrolltop,this.sigScrol);
		
		ts.scrollToControl(c[moment().hours() ], true);
		/*
		
		
		if(this.sigScroll < 2){
			this.sigScroll++;
			if(moment().diff(this.date, "days") === 0){
				//Scroll to current time:
				ts.scrollToControl(c[moment().hours() + 3], true);
				ts.setScrollTop(scrolltop + 1);
				console.log("scrolltop !== ts.getScrollTop()", scrolltop , ts.getScrollTop());
				if( scrolltop !== ts.getScrollTop()){
					console.log("if");
					ts.setScrollTop(ts.getScrollTop() - 10);
				}
			}else{
				//Scroll to current time:
				console.log("else", scrolltop , ts.getScrollTop() );
				ts.scrollToControl(c[8 + 3], true);
			
				ts.setScrollTop( scrolltop + 1);
				if( scrolltop !== ts.getScrollTop()){
					console.log("else/if", scrolltop , ts.getScrollTop() );
					ts.setScrollTop(ts.getScrollTop() - 10);
				}
			}
		} */
	},
	
	setTimeBar: function(){
		//Don't keep setting the time bar if the date moves off this day:
		if(moment().diff(this.date, "days") === 0){
			//Set Bar:
			var height = moment().hours() * this.getRowHeight();
			height += Math.floor((this.getRowHeight())*((moment().minutes()/60)));
//			console.log("STYLE", this, this.$.WeekCurrentTime, this.$.WeekCurrentTime.getStyle);
			this.$.WeekCurrentTime.applyStyle("top", height + "px");
			
			if(this.timer){
				window.clearTimeout(this.timer);
			}
			this.timer = window.setTimeout(enyo.bind(this, "setTimeBar"), 120000);
			this.$.WeekCurrentTime.show();
		}else{
			if(this.timer){
				window.clearTimeout(this.timer);
			}
			this.$.WeekCurrentTime.hide();
		}
	},
});

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
		{classes: "week-row", components: [
			{classes: "week-row-half", fit : true},
			{classes: "week-row-label", components: [
				{content: "", name: "time"},
				{content: "", name: "ampm", classes: "week-row-label-ampm"}
			]},
		]},
	
		{classes: "week-row", components: [
			{classes: "week-row-half"},
		]},
		
		{classes: "week-row", components: [
			{classes: "week-row-half"},
		]},
		
		{classes: "week-row", components: [
			{classes: "week-row-half"},
		]},
		
		{classes: "week-row", components: [
			{classes: "week-row-half"},
		]},
		
		{classes: "week-row", components: [
			{classes: "week-row-half"},
		]},
		
		{classes: "week-row", components: [
			{classes: "week-row-half"},
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




