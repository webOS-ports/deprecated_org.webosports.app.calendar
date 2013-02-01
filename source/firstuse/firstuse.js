//Right now this is used as the testing ground for stuff because it's easy to manage here. Things will likely break out of here once they're stable or at least usable.
enyo.kind({
	name: "calendar.FirstUse",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Calendar First Use"},
		{fit: true, style: "padding-top: 20px;", components: [
			{style: "display: block; text-align: center; margin: 0px auto;", components: [
				{content: "Open webOS currently only supports local accounts."},
				{kind: "onyx.Button", ontap: "firstUseDone", content: "Continue", style: "width: 50%; margin-top: 20px; color: white; background-color: green;"}
			]}
		]},
		{kind: enyo.Signals, ondeviceready: "managePrefs"}
	],
	firstUseDone: function(){
		this.bubble("onFirstUseDone");
	},
	managePrefs: function(){
		this.dbQuery();
		this.showAlert();
	},
	dbQuery: function(){
		var that = this;
		navigator.service.Request("palm://com.palm.db/", {
			"method": "find",
			"parameters": {
				"query": {
					"from": "org.webosports.calendarprefs:1"
				}
			},
			onSuccess: function(inSender){
				console.log(JSON.stringify(inSender));
				that.destroy();
			},
			onFailure: function(inSender){
				console.log("F");
				console.log(JSON.stringify(inSender));
			}	
		});
	},
	showAlert: function(){
		//navigator.notification.beep(1);
		navigator.notification.openWindow("assets/reminders/Reminder.html", "PopupAlert", {}, {"window": "popupalert"}, "height=120");
	}
});