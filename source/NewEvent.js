enyo.kind({
	name: "calendar.NewEvent",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "New Calendar Event"},
		{kind: "Scroller", fit: true, touch: true, components: [
			{classes: "enyo-border-box newevent-innerblock", components: [
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", placeholder: "Event Name"}
					]},
					{kind: "onyx.InputDecorator", components: [
						{kind: "onyx.Input", placeholder: "Event Location"}
					]}
					//TODO: Calendar Selector Here:
					//Right now there's one calendar so this isn't really needed.
				]},
				{kind: "onyx.Groupbox", classes: "newevent-row", components: [
					//TODO: Make a class for this stuff:
					{style: "padding: 10px;", components: [
						{kind: "onyx.Checkbox"},
						{content: "All Day Event", style: "font-size: 1.1em; padding-left: 10px;"}
					]},
					{style: "padding: 10px;", components: [
						{content: "From"},
						{style: "display: inline-block; margin-right: 15px;", kind:"onyx.DatePicker"}, {style: "display: inline-block; margin-left: 15px;", kind:"onyx.TimePicker"}
					]},
					{style: "padding: 10px;", components: [
						{content: "To"},
						{style: "display: inline-block; margin-right: 15px;", kind:"onyx.DatePicker"}, {style: "display: inline-block; margin-left: 15px;", kind:"onyx.TimePicker"}
					]},
					{style: "padding: 10px;", components: [
						{content: "Repeat"}
					]}
				]},
			]}
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
			{style: "margin: 0 auto; text-align: center;", fit: true, components: [
				{kind: "onyx.Button", content: "Cancel", ontap: "cancelEvent", style: "width: 150px; margin-right: 10px;"},
				{kind: "onyx.Button", content: "Create", style: "background-color: green; width: 150px; margin-left: 10px;"}
			]}
		]},
	],
	cancelEvent: function(){
		this.bubble("onShowCalendar");
	}
});