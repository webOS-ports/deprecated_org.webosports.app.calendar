//The day layout is easy. There's always 24 hours, and it's just a list.
enyo.kind({
	name: "Day",
	kind: "FittableRows",
	handlers: {
		onNext: "loadNext",
		onPrev: "loadPrev"
	},
	components: [
		{kind: "vi.Inf", name: "inf", fit: true, style: "background: white", components: [
			{content: "Yesterday", kind: "DayItem"},
			{content: "Today", kind: "DayItem", ontap: "test"},
			{content: "Tomorrow", kind: "DayItem"}
		]}
	],
	loadNext: function(){
		this.$.inf.provideNext({kind: "DayItem", content: "Added Next"});
	},
	loadPrev: function(){
		this.$.inf.providePrev({kind: "DayItem", content: "Added Before"});
	}
});

enyo.kind({
	name: "DayItem",
	style: "width: 100%"
});

enyo.kind({
	name: "vi.Inf",
	kind: "enyo.Panels",
	draggable: true,
	arrangerKind: "CarouselArranger",
	event: {
		onNext: "",
		onPrev: ""
	},
	handlers: {
		onTransitionFinish: "caller"
	},
	provideNext: function(panel){
		//Create/render it:
		this.createComponent(panel);
		//Re-render the control:
		this.render();
	},
	providePrev: function(panel){
		//Render the panel before everything:
		panel.addBefore = null;
		//Create/render it:
		this.createComponent(panel);
		//Re-render the control:
		this.render();
		//We now have to change the index because there's one behind us:
		this.si(this.getIndex()+1);
	},
	create: function(){
		this.inherited(arguments);
		this.si(1);
	},
	//Sets the index without animating it:
	si: function(i){
		this.setAnimate(false);
		this.setIndex(i);
		this.setAnimate(true);
	},
	caller: function(){
		var i = this.getIndex();
		var c = this.getComponents();
		//When the index is zero, we load the previous view:
		if(i <= 0){
			this.bubble("onPrev");
		}
		//When the index is two, we load the next view:
		else if(i >= c.length+1){
			this.bubble("onNext");
		}
	},
	manageMemory: function(){

	}
	//TODO: Manage Memory
});