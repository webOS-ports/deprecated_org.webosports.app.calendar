enyo.kind({
	name: "calendar.MainApp",
	kind: "FittableRows",
	handlers: {
		onJumpTo: "jumpTo",
		onSwapView: "swapView"
	},
	components: [
		{kind: "onyx.Toolbar", content: "Calendar"},
		{kind: "Panels", name: "timeViews", onTransitionFinish: "updateView", draggable: false, classes: "main", fit: true, components: [
			{kind: "calendar.Day"},
			{kind: "calendar.Week"},
			{kind: "calendar.Month"},
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout",  /*Fix a bug in Enyo 2 that causes a bottom gap:*/ style: "height: 56px;", components: [
			{kind: "onyx.Button", name: "newevent", content: "New Event", ontap: "createEvent"},
			{fit: true, components: [
				{kind: "onyx.RadioGroup", name: "viewSelect", classes: "view-select", controlClasses: "view-select-button", components: [
					{content: "Day", index: 0, ontap: "changeView", active: true},
					{content: "Week", index: 1, ontap: "changeView"},
					{content: "Month", index: 2, ontap: "changeView"}
				]}
			]},
			//Taken from the webOS 3.0 Calendar app (as was the new event button location:
			{kind: "onyx.Button", name: "jumpto", content: "Jump to...", ontap: "showJumpTo"}
		]},
		{kind: "calendar.JumpToDialog", name: "jumptodialog"}
	],
	reflow: function(){
		this.inherited(arguments);
		if(enyo.Panels.isScreenNarrow()){
			//TODO: Show add event iconbutton?
			this.$.timeViews.setArrangerKind("CoreNaviArranger");
			this.$.jumpto.hide();
			this.$.newevent.hide();
		}else{
			this.$.jumpto.show();
			this.$.newevent.show();
			this.$.timeViews.setArrangerKind("CardArranger");
		}
	},
	createEvent: function(){
		this.bubble("onNewEvent");
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
	navigated: function(){
		//Called when the control is first navigated to:
		var a = this.$.timeViews.getActive();
		if(a && a.first){
			a.first();
		}
	},
	swapView: function(inSender, inEvent){
		this.changeView(inEvent, {});
		this.jumpTo({}, inEvent.inEvent);
		if(inEvent.supress){
			this.supress = true;
		}
		this.$.viewSelect.getControls()[inEvent.index].setActive(true);
	},
	jumpTo: function(inSender, inEvent){
		var a = this.$.timeViews.getActive();
		if(a.jumpToDate){
			a.jumpToDate(inEvent);
		}
	},
	showJumpTo: function(){
		this.$.jumptodialog.render();
		this.$.jumptodialog.capture();
		this.$.jumptodialog.reflow();

		this.$.jumptodialog.show();
	},
	changeView: function(inSender, inEvent){
		if(this.$.timeViews.getIndex() === inSender.index){
			this.updateView(true);
		}else{
			var a = this.$.timeViews.getActive();
			if(a.away){
				a.away(inEvent);
			}
			this.$.timeViews.setIndex(inSender.index);
		}
	},
	updateView: function(reload){
		//Call the visited page's "navigated" function, if it exists.
		var a = this.$.timeViews.getActive();
		if(a.navigated && !this.supress){
			a.navigated(reload);
		}
		this.supress = false;
	}
});

enyo.kind({
	name: "calendar.JumpToDialog",
	kind: "onyx.Popup",
	style: "background: #eee; color: black;",
	centered: true,
	floating: true,
	scrim: true,
	//Breaks because popups in pickers are lame:
	modal: false,
	components: [
		{name: "pickerHolder", components: [
			{name: "picker", classes: "pickerFix", kind: "onyx.DatePicker"}
		]},
		{kind: "onyx.Button", classes: "onyx-affirmative", content: "Okay", style: "width: 100%; margin-top: 10px; background-color: green;", ontap: "changeDate"}
	],
	changeDate: function(){
		this.bubble("onJumpTo", this.$.picker.getValue());
		this.hide();
	}
});