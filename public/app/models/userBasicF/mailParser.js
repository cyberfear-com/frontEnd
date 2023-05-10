/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var mailParser = Backbone.Model.extend({
		// Initialize with negative/empty defaults
		// These will be overriden after the initial checkAuth
		defaults: {

		},
		initialize: function(){

          //  this.set({"mailData": {html:[], text:[], attachments:[]}});
          //  this.set({"mimeMultipart": ''});
		},
        parseMimeFragment:function(fragmentStr){
            //console.log(fragmentStr);

            var result = {};
            // each fragment has a content type and encoding

            result["contentType"] = (/^Content-Type: (.+);/m).exec(fragmentStr)[1];
            //console.log((/^Content-Type: (.+)$/m).exec(fragmentStr));


           // console.log('g1');

            result["encoding"] =
                (/^Content-Transfer-Encoding: (.+)$/m).exec(fragmentStr)[1];

          //  console.log('g2');
            // not all fragments have a disposition or an id
            if ((/^Content-Disposition: (.*);/m).test(fragmentStr)){
                result["contentDisposition"] =
                    (/^Content-Disposition: (.*);/m).exec(fragmentStr)[1];

            }

        //    console.log('g3');
            if ((/filename="(.*)"$/m).test(fragmentStr)){
                result["fileName"] =
                    (/filename="(.*)"$/m).exec(fragmentStr)[1];

            }
          //  console.log('g4');

            if ((/^Content-ID: ((.|\r\n\t)+)\r\n/mg).test(fragmentStr)){
                result["contentId"] =
                    (/^Content-ID: ((.|\r\n\t)+)\r\n/mg).exec(fragmentStr);
            }
            // in my case between MIME headers and content where 2 \r\n,
            // may be only one if there are problems with this code
            //console.log((/^[\\s*]([\\s\\S]*)/m).exec(fragmentStr));
           // console.log(fragmentStr);

            result["contents"] = (/^[\s*]([\s\S]*)/m).exec(fragmentStr)[0];
           // console.log('g5');
            result["isFragment"] = true;
            //console.log('gggg');
           //console.log(result);
            return result;
        },

        parseMimeContainer:function(aContainerStr){
            // each container has a content type and boundary
            var cType = (/^Content-Type: (.*);([\s\S]+?)\r?\n(?=\r?\n)/m).exec(aContainerStr);
           // console.log(aContainerStr);

            if ((/boundary="(.+)"/m).test(cType[2])){
                boundary =
                    (/boundary="(.+)"/m).exec(cType[2])[1];
            }

            //var boundary = (/boundary="(.+)"/m).exec(cType[2])[1];
            //console.log(boundary[1]);

            var result = new Object();
            result["contentType"] = cType[1];
            result["boundary"] = boundary;
            result["isFragment"] = false;

            //console.log(result);
            // next fetch contents (everything after the first use of boundary)

           // console.log(aContainerStr);
            var contentRegEx = new RegExp("--"+boundary+"([\\s\\S]*?)--"+boundary+"--","img");
            var containerContents = contentRegEx.exec(aContainerStr)[0];

            //console.log(RegExp);

            //console.log(containerContents);

            // RegEx below determines where the next part ends
            var boundaryRegEx = new RegExp("^([\\s\\S]+?)--" + boundary, "m");
            var contents = [];
            // as long as there are more parts


            //console.log(boundaryRegEx.test(containerContents));

            while(boundaryRegEx.test(containerContents)){
                // fetch next part, remove it from the remaining contents to be handled
                var nextPart = boundaryRegEx.exec(containerContents)[1];
                // + 4 is for the two dashes preceding the boundary value and \r\n
                //console.log(nextPart);

                containerContents =
                    containerContents.substring(nextPart.length + boundary.length + 3);
                // is the current next part is of type multipart, we have a container

                //console.log(containerContents);

                if ((/^Content-Type: multipart\/(.+);/i).test(nextPart)) {
                    console.log('kkk');
                    contents.push(app.mailParser.parseMimeContainer(nextPart));
                }else{
                   console.log('lll');
                    contents.push(app.mailParser.parseMimeFragment(nextPart));
                }

            }

            result["contents"] = contents;
            //console.log(result);
            return result;

        },

        readEmail:function(text,callback){
          //  console.log(text);
            var bodyLines = text;

            if(text.length!=0){

                //var matches = text.split("\n");
                //console.log(matches);

                if ((/^Content-Type: (.+)$/im).test(bodyLines)){
                    var contentType =
                        (/^Content-Type: (.+)$/im).exec(bodyLines)[1];

                    // check whether body is multipart (grouping not further used here)
                    var mpRegEx = /^multipart\/(.+);/i;
                    // if multipart then the body is a container otherwise a fragment
                    var parsedBody;


                    if (mpRegEx.test(contentType)) {
                        console.log('MimeContainer');
                        parsedBody = app.mailParser.parseMimeContainer(bodyLines);
                    }else {
                        console.log('imeFragment');
                        parsedBody =app.mailParser.parseMimeFragment(bodyLines);
                    }
                    callback(parsedBody);
                }else{
                    callback(false);
                }

                //console.log(parsedBody);

            }else{
                callback(false);
            }

        }

	});

	return mailParser;
});