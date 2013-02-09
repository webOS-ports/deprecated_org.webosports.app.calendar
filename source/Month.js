//The day layout is easy. There's always 24 hours, and it's just a list.
enyo.kind({
	name: "calendar.Month",
	kind: "FittableRows",
	handlers: {
		onNext: "loadNext",
		onPrev: "loadPrev"
	},
	components: [
		{kind: "vi.Inf", name: "inf", fit: true, coreNavi: true, style: "background: white;", components: [
			{kind: "calendar.MonthPage", date: moment().subtract("months", 1)},
			{kind: "calendar.MonthPage", date: moment()},
			{kind: "calendar.MonthPage", date: moment().add("months", 1)}
		]}
	],

	//Set up current viewed date:
	now: moment(),

	//This function is called whenever the page is navigated to using the tab button.
	navigated: function(reload){
		this.$.inf.setCoreNavi(true);
		if(reload === true && moment().diff(this.$.inf.getActive().date, "months") !== 0){
			this.jumpToDate(moment());
		}
		//Optionally enable to scroll to current month when viewed:
		/*
		if(!this.$.inf.getActive() || moment().diff(this.$.inf.getActive().date, "months") !== 0){
			this.jumpToDate(moment());
		}*/
	},

	away: function(){
		this.$.inf.setCoreNavi(false);
	},
	
	create: function(){
		this.inherited(arguments);
		//Request the applicable events between the viewed ranges. These get stored in the Events manager memory for faster retrieval.
		//calendar.Events.requestEvents({from: moment(), to: moment()});
	},

	//Jumps to a specific month:
	jumpToDate: function(date){
		this.$.inf.setCoreNavi(true);
		this.now = moment(date);
		this.$.inf.reset([
			{kind: "calendar.MonthPage", date: moment(this.now).subtract("months", 1)},
			{kind: "calendar.MonthPage", date: moment(this.now)},
			{kind: "calendar.MonthPage", date: moment(this.now).add("months", 1)}
		]);
		this.$.inf.render();
	},
	
	//Load up different months based on where we are in the panels:
	loadNext: function(inSender, inEvent){
		//TODO: Request events for the next month.
		this.$.inf.provideNext({kind: "calendar.MonthPage", date: moment(this.now).add("months", inEvent.current+1)});
	},
	loadPrev: function(inSender, inEvent){
		this.$.inf.providePrev({kind: "calendar.MonthPage", date: moment(this.now).add("months", inEvent.current-1)});
	}
});

//The actual page for one day.
enyo.kind({
	name: "calendar.MonthPage",
	kind: "FittableRows",
	classes: "month-page",
	published: {
		date: "",
	},
	components: [
		{name: "title", classes: "day-title", content: ""},
		{tag: "table", classes: "month-table", fit: true, components: [
			{tag: "thead", name: "monthViewHeader", components: [
				{kind: "calendar.MonthRow", name: "headerView", isHeader: true}
			]},
			{tag: "tbody", classes: "month-tbody", name: "monthView", components: [
				//Dynamically generated rows.
			]}
		]},
		{kind: "Signals", onSettingsChange: "settingsUpdated", onSettingsLoad: "settingsUpdated"}
	],
	create: function(){
		this.inherited(arguments);

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
		this.$.title.setContent(this.formatter.format(this.date.toDate()));

		//Create all of the month rows:
		for(var i = 0; i < 6; i++){
			this.$.monthView.createComponent({kind: "calendar.MonthRow", date: this.date, row: i});
		}

		//TODO: Should call this somehow to update the events
		this.displayEvents();
	},
	
	settingsUpdated: function(inSender, inPrefs){
		//Set the start of the week if it's not set to auto.
		if(inPrefs.startOfWeek !== -1){
			//Set Header:
			this.$.headerView.updateSettings(inPrefs);
			//Set client controls:
			var c = this.$.monthView.getControls();
			for(var x in c){
				if(c.hasOwnProperty(x)){
					c[x].updateSettings && c[x].updateSettings(inPrefs);
				}
			}
		}
	},
	
	displayEvents: function(){
		
	}
});

//The row for the list.
enyo.kind({
	name: "calendar.MonthRow",
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
			this.addClass("month-row-narrow");
		}else{
			if(this.isHeader){
				enyo.forEach(this.getControls(), function(c, i){
					c.setContent(this.formatter.format(moment().day(this.firstDayInWeek + i).toDate()));
				}, this);
			}
			this.removeClass("month-row-narrow");
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

enyo.kind({
	name: "calendar.MonthItem",
	tag: "td",
	classes: "month-item enyo-border-box",
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
		{name: "eventLayer", classes: "month-event-layer enyo-border-box", components: [
			
		]},
		{name: "other", classes: "month-and-other", showing: false}
	],
	other: 0,
	threshold: 2,
	create: function(){
		this.inherited(arguments);
		this.$.number.setContent(this.number);
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

//An event for the day.
//Note that this is only visual right now. We'll probably have to rework this based on the calendar data is actually formatted on webOS.
enyo.kind({
	name: "calendar.MonthEvent",
	classes: "month-event enyo-border-box",
	published: {
		evt: {},
		date: ""
	},
	content: "Some Event (To Set)"
});