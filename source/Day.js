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
		var c = this.getControls();
		//When the index is zero, we load the previous view:
		if(i <= 0){
			this.bubble("onPrev");
		}
		//When the index is the last one, load the next view:
		else if(i >= c.length-1){
			this.bubble("onNext");
		}

		//this.manageMemory();
	},
	//This function needs some work. We should keep a local copy of the panels that you've defined.
	//We should also maintain a count that we pass to the next and previous panels so that they can know what days to load.
	//This count can also be used to load panels from memory.
	manageMemory: function(){
		var i = this.getIndex();
		var c = this.getControls();
		for(var j = 0; j < c.length; j++){
			//Check if it's a neighbor:
			if(j > i+1 || j < i-1){
				c[j].hide();
			}else{
				c[j].show();
			}
		}
	}
});