/*
 * Used to get the parameters that are passed to this window via the no window manager. This manages things like first use (to decrease load time), Just Type actions, and cross-app launching.
 */

enyo.getWindowParams = function(){
	//Parse it down into an object:
	var sloc = window.location.toString().split("?");
	if(sloc.length <= 0){
		return {};
	}
	var rloc = sloc[sloc.length-1].split("&");
	if(rloc.length <= 0){
		return {};
	}
	var params = null;
	for(var i = 0; i < rloc.length; i++){
		var ss = rloc[i].split("=");
		
		//Check to see if this pair is a set of params:
		if(ss[0] === "launchParams"){
			return JSON.parse(decodeURIComponent(ss[1]));
		}
	}
	return {};
}