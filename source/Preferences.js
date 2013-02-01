//Create a settings manager.
//Using a singleton lets us just maintain one set of preferences and access it from other kinds.
enyo.singleton({
	name: "calendar.Preferences",
	kind: "Component",
	published: {
		
	},
	create: function(){
		this.inherited(arguments);
	}
});