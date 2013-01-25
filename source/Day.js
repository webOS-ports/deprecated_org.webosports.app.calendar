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

	//This function is called whenever the page is navigated to using the tab button.
	navigated: function(){
		//Tell the infinite panels kind to go back to where we started:
		this.$.inf.reset([
			{kind: "DayPage", date: moment().subtract("days", 1)},
			{kind: "DayPage", date: moment()},
			{kind: "DayPage", date: moment().add("days", 1)}
		]);
	},
	
	//Load up different days based on where we are in the panels:
	loadNext: function(inSender, inEvent){
		this.$.inf.provideNext({kind: "DayPage", date: moment().add("days", inEvent.current+1)});
	},
	loadPrev: function(inSender, inEvent){
		this.$.inf.providePrev({kind: "DayPage", date: moment().add("days", inEvent.current-1)});
	}
});
//The actual page for one day.
enyo.kind({
	name: "DayPage",
	kind: "FittableRows",
	classes: "day-page",
	published: {
		date: ""
	},
	components: [
		{classes: "day-page-inner", kind: "FittableRows", fit: true, components: [
			{classes: "day-header", components: [
				{name: "istoday", showing: false, classes: "day-istoday", content: "Today"},
				{name: "title", classes: "day-title", content: ""}
			]},
			{kind: "Scroller", classes: "day-scroller", fit: true, touch: true, thumb: false, components: [
				//TODO
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);
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
	}
});