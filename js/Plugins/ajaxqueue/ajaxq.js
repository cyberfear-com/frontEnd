/**
 * Plugin for using queue for multiple ajax requests.
 *
 * @autor Pavel Máca
 * @github https://github.com/PavelMaca
 * @license MIT
 * $.ajaxQueue.run();

 // stop at actual position @TODO use .pause() instend
 $.ajaxQueue.stop();

 //delete all unprocessed requests from cache
 $.ajaxQueue.clear();

 */


	var AjaxQueue = function(options){
		this.options = options || {};

		var oldComplete = options.complete || function(){};
		var completeCallback = function(XMLHttpRequest, textStatus) {

			(function() {
				oldComplete(XMLHttpRequest, textStatus);
			})();

			XMLHttpRequest
				.success(function(){
				//console.log('good');
				$.ajaxQueue.currentRequest = null;
				$.ajaxQueue.startNextRequest();
			})
			.error(function(){
					$.ajaxQueue.startNextRequest('tryAgain');
			//console.log('bad');
			});

		};
		this.options.complete = completeCallback;
	};

	AjaxQueue.prototype = {
		options: {},
		perform: function() {
			$.ajax(this.options);
		}
	};

	$.ajaxQueue = {
		queue: [],
		tick:0,
		incrementalInt:1000,
		currentRequest: null,

		stopped: false,

		stop: function(){
			$.ajaxQueue.stopped = true;
			$.ajaxQueue.tick=0;
			$.ajaxQueue.incrementalInt=1000;

		},

		run: function(){
			$.ajaxQueue.stopped = false;
		//
			tick=0;
			//$.ajaxQueue.startNextRequest();
			$.ajaxQueue.startNextRequest('tryAgain');
		},

		clear: function(){
			$.ajaxQueue.queue = [];
			$.ajaxQueue.currentRequest = null;
		},

		removeFromQueue:function(modKey){
			//console.log('dsdsdsd');
			//console.log(modKey);
			var curQ=$.ajaxQueue.currentRequest;

			//console.log(curQ);
			//console.log(curQ['options']);
			//console.log(curQ['options']['data']);
			//console.log(curQ['options']['data']['modKey']);

			//console.log($.ajaxQueue.queue);
			var newQueue=[];

			if(curQ['options']['data']['modKey']==modKey){
				$.ajaxQueue.currentRequest = null;
				$.ajaxQueue.startNextRequest();
				$.ajaxQueue.clear();

			}else{
				$.each($.ajaxQueue.queue, function( index, qData ) {
					if(qData['options']['data']['modKey']!=modKey){
						newQueue.push(qData);
					}
				});

				$.ajaxQueue.queue=newQueue;
			}

			//console.log('dsdsdsd2');
			//console.log($.ajaxQueue.queue);

			//return $.ajaxQueue.queue;
		},

		returnWhat: function(){
			//console.log('dsdsdsd');
			//console.log($.ajaxQueue.queue);
			//return $.ajaxQueue.queue;
		},
		addRequest: function(options){
			var request = new AjaxQueue(options);

			$.ajaxQueue.queue.push(request);
			$.ajaxQueue.startNextRequest();
		},


		startNextRequest: function(message) {
			if ($.ajaxQueue.currentRequest) {

				//console.log('dfdf');
				if(message!=undefined && message=="tryAgain"){
					//console.log(message);

					var timer=setInterval(function(){

					//	console.log($.ajaxQueue.tick);

						if($.ajaxQueue.tick>=1){ //todo for developers
						//if($.ajaxQueue.tick==0){
							clearInterval(timer);
							$.ajaxQueue.stop();

						}else{
							$.ajaxQueue.incrementalInt=$.ajaxQueue.incrementalInt*1;
							var request = $.ajaxQueue.currentRequest;
							if (request) {
								clearInterval(timer);
								request.perform();
							}
							$.ajaxQueue.tick++;
						}

					},$.ajaxQueue.incrementalInt);

						//var tryAgain=setInterval(function(){
						//	console.log(tick);
						//	tick++;
						////	if(tick>3){
						//		clearInterval(tryAgain);
						//	}
						//},1000);

				}else{
					return false;

				}

			//	var tick=0;

			//	var tryAgain=setInterval(function(){
			//		console.log(tick);
			//		tick++;
			//	});
				//request.perform();
				//console.log($.ajaxQueue.currentRequest);

			}else{
				var request = $.ajaxQueue.queue.shift();
				if (request) {
					$.ajaxQueue.incrementalInt=1000;
					$.ajaxQueue.currentRequest = request;
					request.perform();
				}
			}



		}
	};