enyo.kind({
	name: "MainApp",
	kind: "FittableRows",
	handlers: {
		onJumpTo: "jumpTo",
		onSwapView: "swapView"
	},
	components: [
		{kind: "onyx.Toolbar", content: "Calendar"},
		{kind: "Panels", name: "timeViews", onTransitionFinish: "updateView", draggable: false, classes: "main", fit: true, components: [
			{kind: "Day"},
			{content: "Week"},
			{kind: "Month"},
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout",  /*Fix a bug in Enyo 2 that causes a bottom gap:*/ style: "height: 56px;", components: [
			{kind: "onyx.Button", name: "newevent", content: "New Event"},
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
		{kind: "JumpToDialog", name: "jumptodialog"}
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
			this.updateView();
		}else{
			this.$.timeViews.setIndex(inSender.index);
		}
	},
	updateView: function(){
		//Call the visited page's "navigated" function, if it exists.
		var a = this.$.timeViews.getActive();
		if(a.navigated && !this.supress){
			a.navigated();
		}
		this.supress = false;
	}
});

enyo.kind({
	name: "JumpToDialog",
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