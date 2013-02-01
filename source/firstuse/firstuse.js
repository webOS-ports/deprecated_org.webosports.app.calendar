//Right now this is used as the testing ground for stuff because it's easy to manage here. Things will likely break out of here once they're stable or at least usable.
enyo.kind({
	name: "calendar.FirstUse",
	kind: "FittableRows",
	components: [
		{kind: "onyx.Toolbar", content: "Calendar First Use"},
		{fit: true, style: "padding-top: 20px;", components: [
			{style: "display: block; text-align: center; margin: 0px auto;", components: [
				{content: "Open webOS currently only supports local accounts."},
				{kind: "onyx.Button", name: "continue", disabled: true, ontap: "firstUseDone", content: "Continue", style: "width: 50%; margin-top: 20px; color: white; background-color: green;"}
			]}
		]},
		{kind: "Signals", onSettingsLoad: "settingsLoad"}
	],
	firstUseDone: function(){
		//This is no longer the first launch, let the preferences know:
		calendar.Preferences.setOne("firstlaunch", false);
		//Show an alert just for debugging reasons.
		//TODO: Remove:
		this.showAlert();
		//Let the parent know that we've completed the first use and can now navigate to the main panels kind:
		this.bubble("onFirstUseDone");
	},
	//Called when the settings are first loaded:
	settingsLoad: function(){
		//Grab the preferences:
		var prefs = calendar.Preferences.prefs;
		//Let them press the button now:
		this.$.continue.setDisabled(false);
	},
	//TODO: Remove:
	showAlert: function(){
		//navigator.notification.beep(1);
		navigator.notification.openWindow("assets/reminders/Reminder.html", "PopupAlert", {}, {"window": "popupalert"}, "height=120");
	}
});