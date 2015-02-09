

enyo.kind({
	name: "calendar.WeekItem",
	tag: "td",
	classes: "week-item enyo-border-box",
//	style: "background-color: smoke;",
	published: {
		date: "",
		viewed: "",
		number: 0
	},
	handlers: {
		onhold: "hold",
		onmove: "leave",
		onup: "leave"
	},
	components: [
		{name: "number"},
		{name: "eventLayer", classes: "week-event-layer enyo-border-box", components: [
			
		]},
		{name: "other", classes: "week-and-other", showing: false},
	//	{content: "TEST TEST IAM HERE", style: "color: blue; width: 50%;"},
	],
	other: 0,
	threshold: 2,
	now: moment(),
	create: function(){
		this.inherited(arguments);
	//	console.log("date", this.date);
	//	console.log("n", this.number);
		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}
		
		this.updateSettings({startOfWeek: calendar.Preferences.prefs.startOfWeek || 0});
		this.$.number.setContent(this.number);
	},
	updateSettings: function(inPrefs){
		if(inPrefs.startOfWeek !== -1){
			this.firstDayInWeek = inPrefs.startOfWeek;
		}else{
			var formatter = new enyo.g11n.DateFmt({format: "EEEE"});
			this.firstDayInWeek = formatter.getFirstDayOfWeek();
		}
		this.destroyClientControls();
		this.generateView();
		this.render();
	},
	addEvent: function(evt){
		//You can only create events on the viewed month:
		if(this.date.month() === this.viewed.month()){
			if(this.$.eventLayer.getControls().length < this.threshold){
				this.$.eventLayer.createComponent({kind: "calendar.MonthEvent", evt: evt, date: this.date});
			}else{
				this.other++;
				this.$.other.show();
				this.$.other.setContent("plus " + this.other + " more events");
			}
		}
	},
	generateView: function(){
		if(this.isHeader){
			this.removeClass("week-row");
			console.log("week-row css removed");
			//Get date formatter:
			this.formatter = new enyo.g11n.DateFmt({format: "EEEE"});
			this.smallFormatter = new enyo.g11n.DateFmt({format: "E"});
			for(var i = 0; i < 7; i++){
				this.createComponent({content: this.formatter.format(moment().day(this.firstDayInWeek + i).toDate()), tag: "th", classes: "week-item-header"});
			}
		}
	//	this.render();
	},
	hold: function(){
		this.addClass("month-item-active");
	},
	leave: function(){
		this.removeClass("month-item-active");
	},
	tap: function(){
		this.bubble("onSwapView", {index: 0, supress: true, inEvent: this.date});
		this.removeClass("month-item-active");
	}
});

enyo.kind({
	name: "calendar.WeekPage",
	kind: "enyo.FittableRows",
	fit: true,
	published: {
		date: "",
		firstDayInWeek: ""
	},
		
	//Set up current viewed date:
	now: moment(),
	components: [
		{name: "title", classes: "week-title", content: ""},
		{tag: "table", classes: "week-table", fit: true, components: [
			{tag: "thead", name: "weekViewHeader", components: [
				{name: "headerView", kind: "calendar.weekRow",  classes: "week-view-header", isHeader: true}		// the days of the week sun mon tue.......
			]},
			{name: "weekView", tag: "tbody", classes: "week-tbody", components: [
				//Dynamically generated rows.
			//	{kind: "calendar.WeekItem"},
			]}
		]},
		{kind: "Signals", onSettingsChange: "settingsUpdated", onSettingsLoad: "settingsUpdated"}
	],

	create: function() {
		this.inherited(arguments);
		console.log("DATE", this.date);
		//Get date formatter:
		this.formatter = new enyo.g11n.DateFmt({format: "MMMM yyyy"});

		//If no date is provided, create a new moment:
		if(!this.date){
			this.date = moment();
		}else{
			//Make sure we're using moments:
			this.date = moment(this.date);
		}

		//Display the title:
		this.$.title.setContent(this.formatter.format(this.date.toDate()));	// the month and year title
	
		//Create all of the week days:
		for(var i = 0; i < 7; i++){
			var n = moment(this.date).day(i);

			this.$.weekView.createComponent({kind: "calendar.WeekItem", date: n, number: n.format("D")  });
		}
	},
	
	settingsUpdated: function(inSender, inPrefs){
		//Set the start of the week if it's not set to auto.
		if(inPrefs.startOfWeek !== -1){
			//Set Header:
			this.$.headerView.updateSettings(inPrefs);
			//Set client controls:
			var c = this.$.weekView.getControls();
			for(var x in c){
				if(c.hasOwnProperty(x)){
					c[x].updateSettings && c[x].updateSettings(inPrefs);
				}
			}
		}
	},
});

