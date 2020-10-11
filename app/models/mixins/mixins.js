/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var Mixins = Backbone.Model.extend({

		initialize: function(){
			//app.mixins
			//User main Data
			this.set({
                "startPositionX": 0,
                "lastPositionX": 0,
                "startTime": "",
                "slide": ""

            });

		},
		canNavigate: function (callback) {

			if(app.user.get("inProcess")){

				$('#infoModHead').html("Active Process");
				$('#infoModBody').html("Please cancel or wait until process is finished before go to the next page.");
				$('#infoModal').modal('show');

				callback(false);
			}else if(app.user.get("uploadInProgress")){

				$('#infoModHead').html("File Upload In Progress");
				$('#infoModBody').html("Please wait until file uploading complete");
				$('#infoModal').modal('show');

			}else{
				callback(true);
			}


		},
        hidePopHover:function(){
            $('[data-toggle="popover-hover"]').popover('hide');
        },

        toggleList:function(event){

            var arrow={};
            if($(event.target).hasClass('btn-default')){
                arrow=$(event.target).children('i');
            }else if($(event.target).hasClass('ion-arrow-left-c') || $(event.target).hasClass('ion-arrow-right-c')){
                arrow=$(event.target);
            }


            if(arrow.hasClass('ion-arrow-left-c')){
                app.mixins.set({'slide':'left'});
                arrow.removeClass('ion-arrow-left-c').addClass('ion-arrow-right-c');
            }else if(arrow.hasClass('ion-arrow-right-c')){
                app.mixins.set({'slide':'right'});
                arrow.removeClass('ion-arrow-right-c').addClass('ion-arrow-left-c')

            }

        },
        /*
        toggleNav:function(event){

            var arrow={};
            if($(event.target).hasClass('btn-default')){
                arrow=$(event.target).children('i');
            }else if($(event.target).hasClass('fa-long-arrow-left') || $(event.target).hasClass('fa-long-arrow-right')){
                arrow=$(event.target);
            }

            var left=$('#mLeftPanel').is(":visible");
            var mid=$('#mMiddlePanel').is(":visible");
            var right=$('#mRightPanel').is(":visible");

            console.log(left);
            console.log(mid);
            console.log(right);


            if(arrow.hasClass('fa-long-arrow-left')){
                console.log('lArr');

                if(!left && mid && !right){
                    console.log('1');
                    app.mixins.set({'slide':'right'});


                }else if(!left && !mid && right){
                    console.log('1');
                    app.mixins.set({'slide':'right'});
                }else if(left && !mid && right){
                    app.mixins.set({'slide':'right'});

                }

                /*else if(left && mid && !app.mixins.get('right')){
                    app.mixins.set({'slide':'right'});
                    arrow.removeClass('fa fa-long-arrow-left').addClass('fa fa-long-arrow-right');

                }*/


/*

            }else if(arrow.hasClass('fa-long-arrow-right')){
                console.log('rArr');

                if(left && mid && !right){
                    console.log('1r');
                    app.mixins.set({'slide':'left'});
                }else if(!left && mid && !right){
                    console.log('2r');
                    app.mixins.set({'slide':'left'});
                    arrow.removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                }


            }







            //fa fa-long-arrow-left


        },
        */

		touchMixins: function () {

			var thisComp=this;
			var TouchControl = {

				handleTouchStart: function(e) {
					//console.log('handleTouchStart');
                    thisComp.set({
                        "slide":''
                    });

					var touch = e.touches[0];

					thisComp.set({
                        "startPositionX":touch['clientX'],
                       'lastPositionX':touch['clientX']

                    });
					//console.log(touch['clientX']);

				},
				handleTouchMove: function(e) {
					//console.log('handleTouchStart');

					var touch = e.touches[0];
					thisComp.set({"lastPositionX":touch['clientX']});


				},
				handleTouchEnd: function(e) {

                    //console.log(thisComp.get("lastPositionX"));


                    //var touch = e.touches[0];

					if(thisComp.get("startPositionX")>0 && thisComp.get("lastPositionX")>0){
						if(thisComp.get("startPositionX")-thisComp.get("lastPositionX")>60){
                           // console.log('leftMix')
                            app.layout.display('left');


						}else if(thisComp.get("lastPositionX")-thisComp.get("startPositionX")>60){
                          //  console.log('rightMix')
                            app.layout.display('right');
						}
					}


				}


			};
			return TouchControl;

		}


});

	return Mixins;
});