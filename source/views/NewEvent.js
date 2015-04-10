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
						{kind: "onyx.Checkbox", name: "allDayEvent", onchange: "updateAlldayView"},
						{content: "All Day Event", style: "font-size: 1.1em; padding-left: 10px;", ontap: "checkboxWrapper"}
					]},
					{classes: "newevent-item", components: [
						{content: "From", style: "display: block;"},
						{style: "margin-right: 15px;", name: "fromDate", onSelect: "moveToDate", kind:"onyx.DatePicker"}, {style: "margin-left: 15px;", name: "fromTime", kind:"onyx.TimePicker"}
					]},
					{classes: "newevent-item", components: [
						{content: "To", style: "display: block;"},
						{style: "margin-right: 15px;", name: "toDate", kind:"onyx.DatePicker"}, {style: "margin-left: 15px;", name: "toTime", kind:"onyx.TimePicker"}
					]},
					{classes: "newevent-item", components: [
						{style: "margin-right: 30px;",components: [
							{content: "Repeat"},
							{kind: "onyx.PickerDecorator", style: "padding: 5px;", components: [
								{style: "width: 180px;"},
								{kind: "onyx.Picker", name: "rrule", components: [
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
							//TODO: Change for all day events.
							{kind: "onyx.PickerDecorator", style: "padding: 5px;", components: [
								{style: "width: 180px;"},
								{kind: "onyx.Picker", name: "alarmTrigger", components: [
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
	_alarmsEvent: {
		"false": "No Reminder",
		"+PT0M": "At start time",
		"-PT5M": "5 minutes before",
		"-PT10M": "10 minutes before",
		"-PT15M": "15 minutes before",
		"-PT30M": "30 minutes before",
		"-PT1H": "1 hour before",
		"-P1D": "1 day before"
	},
	_alarmsDay: {
		"false": "No Reminder",
		"+PT0M": "At start time",
		"-P1D": "1 day before",
		"-P2D": "2 days before",
		"-P3D": "3 days before",
		"-P1W": "1 week before"
	},
	checkboxWrapper: function(){
		this.$.allDayEvent.setChecked(!this.$.allDayEvent.getChecked());
		this.updateAlldayView();
	},
	moveToDate: function(inSender, inEvent){
		if(inEvent.value.getTime() > this.$.toDate.getValue().getTime()){
			var moveTo = new Date(inEvent.value);
			var std = moment(moveTo).startOf("day");
			std.hours(this.$.fromTime.getValue().getHours()).minutes(this.$.fromTime.getValue().getMinutes());
			std.add("minutes", calendar.Preferences.prefs.defaultEventDuration || 60);
			
			this.$.toDate.setValue(std.toDate());
			this.$.toTime.setValue(std.toDate());
		}
	},
	updateAlldayView: function(){
		if(this.$.allDayEvent.getChecked()){
			this.$.fromTime.hide();
			this.$.toTime.hide();
			this.$.alarmTrigger.destroyClientControls();
			for(var x in this._alarmsDay){
				if(this._alarmsDay.hasOwnProperty(x)){
					this.$.alarmTrigger.createComponent({content: this._alarmsDay[x], value: x});
				}
			}
			this.$.alarmTrigger.render();
			this.$.alarmTrigger.setSelected(this.$.alarmTrigger.getClientControls()[enyo.keys(this._alarmsDay).indexOf(calendar.Preferences.prefs.defaultAllDayEventReminder || "-P1D")]);
		}else{
			this.$.fromTime.show();
			this.$.toTime.show();
			this.$.alarmTrigger.destroyClientControls();
			for(var x in this._alarmsEvent){
				if(this._alarmsEvent.hasOwnProperty(x)){
					this.$.alarmTrigger.createComponent({content: this._alarmsEvent[x], value: x});
				}
			}
			this.$.alarmTrigger.render();
			this.$.alarmTrigger.setSelected(this.$.alarmTrigger.getClientControls()[enyo.keys(this._alarmsEvent).indexOf(calendar.Preferences.prefs.defaultEventReminder || "-PT15M")]);
		}
	},
	cancelEvent: function(){
		this.bubble("onShowCalendar");
	},
	createEvent: function(){
		//TODO: do we need to change this for all day events?
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
			tzid: new ilib.LocaleInfo().getTimeZone(),
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
			tzId: new ilib.LocaleInfo().getTimeZone(),
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
		this.updateAlldayView();
		this.$.rrule.setSelected(this.$.rrule.getClientControls()[0]);
	}
});
