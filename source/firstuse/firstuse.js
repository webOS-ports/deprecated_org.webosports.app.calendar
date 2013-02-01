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
		{kind: "Signals", onSettingsChange: "settingsChanged"}
	],
	firstUseDone: function(){
		this.bubble("onFirstUseDone");
	},
	settingsChanged: function(){
		console.log("SETTINGS: " + calendar.Preferences.prefs);
		this.showAlert();
	},
	showAlert: function(){
		//navigator.notification.beep(1);
		navigator.notification.openWindow("assets/reminders/Reminder.html", "PopupAlert", {}, {"window": "popupalert"}, "height=120");
	}
});