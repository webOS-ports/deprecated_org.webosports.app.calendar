enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "onyx",
	components: [
		{kind: "Signals",
		ondeviceready: "deviceready",
		onbackbutton: "handleBackGesture",
		onCoreNaviDragStart: "handleCoreNaviDragStart",
		onCoreNaviDrag: "handleCoreNaviDrag",
		onCoreNaviDragFinish: "handleCoreNaviDragFinish"},


		{name: "MainApp", kind: "MainApp", fit: true},


		{kind: "CoreNavi", fingerTracking: true}
	]
});
