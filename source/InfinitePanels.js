enyo.kind({
	name: "vi.Inf",
	kind: "enyo.Panels",
	draggable: true,
	arrangerKind: "CarouselArranger",
	//We want the index to be 1:
	index: 1,
	//Current keeps track of where we are
	current: 0,
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
			this.current--;
			this.bubble("onPrev", {current: this.current});
		}
		//When the index is the last one, load the next view:
		else if(i >= c.length-1){
			this.current++;
			this.bubble("onNext", {current: this.current});
		}

		//this.manageMemory();
	},
	//This function makes sure that there are only 3 panels at any given time.
	manageMemory: function(){
		var i = this.getIndex();
		var c = this.getControls();

		//Destroy controls at the end:
		if(c.length > 3){
			var ii = this.getIndex();
			for(var k = 0; k < ii-1; k++){
				console.log(k);
				c[k].destroy();
			}
			for(var k = ii+2; k < c.length; k++){
				console.log(k);
				c[k].destroy();
			}
		}

		this.si(1);
	}
});