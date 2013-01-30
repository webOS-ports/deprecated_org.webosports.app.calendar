enyo.kind({
	name: "FirstUse",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Calendar First Use"},
		{fit: true, style: "padding-top: 20px;", components: [
			{style: "display: block; text-align: center; margin: 0px auto;", components: [
				{content: "Open webOS currently only supports local accounts."},
				{kind: "onyx.Button", ontap: "firstUseDone", content: "Continue", style: "width: 50%; margin-top: 20px; color: white; background-color: green;"}
			]}
		]}
	],
	firstUseDone: function(){
		this.bubble("onFirstUseDone");
	}
});