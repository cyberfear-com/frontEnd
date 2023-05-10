/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var AppData = Backbone.Model.extend({
		initialize: function(){
			//app.sessionData
			this.set({"sessionReady": ''});

		//	_.bindAll.apply(_, [this].concat(_.functions(this)));
		},


	//	if (!window.indexedDB) {
		//console.info('Indexed Database API not supported on this browser');
	//}

	//}
	});

	return AppData;
});
