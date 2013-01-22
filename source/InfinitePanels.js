enyo.kind({
	name: "vi.Inf",
	kind: "enyo.Panels",
	draggable: true,
	arrangerKind: "CarouselArranger",
	//We want the index to be 1:
	index: 1,
	properties: {
		coreNavi: true
	},
	events: {
		onNext: "",
		onPrev: ""
	},
	handlers: {
		//TODO: Test calling on transition start:
		onTransitionStart: "scaller",
		onTransitionFinish: "caller"
	},
	create: function(){
		this.inherited(arguments);
		this.createComponent({kind: "Signals", onCoreNaviDragStart: "handleCoreNaviDragStart", onCoreNaviDrag: "handleCoreNaviDrag", onCoreNaviDragFinish: "handleCoreNaviDragFinish"});
	},
	//Lets you slowly pan through the different days:
	handleCoreNaviDragStart: function(inSender, inEvent) {
		this.dragstartTransition(this.draggable == false ? this.reverseDrag(inEvent) : inEvent);
	},
	handleCoreNaviDrag: function(inSender, inEvent) {
		this.dragTransition(this.draggable == false ? this.reverseDrag(inEvent) : inEvent);
	},
	handleCoreNaviDragFinish: function(inSender, inEvent) {
		this.dragfinishTransition(this.draggable == false ? this.reverseDrag(inEvent) : inEvent);
	},
	//Utility Functions
	reverseDrag: function(inEvent) {
		inEvent.dx = -inEvent.dx;
		inEvent.ddx = -inEvent.ddx;
		inEvent.xDirection = -inEvent.xDirection;
		return inEvent;
	},
	//Provide the next panel:
	provideNext: function(panel){
		//Create/render it:
		this.createComponent(panel);
		//Re-render the control:
		this.render();
	},
	//Provide the previous panel:
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
	//Sets the index without animating it:
	si: function(i){
		this.setAnimate(false);
		this.setIndex(i);
		this.setAnimate(true);
	},
	//Called when the transition ends to get the next/previous panels if they are needed.
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
	//Once we get past 5 panels, we start to see serious performance issues, so hopefully we can solve these by finishing this function to clear out unused dom nodes:
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