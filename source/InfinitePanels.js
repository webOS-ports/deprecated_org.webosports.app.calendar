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
		onTransitionFinish: "caller"
	},
	create: function(){
		//Load up first three panels:
		if(this.components){
			for(var i = 0; i < 3; i++){
				this.components[i].currIndex = i - 1;
			}
		}
		this.inherited(arguments);
		this.createComponent({kind: "Signals", onCoreNaviDragStart: "handleCoreNaviDragStart", onCoreNaviDrag: "handleCoreNaviDrag", onCoreNaviDragFinish: "handleCoreNaviDragFinish"});
	},
	//Lets you slowly pan through the different days:
	handleCoreNaviDragStart: function(inSender, inEvent) {
		this.dragstartTransition(this.draggable == false ? (inEvent) : this.reverseDrag(inEvent));
	},
	handleCoreNaviDrag: function(inSender, inEvent) {
		this.dragTransition(this.draggable == false ? (inEvent) : this.reverseDrag(inEvent));
	},
	handleCoreNaviDragFinish: function(inSender, inEvent) {
		this.dragfinishTransition(this.draggable == false ? (inEvent) : this.reverseDrag(inEvent));
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
		//Simple ordering:
		panel.currIndex = this.current + 1;
		//Create/render it:
		this.createComponent(panel).render();
		//Re-render the control:
		//this.render();
	},
	//Provide the previous panel:
	providePrev: function(panel){
		//Simple ordering:
		panel.currIndex = this.current - 1;
		//Render the panel before everything:
		panel.addBefore = null;
		//Create/render it:
		this.createComponent(panel).render();
		//Re-render the control:
		//this.render();
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
	caller: function(inSender, inEvent){
		this.inherited(arguments);
		//Some simple prevention:
		if(this.preventCaller || !inEvent || !("toIndex" in inEvent) || !("fromIndex" in inEvent) || (inEvent.toIndex === 1 && inEvent.fromIndex === 1)){
			//Do Nothing
		}else{
			var i = this.getIndex();
			var c = this.getControls();

			this.preventCaller = true;

			//When the index is zero, we load the previous view:
			if(i <= 0){
				this.current--;
				this.bubble("onPrev", {current: this.current});
			}
			//When the index is the last one, load the next view:
			else if(i >= 2){
				this.current++;
				this.bubble("onNext", {current: this.current});
			}
			//These cases should never exist:
			else if(i === 1){
				c = this.getControls();
				//If the view is 1, but there's no previous view:
				if(!c[0]){
					console.log("PREV NOT EXISTS");
					this.bubble("onPrev", {current: this.current-1});
				}
				//If the view is 1, but there's no next view:
				if(!c[2]){
					console.log("NEXT NOT EXISTS");
					this.bubble("onNext", {current: this.current+1});
				}
			}

			//Dump old panels:
			this.manageMemory();
			//Unlock the caller:
			this.preventCaller = false;
			//Re-render control:
			this.render();
		}
		return true;
	},
	//This lets you reset the entire panel kind. This should start it over with whatever components you define.
	reset: function(components){
		//Set the currIndex on the first three panels:
		for(var i = 0; i < 3; i++){
			components[i].currIndex = i - 1;
		}
		//Set current:
		this.current = 0;
		//Destroy all controls:
		this.destroyClientControls();
		//Bring in the new ones:
		this.createComponents(components);
		this.si(1);
	},
	//This function makes sure that there are only 3 panels at any given time.
	manageMemory: function(){
		var i = this.getIndex();
		var c = this.getControls();

		//Fix sorting issue:
		c = c.sort(function(a,b) {
			if (a.currIndex < b.currIndex)
				return -1;
			if (a.currIndex > b.currIndex)
				return 1;
			return 0;
		});
		//Destroy controls at the end:
		if(c.length > 3){
			for(var k = 0; k < i-1; k++){
				c[k].destroy();
			}
			for(var k = i+2; k < c.length; k++){
				c[k].destroy();
			}
		}
		this.si(1);
	}
});