
enyo.kind({
	name: "calendar.WeekItem",
	kind: "enyo.FittableColumns",
	style: "width: 100%;",
	published: {
		
	},
	handlers: {
	
	},
	components: [
		{classes: "day-page-inner", kind: "FittableRows", fit: true, components: [
		{name: "d", content: "date :)" + this.date, style: "width: 100%;"},

		]}
	],
	date: "",
	number: "",
	create: function(){
		this.inherited(arguments);
		this.formatter = new enyo.g11n.DateFmt({format: "EEE, d,"});
		this.formatterNarrow = new enyo.g11n.DateFmt({format: "EE d"});		
		
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
			this.$.d.setContent(this.formatterNarrow.format(this.date.toDate()));
		}else{
			//Display the title:
			this.$.d.setContent(this.formatter.format(this.date.toDate()));
		}
	}
});

enyo.kind({
	name: "calendar.WeekPage",
	kind: "enyo.FittableRows",
	fit: true,
	style: "width: 100%;",
	published: {
		date: "",
	},

	components: [
		{classes: "day-page-inner", kind: "FittableRows", fit: true, components: [
			{name: "title", classes: "week-title", content: ""},
			{kind: "enyo.FittableColumns", style: "width: 14.28%;", classes: "week-view", components: [
				{name: "weekView", tag: "tbody", classes: "week-tbody", components: [
					//Dynamically generated rows.
					//	{kind: "calendar.WeekItem"},
				]},
				
			]},
			{kind: "Scroller", name: "times", classes: "day-scroller", horizontal: "hidden", fit: true, touch: true, thumb: false, components: [
				{style: "height: 20px"},
				{name: "CurrentTime", classes: "day-current-time", showing: false},
				//Dynamically loaded.
				//Note that we don't use a List because that has too much overhead. A simple for loop accomplishes everything we need.
			]}
		]}
	],
	
	sigScroll: 0,
	//Set up current viewed date:
	now: moment(),
	
	create: function() {
		this.inherited(arguments);
		this.formatter = new enyo.g11n.DateFmt({format: "EEE, d,"});
		this.formatterNarrow = new enyo.g11n.DateFmt({format: "EE d"});	
		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}
		this.generateView();
	//	this.setTimeBar();
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
		var is12Hour = this.formatter.isAmPm();
		//Get date formatter:
		this.formatterWide = new enyo.g11n.DateFmt({format: "MMMM yyyy"});
		this.formatterNarrow = new enyo.g11n.DateFmt({format: "MMM yy"});
		
		if(enyo.Panels.isScreenNarrow()){
			this.$.title.setContent(this.formatterNarrow.format(this.date.toDate()));	// the month and year title
			this.$.title.addClass("week-title-narrow");
		}else{
			this.$.title.setContent(this.formatterWide.format(this.date.toDate()));	// the month and year title
		}
			//Create all of the week days:
		for(var i = 0; i < 7; i++){
			var n = moment(this.date).day(i);
			this.$.weekView.createComponent({kind: "calendar.WeekItem", date: n, number: n.format("D")  });
		}
			//Create all of the hour rows:
		for(var j = 0; j < 24; j++){
			console.log("looping", j);
			this.$.times.createComponent({kind: "calendar.DayRow", time: j, is12Hour: is12Hour});
		}
	},

	//Scrolls to the most significant time of the day:
	significantScroll: function(){
		if(this.sigScroll < 2){
			this.sigScroll++;
			if(moment().diff(this.date, "days") === 0){
				//Scroll to current time:
				var c = this.$.times.getClientControls();
				var ts = this.$.times;
				ts.scrollToControl(c[moment().hours() + 3], true);
				var st = ts.getScrollTop();
				ts.setScrollTop(st+1);
				if(st !== ts.getScrollTop()){
					ts.setScrollTop(ts.getScrollTop()-15);
				}
			}else{
				//Scroll to current time:
				var c = this.$.times.getClientControls();
				var ts = this.$.times;
				ts.scrollToControl(c[8 + 3], true);
				var st = ts.getScrollTop();
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

