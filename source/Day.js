//The day layout is easy. There's always 24 hours, and it's just a list.
enyo.kind({
	name: "Day",
	kind: "FittableRows",
	handlers: {
		onNext: "loadNext",
		onPrev: "loadPrev"
	},
	components: [
		{kind: "vi.Inf", name: "inf", fit: true, coreNavi: true, style: "background: white", components: [
			{content: "Yesterday", kind: "DayPage"},
			{content: "Today", kind: "DayPage", ontap: "test"},
			{content: "Tomorrow", kind: "DayPage"}
		]}
	],
	
	//Load up different days based on where we are in the panels:
	loadNext: function(){
		this.$.inf.provideNext({kind: "DayPage", content: "Added Next"});
	},
	loadPrev: function(){
		this.$.inf.providePrev({kind: "DayPage", content: "Added Before"});
	}
});
//The actual page for one day.
enyo.kind({
	name: "DayPage",
	kind: "FittableColumns",
	style: "width: 100%",
});