//The row for the list.
enyo.kind({
	name: "calendar.weekRow",
	classes: "month-row",
	tag: "tr",
	published: {
		isHeader: false,
		date: "",
		row: 0
	},
	reflow: function(){
		this.inherited(arguments);
		if(enyo.Panels.isScreenNarrow()){
			if(this.isHeader){
				enyo.forEach(this.getControls(), function(c, i){
					c.setContent(this.smallFormatter.format(moment().day(this.firstDayInWeek + i).toDate()));
				}, this);
			}
			this.addClass("week-row-narrow");
		}else{
			if(this.isHeader){
				enyo.forEach(this.getControls(), function(c, i){
					c.setContent(this.formatter.format(moment().day(this.firstDayInWeek + i).toDate()));
				}, this);
			}
			this.removeClass("week-row-narrow");
		}
	},
	updateSettings: function(inPrefs){
		if(inPrefs.startOfWeek !== -1){
			this.firstDayInWeek = inPrefs.startOfWeek;
		}else{
			var formatter = new enyo.g11n.DateFmt({format: "EEEE"});
			this.firstDayInWeek = formatter.getFirstDayOfWeek();
		}
		this.destroyClientControls();
		this.generateView();
		this.render();
	},
	create: function(){
		this.inherited(arguments);
		this.updateSettings({startOfWeek: calendar.Preferences.prefs.startOfWeek || 0});
	},
	generateView: function(){
		if(this.isHeader){
			this.removeClass("month-row");
			//Get date formatter:
			this.formatter = new enyo.g11n.DateFmt({format: "EEEE"});
			this.smallFormatter = new enyo.g11n.DateFmt({format: "E"});
			for(var i = 0; i < 7; i++){
				this.createComponent({content: this.formatter.format(moment().day(this.firstDayInWeek + i).toDate()), tag: "th", classes: "month-item-header"});
			}
		}else{
			this.formatter = new enyo.g11n.DateFmt({format: "EEEE"});
			var temp = moment(this.date).startOf("month").add("weeks", this.row);
			var start;
			if(this.firstDayInWeek === 0){
				start = temp.day();
			}else{
				start = temp.isoday() - this.firstDayInWeek;
				if(start < 0){
					start = temp.subtract("weeks", 1).isoday() - this.firstDayInWeek;
				}
			}
			for(var i = 0; i < 7; i++){
				var now = moment(temp).add("days", i - start);
				var el = this.createComponent({kind: "calendar.MonthItem", date: now, viewed: this.date, number: now.format("D")});
				
				el.addEvent();
				el.addEvent();
				el.addEvent();
				el.addEvent();
					
				if(this.date.month() !== now.month()){
					el.addClass("month-other");
				}

				if(moment().diff(now, "days") === 0){
					el.addClass("month-active");
				}
			}
		}
	}
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
			{kind: "calendar.WeekPage", date: moment().subtract("weeks",1)},
			{kind: "calendar.WeekPage", date: moment()},
			{kind: "calendar.WeekPage", date: moment().add("weeks",1)},
		
		]}
	],

	create: function(){
		this.inherited(arguments);

	},
	//Set up current viewed date:
	now: moment(),

	//This function is called whenever the page is navigated to using the tab button.
	navigated: function(reload){
		this.$.inf.setCoreNavi(true);
		if(reload === true && moment().diff(this.$.inf.getActive().date, "weeks") !== 0){
			this.jumpToDate(moment());
		}
		//This jumps to today's date whenever the page is viewed:
		/*if(!this.$.inf.getActive() || moment().diff(this.$.inf.getActive().date, "days") !== 0){
			this.jumpToDate(moment());
		}*/
	},

	//Called whenever the function is navigated away:
	away: function(){
		this.$.inf.setCoreNavi(false);
	},

	//Jumps to a specific date:
	jumpToDate: function(date){
		this.$.inf.setCoreNavi(true);
		this.now = moment(date);
		this.$.inf.reset([
			{kind: "calendar.WeekPage", date: moment(this.now).add("weeks",-1)},
			{kind: "calendar.WeekPage", date: moment(this.now)},
			{kind: "calendar.WeekPage", date: moment(this.now).add("weeks",1)}
		]);
		this.$.inf.render();

	},
	
	//Called when the app is loaded the first time:
	first: function(){
		//Because the scroll position is lost on render, we have reset it after we view ourselves.
		this.$.inf.callAll("significantScroll");
	},
	
	//Load up different days based on where we are in the panels:
	loadNext: function(inSender, inEvent){
		this.$.inf.provideNext({kind: "calendar.WeekPage", date: moment(this.now).add("weeks", inEvent.current + 1)});
	},
	loadPrev: function(inSender, inEvent){
		console.log("back",inEvent.current);
		console.log("index", this.$.inf.getIndex() );
		this.$.inf.providePrev({kind: "calendar.WeekPage", date: moment(this.now).add("weeks", inEvent.current - 1)});
	}
});

