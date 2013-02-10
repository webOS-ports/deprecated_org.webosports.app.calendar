enyo.kind({
	name: "calendar.NewEvent",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "New Calendar Event"},
		{kind: "Scroller", fit: true, components: [
			{classes: "enyo-border-box newevent-innerblock", components: [
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", name: "eventName", placeholder: "Event Name"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", name: "eventLocation", placeholder: "Event Location"}
					]}
					//TODO: Calendar Selector Here:
					//Right now there's one calendar so this isn't really needed.
				]},
				{kind: "onyx.Groupbox", classes: "newevent-row", components: [
					{classes: "newevent-item", components: [
						{kind: "onyx.Checkbox", name: "allDayEvent"},
						{content: "All Day Event", style: "font-size: 1.1em; padding-left: 10px;", ontap: "checkboxWrapper"}
					]},
					{classes: "newevent-item", components: [
						{content: "From", style: "display: block;"},
						{style: "margin-right: 15px;", name: "fromDate", kind:"onyx.DatePicker"}, {style: "margin-left: 15px;", name: "fromTime", kind:"onyx.TimePicker"}
					]},
					{classes: "newevent-item", components: [
						{content: "To", style: "display: block;"},
						{style: "margin-right: 15px;", name: "toDate", kind:"onyx.DatePicker"}, {style: "margin-left: 15px;", name: "toTime", kind:"onyx.TimePicker"}
					]},
					{classes: "newevent-item", components: [
						{content: "Repeat"}
					]}
				]},
				{kind: "onyx.InputDecorator", classes: "newevent-notes enyo-border-box", alwaysLooksFocused: true, components: [
				    {kind: "onyx.TextArea", name: "eventNotes", placeholder: "Event Notes", onchange: "inputChange"}
				]}
			]}
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{style: "margin: 0 auto; text-align: center;", fit: true, components: [
				{kind: "onyx.Button", content: "Cancel", ontap: "cancelEvent", style: "width: 150px; margin-right: 10px;"},
				{kind: "onyx.Button", content: "Create", style: "background-color: green; width: 150px; margin-left: 10px;"}
			]}
		]},
	],
	checkboxWrapper: function(){
		this.$.allDayEvent.setChecked(!this.$.allDayEvent.getChecked());
	},
	cancelEvent: function(){
		this.bubble("onShowCalendar");
	},
	//TODO: Accept parameters from the calendar.
	resetView: function(){
		var defaultStart = moment().startOf("hour").add("hours", 1).toDate();
		var defaultEnd = moment().startOf("hour").add("hours", 1).add("minutes", calendar.Preferences.prefs.defaultEventDuration || 60).toDate();
		
		this.$.fromDate.setValue(defaultStart);
		this.$.toDate.setValue(defaultEnd);
		
		this.$.fromTime.setValue(defaultStart);
		this.$.toTime.setValue(defaultEnd);
		
		this.$.eventName.setValue("");
		this.$.eventLocation.setValue("");
		
		this.$.eventNotes.setValue("");
		
		this.$.allDayEvent.setChecked(false);
	}
});