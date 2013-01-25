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
			{kind: "onyx.Button", name: "jumpto", content: "Jump to..."}
		]}
	],
	reflow: function(){
		this.inherited(arguments);
		if(enyo.Panels.isScreenNarrow()){
			this.$.timeViews.setArrangerKind("CoreNaviArranger");
			this.$.jumpto.hide();
			this.$.newevent.hide();
		}else{
			this.$.jumpto.show();
			this.$.newevent.show();
			this.$.timeViews.setArrangerKind("CardArranger");
		}
	},
	changeView: function(inSender, inEvent){
		this.$.timeViews.setIndex(inSender.index);
	},
	updateView: function(){
		//Call the visited page's "navigated" function, if it exists.
		var a = this.$.timeViews.getActive();
		if(a.navigated){
			a.navigated();
		}
	}
});