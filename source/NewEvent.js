enyo.kind({
	name: "calendar.NewEvent",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "New Calendar Event"},
		{kind: "Scroller", fit: true, components: [
			{classes: "enyo-border-box newevent-innerblock", components: [
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", name: "eventName", placeholder: "Event Name", style: "width: 100%;"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", name: "eventLocation", placeholder: "Event Location", style: "width: 100%;"}
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
						{style: "margin-right: 30px;",components: [
							{content: "Repeat"},
							{kind: "onyx.PickerDecorator", style: "padding: 5px;", components: [
								{style: "width: 150px;"},
								{kind: "onyx.Picker", components: [
									{content: "No Repeat", active: true},
									{content: "Daily"},
									{content: "Weekdays"},
									{content: "Weekly"},
									{content: "Custom"}
								]}
							]}
						]},
						{components: [
							{content: "Alerts"},
							{kind: "onyx.PickerDecorator", style: "padding: 5px;", components: [
								{style: "width: 150px;"},
								{kind: "onyx.Picker", name: "alarmTrigger", components: [
									{content: "No Alert", value: false, active: true},
									{content: "Daily", value: "-PT15M"},
									{content: "Weekdays", value: "-PT15M"},
									{content: "Weekly", value: "-PT15M"},
									{content: "Custom", value: "-PT15M"}
								]}
							]}
						]}
					]}
				]},
				{kind: "onyx.InputDecorator", classes: "newevent-notes enyo-border-box", alwaysLooksFocused: true, components: [
				    {kind: "onyx.TextArea", name: "eventNotes", style: "width: 100%;", placeholder: "Event Notes", onchange: "inputChange"}
				]}
			]}
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{style: "margin: 0 auto; text-align: center;", fit: true, components: [
				{kind: "onyx.Button", content: "Cancel", ontap: "cancelEvent", style: "width: 150px; margin-right: 10px;"},
				{kind: "onyx.Button", content: "Create", ontap: "createEvent", style: "background-color: green; width: 150px; margin-left: 10px;"}
			]}
		]},
	],
	checkboxWrapper: function(){
		this.$.allDayEvent.setChecked(!this.$.allDayEvent.getChecked());
	},
	cancelEvent: function(){
		this.bubble("onShowCalendar");
	},
	createEvent: function(){
		var stdt = moment(this.$.fromDate.getValue()).startOf("day").hours(this.$.fromTime.getValue().getHours()).minutes(this.$.fromTime.getValue().getMinutes());
		var endt = moment(this.$.toDate.getValue()).startOf("day").hours(this.$.toTime.getValue().getHours()).minutes(this.$.toTime.getValue().getMinutes());
		var alarm = this.$.alarmTrigger.getSelected().value ? [{alarmTrigger: {valueType: "DURATION", value: this.$.alarmTrigger.getSelected().value}}] : [];
		var evt = {
			subject: this.$.eventName.getValue(),
			dtstart: stdt.valueOf(),
			dtend: endt.valueOf(),
			location: this.$.eventLocation.getValue(),
			//TODO:
			rrule: null,
			//TODO: Investigate:
			tzId: new enyo.g11n.TzFmt().getCurrentTimeZone(),
			alarm: alarm,
			note: this.$.eventNotes.getValue(),
			allDay: this.$.allDayEvent.getChecked()
		};
		console.log(evt);
		/*
		calendar.Events.createEvent({
			subject: 'Take daily medicine',  // string
			dtstart: '1290711600000', // string representing the start date/time as timestamp in milliseconds
			dtend: '1290718800000',  // string representing the end date/time as timestamp in milliseconds
			location: 'Wherever I am!', // string
			rrule: null, 
			tzId: new enyo.g11n.TzFmt().getCurrentTimeZone(),
			alarm: [
			    {
			        alarmTrigger: {
			            valueType: "DURATION",
			            value: "-PT15M"
			        }
			    }
			],
			note: 'Take alergy medicine, 1 pill',  // string
			allDay: false  // boolean
        });
		*/
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
