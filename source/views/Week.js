
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
			{kind: "Scroller", name: "times", classes: "day-scroller", horizontal: "hidden", fit: true, touch: true, thumb: false, components: [
				{style: "height: 20px"},
				//Dynamically loaded.
				//Note that we don't use a List because that has too much overhead. A simple for loop accomplishes everything we need.
			]}	
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
		var is12Hour = this.formatter.isAmPm();
		//Get date formatter:
		
		if(enyo.Panels.isScreenNarrow()){
			this.$.d.setContent(this.formatterNarrow.format(this.date.toDate()));
		}else{
			//Display the title:
			this.$.d.setContent(this.formatter.format(this.date.toDate()));
		}
		//Create all of the date rows:
		for(var i = 0; i < 24; i++){
			this.$.times.createComponent({kind: "calendar.DayRow", time: i, is12Hour: is12Hour});
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
		{name: "title", classes: "week-title", content: ""},
		{kind: "enyo.FittableColumns", style: "width: 14.28%;", classes: "week-view", components: [
			{name: "weekView", tag: "tbody", classes: "week-tbody", components: [
				//Dynamically generated rows.
				//	{kind: "calendar.WeekItem"},
			]}
		]},
	],

	//Set up current viewed date:
	now: moment(),
	
	create: function() {
		this.inherited(arguments);
	
		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}
		this.generateView();
},
	
	generateView: function(){
		//Get date formatter:
		this.formatterWide = new enyo.g11n.DateFmt({format: "MMMM yyyy"});
		this.formatterNarrow = new enyo.g11n.DateFmt({format: "MMM yy"});
		
		if(enyo.Panels.isScreenNarrow()){
			this.$.title.setContent(this.formatterNarrow.format(this.date.toDate()));	// the month and year title
		}else{
			this.$.title.setContent(this.formatterWide.format(this.date.toDate()));	// the month and year title
		}
			//Create all of the week days:
		for(var i = 0; i < 7; i++){
			var n = moment(this.date).day(i);
			this.$.weekView.createComponent({kind: "calendar.WeekItem", date: n, number: n.format("D")  });
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

