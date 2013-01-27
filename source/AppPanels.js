enyo.kind({
	name: "MainApp",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Calendar"},
		{kind: "Panels", name: "timeViews", onTransitionFinish: "updateView", draggable: false, classes: "main", fit: true, components: [
			{kind: "Day"},
			{content: "Week"},
			{content: "Month"}
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout",  /*Fix a bug in Enyo 2 that causes a bottom gap:*/ style: "height: 56px;", components: [
			{kind: "onyx.Button", name: "newevent", content: "New Event"},
			{fit: true, components: [
				{kind: "onyx.RadioGroup", classes: "view-select", controlClasses: "view-select-button", components: [
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
	showJumpTo: function(){
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
		if(a.navigated){
			a.navigated();
		}
	}
});

enyo.kind({
	name: "JumpToDialog",
	kind: "onyx.Popup",
	events: {
		onJumpTo: ""
	},
	style: "background: #eee;color: black;",
	centered: true,
	floating: true,
	scrim: true,
	modal: true,
	components: [
		{name: "picker", kind: "onyx.DatePicker"},
		{kind: "onyx.Button", classes: "onyx-affirmative", content: "Okay", style: "width: 100%; margin-top: 20px;", ontap: "changeDate"}
	],
	changeDate: function(){
		this.bubble("onJumpTo", this.$.picker.getValue());
		this.hide();
	}
});