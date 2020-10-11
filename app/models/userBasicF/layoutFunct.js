/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var LayoutFunct = Backbone.Model.extend({
		// Initialize with negative/empty defaults
		// These will be overriden after the initial checkAuth
		defaults: {

		},
		initialize: function(){

		},
        detectDirection:function(){
            //console.log('detecting');
            var arrow=$('.navArrow');


            //if(arrow.hasClass('fa-long-arrow-left')){
                app.layout.display('right');
            //}else{
             //   app.layout.display('left');
           // }

        },
        display:function(action){
            var left=$('#mLeftPanel').is(":visible");
            var mid=$('#mMiddlePanelTop').is(":visible");
            var right=$('#mRightPanel').is(":visible");


           //console.log(left);
           // console.log(mid);
          //  console.log(right);

            if(action=="right"){
                //console.log($('#mLeftPanel').is(":visible"));


                if(left && !mid && !right){
                    console.log('right1');
                }else if(!left && !mid && right){
                    $('#mLeftPanel').removeClass('col-xs-12');
                    $('#mLeftPanel').addClass('hidden-xs');

                    $('#mMiddlePanelTop').removeClass('hidden-xs');
                    $('#mMiddlePanelTop').addClass('col-xs-12');

                    $('#mRightPanel').removeClass('col-xs-12');
                    $('#mRightPanel').addClass('hidden-xs');
                    console.log('right2');
                }else if(!left && mid && !right){


                    $('#mLeftPanel').removeClass('hidden-xs');
                    $('#mLeftPanel').addClass('col-xs-12');

                    $('#mMiddlePanelTop').removeClass('col-xs-12');
                    $('#mMiddlePanelTop').addClass('hidden-xs');

                    $('#mRightPanel').removeClass('col-xs-12 col-sm-12');
                    $('#mRightPanel').addClass('hidden-xs hidden-sm');




                   // $( ".navArrow" ).each(function( i, item ) {
                    //    var item = $(item);
                  //  $( ".navArrow" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                   // });
                    console.log('right3');

                } else if(left && !mid && right){

                    $('#mLeftPanel').removeClass('hidden-xs');
                    $('#mLeftPanel').addClass('col-xs-12');

                    $('#mMiddlePanelTop').removeClass('col-xs-12 hidden-sm hidden-md hidden-lg');
                    $('#mMiddlePanelTop').addClass('col-xs-9 col-sm-9 col-md-10 col-lg-5');

                    $('#mRightPanel').removeClass('col-xs-12 col-sm-9 col-md-10 col-lg-11');
                    $('#mRightPanel').addClass('hidden-xs hidden-sm hidden-md col-lg-6');


                    console.log('right4');

                }else if(left && mid && right) {

                    // $('#mLeftPanel').removeClass('');
                    // $('#mLeftPanel').addClass('');

                    $('#mMiddlePanelTop').removeClass('col-lg-5');
                    $('#mMiddlePanelTop').addClass('hidden-lg');

                    $('#mRightPanel').removeClass('col-lg-6');
                    $('#mRightPanel').addClass('col-lg-11');
                    console.log('right5');


                }



            }
            if(action=="left"){
                console.log('left');
                /// console.log(left);
                // console.log(mid);
                //  console.log(right);

                if(left && mid && !right){
                    $('#mLeftPanel').removeClass('col-xs-12');
                    $('#mLeftPanel').addClass('hidden-xs');

                    $('#mMiddlePanelTop').removeClass('col-xs-9 col-sm-9 col-md-10');
                    $('#mMiddlePanelTop').addClass('col-xs-12 hidden-sm hidden-md');

                    $('#mRightPanel').removeClass('col-xs-12 hidden-sm hidden-md');
                    $('#mRightPanel').addClass('hidden-xs col-sm-9 col-md-10');

                    $( ".navArrow" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                }else if(!left && mid && !right){

                    $('#mLeftPanel').removeClass('col-xs-12');
                    $('#mLeftPanel').addClass('hidden-xs');

                    $('#mMiddlePanelTop').removeClass('col-xs-12');
                    $('#mMiddlePanelTop').addClass('hidden-xs');

                    $('#mRightPanel').removeClass('hidden-xs');
                    $('#mRightPanel').addClass('col-xs-12');
                    $( ".navArrow" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');

                }else if(!left && !mid && right) {

                    $('#mLeftPanel').removeClass('col-xs-12');
                    $('#mLeftPanel').addClass('hidden-xs');

                    $('#mMiddlePanelTop').addClass('col-xs-12');
                    $('#mMiddlePanelTop').removeClass('hidden-xs');

                    $('#mRightPanel').addClass('hidden-xs');
                    $('#mRightPanel').removeClass('col-xs-12');
                    $( ".navArrow" ).addClass('fa-long-arrow-left').removeClass('fa-long-arrow-right');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');

                } else if(left && !mid && right) {


                }else if(left && mid && right) {

                    // $('#mLeftPanel').removeClass('');
                    // $('#mLeftPanel').addClass('');

                    $('#mMiddlePanelTop').removeClass('col-lg-5');
                    $('#mMiddlePanelTop').addClass('hidden-lg');

                    $('#mRightPanel').removeClass('col-lg-6');
                    $('#mRightPanel').addClass('col-lg-11');

                    $( ".navArrow" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');

                }

            }


            if(action=="readEmail"){
                $('#mLeftPanel').removeClass('col-xs-12');
                $('#mLeftPanel').addClass('hidden-xs');

               // $('#mMiddlePanelTop').removeClass('col-xs-12 col-xs-9 col-sm-9 col-md-10');
                $('#mMiddlePanelTop').addClass('hidden-xs hidden-sm hidden-md');

                $('#mRightPanel').removeClass('hidden-xs hidden-sm hidden-md');
                $('#mRightPanel').addClass('col-xs-12 col-sm-9 col-md-10');


              /*  if(left && mid && !right){
                    $( ".navArrow" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                }else if(left && mid && right){
                    $( ".navArrow" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                }else if(!left && mid && !right){
                    $( ".navArrow" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                }*/

            }


            if(action=="compose"){
                $('#mLeftPanel').removeClass('col-xs-12');
                $('#mLeftPanel').addClass('hidden-xs');

                //$('#mMiddlePanelTop').removeClass('col-xs-12 col-xs-9 col-sm-9 col-md-10');
                $('#mMiddlePanelTop').addClass('hidden-xs hidden-sm hidden-md');

                $('#mRightPanel').removeClass('hidden-xs hidden-sm hidden-md');
                $('#mRightPanel').addClass('col-xs-12 col-sm-9 col-md-10');

            /*    if(left && mid && !right){
                    $( ".navArrow" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-left').addClass('fa-long-arrow-right');
                }else if(left && mid && right){
                    $( ".navArrow" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                    $( ".navArrow1" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');

                }else if(!left && mid && !right){
                    $( ".navArrow" ).removeClass('fa-long-arrow-right').addClass('fa-long-arrow-left');
                }
*/


            }


            var lft="Left hidden-xs col-sm-3 col-md-2 col-lg-2"; //col-md-cust
            var midl="Middle inbox col-xs-12 col-sm-9 col-md-10 col-lg-5  no-padding";// col-sm-12 col-md-10 col-lg-5
            var rght="Right hidden-xs hidden-sm hidden-md  col-lg-6";//col-lg-6

            // console.log(this.state.lft);
            if(action=="viewBox"){
                $('#mLeftPanel').removeClass();
                $('#mLeftPanel').addClass(lft);

                $('#mMiddlePanelTop').removeClass();
               $('#mMiddlePanelTop').addClass(midl);

                $('#mRightPanel').removeClass();
                $('#mRightPanel').addClass(rght);

            }

        }





	});

	return LayoutFunct;
});