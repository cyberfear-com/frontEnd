/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var UserData = Backbone.Model.extend({
		initialize: function(){
			//app.user
			//User main Data
			this.set({"userId": ""});
			this.set({"username": ''});
			this.set({"firstTime": false});
			this.set({"firstTimeCacel": false});
			this.set({"displayName": ''});
			this.set({"loginEmail": ''}); // email used for login
			this.set({"cacheEmId": ''});  // first 10 char of hash 256 email for cache obj
			this.set({"email": ''});	 // def email from profile
			this.set({"oneStep": false});   //two or one password
			this.set({"profileVersion": ''}); //profile version from mysql column, should be equal to profile part
			this.set({"password": ''});      //pass for login
			this.set({"secondPassword": ''});  //pas to encrypt data
			this.set({"defaultPGPKeybit": ''});
            this.set({"currentVersion": 937});
            this.set({"pleaseUpdate": false});
			this.set({"tempCoin": false});


            this.set({"balanceShort": false});
            this.set({"folderCached": {}});

			this.set({"stipeLoaded": false});

            this.set({"rememberContacts": true});

            this.set({"pastDue": false});

			//this.set({"secondPassChanged": false});

			//user Status Data
			this.set({"userLogedIn": false});
			this.set({"userLoginToken": ''}); //temp token for session, enforce single device and single tab. send with each call if return false, should relogin

			//user Variables From Decrypted Objects
			this.set({"folderKey": ''}); //key to encrypt every object except userobj


			//user WholeDecryptedObjects
			this.set({"DecryptedProfileObject": {}}); //decrypted version of profile
			this.set({"DecryptedUserObject": {}}); //decr userOb
			this.set({"DecryptedFolderObject": {}}); // -- folder obj
			this.set({"DecryptedContactsObject": {}}); // contact obj
			this.set({"DecryptedBlackListObject": {}}); //sam list obj


			this.set({"salt": ''});  // account salt used to add randomness for some RNG
			this.set({"modKey": ''}); // key send with each Object update to ensure user know decrypting password

			//session related data
			this.set({"fontSize": ''});
			this.set({"fontType": ''});


			//Acc Setting Part

            this.set({"emailsPerBlock": 300});


			this.set({"mailPerPage": 50});
			this.set({"sessionExpiration": -1});
			this.set({"remeberPassword": false});
			this.set({"loading": {}});

			this.set({"enableForwarding": false});
			this.set({"forwardingAddress": ''});
			this.set({"notificationSound": ''});
			this.set({"enableNotification": false});
			this.set({"notificationAddress": ''});

			this.set({"emailListRefresh": false});

			this.set({"systemFolders":{
				'inboxFolderId':"",
				'spamFolderId':"",
				'draftFolderId':"",
				'sentFolderId':"",
				'trashFolderId':""
			}});



			//Inb Layout
			this.set({"inboxLayout": '3cols'});


			//pass 2fac
			this.set({"Factor2":{
				'type':'',
				'secret':'',
				'since':''
			}});

            this.set({"defaultSentEmail": ""});

			this.set({"Fac2Changed": false});

            this.set({"contactsChanged": false});

			this.set({"showDisplayName": false});

			this.set({"filter": {}}); //flat list filtering rules
			this.set({"contacts": {}}); //flatten contact list

			this.set({"tags": {}}); //flatten tag list
			this.set({"tagsChanged": false});
			//this.set({"sessionExpiration": ''});
			//this.set({"sessionExpiration": ''});

			this.set({"allKeys": {}});
			this.set({"pgpKeysChanged":false});
            this.set({"getPlan":false}); //getting plan  with interval.


            this.set({"selectedEmails":{}});

            this.set({"checkNewEmails":false});


			//this.set({"emailAliases": {}});
			//this.set({"disposableEmails": {}});
			this.set({"customDomainChanged": false});
			this.set({"customDomains": {}});


			this.set({"inProcess": false});

			this.set({"uploadInProgress": false});

			this.set({"folders": {}});

			this.set({"oldUnopenedEmails": {}});

            this.set({"unopenedEmails": {}});
            this.set({"emailOpenTimeOut": {}});

            this.set({"emailReplyState": ''});

			this.set({"emails": {}});
			this.set({"emailsChanged": false});
			this.set({"noServer": true});
			this.set({"userPlan": {}});


			this.set({messageVId:""});
			this.set({
				currentMessageView:{
					'id':'',
					'version':"",
					'attachment':{},
					'body':{
						'html':'',
						'text':''
					},
					'meta':{
						'attachment':'',
						'body':'',
						'from':'',
						'modKey':'',
						'opened':'',
						'pin':'',
						'status':'',
						'subject':'',
						'timeSent':''
					}
				}
			});
			//app.globalF.resetCurrentMessage(); //example

			this.set({
				draftMessageView:{
					'messageId':"",
					'meta':{
						'to':{},//["de17952f10164fc0864d0075994d40292e1dccd0","b9f2ef3ee4f874ce8f9bdea362be21f43c6453d6",'22332'],
						'toCC':{},//["de17952f10164fc0864d0075994d40292e1dccd0",'22332'],
						'toBCC':{},//["de17952f10164fc0864d0075994d40292e1dccd0","b9f2ef3ee4f874ce8f9bdea362be21f43c6453d6"],
						'from':"",
						'attachment':'',

						'subject':'',
						'body':'',
						'opened':'',
						'pin':'',
						'pinEnabled':'',
						'status':'',

						'timeSent':'',
						'type':'',
						'version':"",
						'signatureOn':false
					},
					'body':{
						'html':'',
						'text':''
					},
					'attachment':{},
					'modKey':""
				}
			});
		//	this.set({
		//		recipientList:{}
		//	});

			//app.globalF.resetDraftMessage(); //example

			this.set({
				trustedSenders:[]
			});

			//this.createTestData(); //todo remove for dev

		},
		assignUservariables: function (callback){


			this.set({"username":this.get('loginEmail')});

			this.assignVariablesFromProfileObject();
			this.assignVariablesFromUserObject();
			this.assignVariablesFromFolderObject();

			var filter = JSON.parse(JSON.stringify(this.get("DecryptedBlackListObject")[0]['data']));

			this.set({"filter":filter});


			this.set({"contacts": this.get("DecryptedContactsObject")[0]['data']})

			callback();
		},

		assignVariablesFromUserObject:function (){
			//var emAl={};
			//var emDispos={};

			var allKeys={};
			//console.log(app.user.get("DecryptedUserObject")[0]['data']['keys']);
			$.each(app.user.get("DecryptedUserObject")[0]['data']['keys'], function( email64, emailData ) {

				allKeys[email64]=jQuery.extend(true, {}, emailData);


				//if(emailData['addrType']==1 && emailData['isDefault']===true){
                    //app.user.set({"defaultSentEmail": emailData['email']});
					//app.user.set({"defaultPGPKeybit": emailData['keyLength']});
				//}else if(emailData['isDefault']===true){
                   // app.user.set({"defaultSentEmail": emailData['email']});
                //}
				//}else if(emailData['addrType']==2){
				//	emDispos[email64]=emailData;

				//}else if(emailData['addrType']==3){
				//	emAl[email64]=emailData;
				//}
			});
			//this.set({"emailAliases": emAl});
			//this.set({"disposableEmails": emDispos});
			this.set({"allKeys": allKeys});


		},
		assignVariablesFromFolderObject:function (){

			//var folders={};
			//console.log(this.get("DecryptedFolderObject"));

			var folders=jQuery.extend(true, {}, this.get("DecryptedFolderObject")[0]['data']);


			var emails={'messages':{},'folders':{}};

			$.each(this.get("DecryptedFolderObject"), function( index, data ) {
				if(index>0){

					$.each(data['data'], function( emailId, emailData ) {

						emails['messages'][emailId]=emailData;
						if(emails['folders'][emailData['f']]==undefined){
							emails['folders'][emailData['f']]={};
						}
						emails['folders'][emailData['f']][emailId]=emailData;

					});

				}else{
					$.each(data['data'], function( emailId, emailData ) {
						emails['folders'][emailId]={};
					//	console.log(emailId);
					});


				}
			});
			var inbox="";
			var spam="";
			var trash="";
			var sent="";
			var draft="";
			$.each(folders, function( index, fData ) {
				if(fData['role']!=undefined){
					if(app.transform.from64str(fData['role'])=="Inbox"){
						inbox= index;
					}
					if(app.transform.from64str(fData['role'])=="Spam"){
						spam=index;
					}
					if(app.transform.from64str(fData['role'])=="Trash"){
						trash=index;
					}
					if(app.transform.from64str(fData['role'])=="Draft"){
						draft= index;
					}
					if(app.transform.from64str(fData['role'])=="Sent"){
						sent= index;
					}
				}
			});

			this.set({"systemFolders":{
				'inboxFolderId':inbox,
				'spamFolderId':spam,
				'draftFolderId':draft,
				'sentFolderId':sent,
				'trashFolderId':trash
			}});


			//delete emails['messages'][79];
			//work with emails update open or not link, add or delete have to parse decrypted object in loop

			this.set({"emails": emails});
			this.set({"folders": folders});

            //app.globalF.countEmailsSize();
		},

		createTestData:function (){
			var testEnv=true;
			if(testEnv){
				var allKeys={};

					allKeys['c2VyZ0BzY3J5cHRtYWlsLmNvbQ==']={
						'addrType': 3,
						'canSend': false,
						'date': 1437155609,
						'email': "c2VyZ0BzY3J5cHRtYWlsLmNvbQ==",
						'includeSignature': true,
						'keyLength': "",
						'keysModified': 1437155609,
						'name': "dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==dGVzdA==",
						'privateKey': "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQ0KTUlJRW9nSUJBQUtDQVFFQTRzZWhtTm9tR1dHc2F4OXR6MGkzUFpxOTAzMDhjZ00zbW5IZDFZOHVzRmE2ZjlMZA0KTjV3YkRMMDBuTFVvb2RMdEg5USt0bERjSUpWdXFNQ2tNRzVXYW9weHljSExNS09WWEkrUmhCS3RGd0VYajduaw0KbHQ0NXpKWjhzaFB6ZHdibHM3bWhHZVpJazEyazNXZUtvbEhyZHhzak1peXpxNXgvYmJnSUdTWUZPUG1WREY5Tg0KZGZqdEZ3REZHUjZ1ZmhVUVlMOEo2clMyYWZqd3BmN2RxL0thVE0vcVJzOHk4M01VVGtnWDczakxHMHVXK3F4RQ0Kam9oQ05kMnhzaEFhUVNtNXpEemlSc0lVaEJBa0dzdVljb1dXeU92NGhxazZWTmFSenVaUllvaVRwTEpOZ0s3SQ0KY1VHejFVZXFndTl2Vkd6eUVOcCszVjVSRUpLTzloanBaUTRBendJREFRQUJBb0lCQUduL05TRGtsZm8zRlFmYw0KNE02S0JsdmMvK3ppRkdhVjZsOWQ2WG53T3JwaFR6cC9yTFpaV0t0VHBFdTZ3UXNpTTRNMUNUcmVBSVdhVXVhOQ0KWkFEZkViVXFrSlRrNTd3TU9idlJ2d29rVUpMNEI3TStDQUljVEplN252ejlKa2IwQ2xrKzRuWGdsUHVNUVlyYQ0KNG9tTUVLclRIRmhQWEl0UjBwM043cnNTY2s1Mk9FaUpaR2lXdmgxaGpCU2sxUlJhdE1KYW5DejFJb09rd29LOA0KTmE2R0llWFFiTU5qWWlVSTdwU1FxZzdFNVZDczU5WHIvOC9NcGhGbHpRL1FsZlBPMlE1OVJGYlJNeVBhM3RTaA0KcEM5NnVFVU1vYmg3OGFuL29FUTNqQnJqcmhNQ1pjVHJhaGpXNDlROERDa2Q1Q25QQ0wrc0JmWVZxMGFNNUJSbQ0KN0VEUlhFRUNnWUVBOTdYSWp0TTBMTzR4eG9nNFhaY2gzNXFqdFRndGtycTBCWEJteUU1Z05kakVvelUwUlY4MQ0KYjIrR05GMng4c3AxZGNRTUxiY0pDUlJIaGYyZWp1S28wTm94Yk80QWp6RGZCTnJyU3c2SG4xYnJlM25DSGl3eg0KL0lWUWlhWm1IemM2eE5lbFp6bHZzVEs0ZzljWjM1WThJQnJNd3gzMjExL3p3NFZxRmFaWXh4VUNnWUVBNmw2SA0KN1h5aUQrTUM3bFduMnllcnBKaklQUWgvSHU1anNHRGNyUzE0Qy9lSTRmS0QwTk9ZdmRSRVZ6MGtuT1l0MStuRg0KOHl5ME1WTTYydlhJbk1oTXlXa2lHWVFxMzNsempvRjF5bGJVaEVBbXp2bk5CSEQzQVpES1pSbEZGRXZtY2U4cA0KTm1Tc2g5dDAzMXQwR3VDWWtBeSszRW85QWxBVFg1Wk1pa1VjNFZNQ2dZQUZ2c0dZRG0zM1hNN3F1OTRTelo2TA0KZ1JxcTZWS2xSSTlJVVFNUlFrQVkvNTRQNnZ2N1grbnRXN2pSSGhzeWRsK2pDNWo4dG5JUE05azAwbDBMRTFhMw0KQVZpRUhrRUZFUzBhLzdqVlZORHdjU09sQ1gzbkZUOWZhL2dpT1NuRkw1SzlYZ01JRWR6MVR5ZlladlRDcXNsYQ0KTlVUcWdaZG9CMkd2OXpndXFGMEd3UUtCZ0NFN3FGQ2ZwS2RXREZ0WllBVHVlaU5MMnREMHZIblpXZDl2ekxydA0Kd0tFSng2b3FabENkUUlKaWNCSml4Q2RQYUY2K2NtaEtCWDhkQ3pKek9iQXBvdUhJZTZKY29HdXg0QlhyKzVUbQ0KZlJvSHNya1VxT0toVmhVdHY5VllJUGlBenJ1SEt6UGdVS3F2RHNLQlNGUnJWcGJPaDkzYTFRM1g1dmRkNjVxTA0KdEUyckFvR0FNUFJtL1hlWUVFMEQyTHVOUzl6VC9mWTAybWV2ZjVHTTl4RmdFV3dTeWJrbWtlZkNWZE5QeUcrNA0KMStuQVJEU1JVYjJmTUxpTDFtcGJwQTdPazhqbU8vYzYyN2p0cm9qb21hVzkzRkdtNGttZTlqTzIrZGtMd1BsbA0KOUhsNWpzUHZ1UGpXL0oyN05Td2lYK1o1Yk0rR09NVi9mQkJOTEQ5THk4MVpDUEJ2dnRRPQ0KLS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS0NCg==",
						'publicKey': "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBNHNlaG1Ob21HV0dzYXg5dHowaTMNClBacTkwMzA4Y2dNM21uSGQxWTh1c0ZhNmY5TGRONXdiREwwMG5MVW9vZEx0SDlRK3RsRGNJSlZ1cU1Da01HNVcNCmFvcHh5Y0hMTUtPVlhJK1JoQkt0RndFWGo3bmtsdDQ1ekpaOHNoUHpkd2JsczdtaEdlWklrMTJrM1dlS29sSHINCmR4c2pNaXl6cTV4L2JiZ0lHU1lGT1BtVkRGOU5kZmp0RndERkdSNnVmaFVRWUw4SjZyUzJhZmp3cGY3ZHEvS2ENClRNL3FSczh5ODNNVVRrZ1g3M2pMRzB1VytxeEVqb2hDTmQyeHNoQWFRU201ekR6aVJzSVVoQkFrR3N1WWNvV1cNCnlPdjRocWs2Vk5hUnp1WlJZb2lUcExKTmdLN0ljVUd6MVVlcWd1OXZWR3p5RU5wKzNWNVJFSktPOWhqcFpRNEENCnp3SURBUUFCDQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0NCg==",
						'receiveHash': "08e4641886",
						signature: "aGpqampqampqampqamo="
					};

				allKeys['dXJ4bzU0ZzBoYm11dzVndnBkMHIzZHYxaDN2QHNjcnlwdG1haWwuY29t']={
					'addrType': 2,
					'canSend': false,
					'date': 1437155609,
					'email': "dXJ4bzU0ZzBoYm11dzVndnBkMHIzZHYxaDN2QHNjcnlwdG1haWwuY29t",
					'includeSignature': false,
					'keyLength': "",
					'keysModified': 1437155609,
					'name': "dGVzdA==",
					'privateKey': "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQ0KTUlJRW9nSUJBQUtDQVFFQTRzZWhtTm9tR1dHc2F4OXR6MGkzUFpxOTAzMDhjZ00zbW5IZDFZOHVzRmE2ZjlMZA0KTjV3YkRMMDBuTFVvb2RMdEg5USt0bERjSUpWdXFNQ2tNRzVXYW9weHljSExNS09WWEkrUmhCS3RGd0VYajduaw0KbHQ0NXpKWjhzaFB6ZHdibHM3bWhHZVpJazEyazNXZUtvbEhyZHhzak1peXpxNXgvYmJnSUdTWUZPUG1WREY5Tg0KZGZqdEZ3REZHUjZ1ZmhVUVlMOEo2clMyYWZqd3BmN2RxL0thVE0vcVJzOHk4M01VVGtnWDczakxHMHVXK3F4RQ0Kam9oQ05kMnhzaEFhUVNtNXpEemlSc0lVaEJBa0dzdVljb1dXeU92NGhxazZWTmFSenVaUllvaVRwTEpOZ0s3SQ0KY1VHejFVZXFndTl2Vkd6eUVOcCszVjVSRUpLTzloanBaUTRBendJREFRQUJBb0lCQUduL05TRGtsZm8zRlFmYw0KNE02S0JsdmMvK3ppRkdhVjZsOWQ2WG53T3JwaFR6cC9yTFpaV0t0VHBFdTZ3UXNpTTRNMUNUcmVBSVdhVXVhOQ0KWkFEZkViVXFrSlRrNTd3TU9idlJ2d29rVUpMNEI3TStDQUljVEplN252ejlKa2IwQ2xrKzRuWGdsUHVNUVlyYQ0KNG9tTUVLclRIRmhQWEl0UjBwM043cnNTY2s1Mk9FaUpaR2lXdmgxaGpCU2sxUlJhdE1KYW5DejFJb09rd29LOA0KTmE2R0llWFFiTU5qWWlVSTdwU1FxZzdFNVZDczU5WHIvOC9NcGhGbHpRL1FsZlBPMlE1OVJGYlJNeVBhM3RTaA0KcEM5NnVFVU1vYmg3OGFuL29FUTNqQnJqcmhNQ1pjVHJhaGpXNDlROERDa2Q1Q25QQ0wrc0JmWVZxMGFNNUJSbQ0KN0VEUlhFRUNnWUVBOTdYSWp0TTBMTzR4eG9nNFhaY2gzNXFqdFRndGtycTBCWEJteUU1Z05kakVvelUwUlY4MQ0KYjIrR05GMng4c3AxZGNRTUxiY0pDUlJIaGYyZWp1S28wTm94Yk80QWp6RGZCTnJyU3c2SG4xYnJlM25DSGl3eg0KL0lWUWlhWm1IemM2eE5lbFp6bHZzVEs0ZzljWjM1WThJQnJNd3gzMjExL3p3NFZxRmFaWXh4VUNnWUVBNmw2SA0KN1h5aUQrTUM3bFduMnllcnBKaklQUWgvSHU1anNHRGNyUzE0Qy9lSTRmS0QwTk9ZdmRSRVZ6MGtuT1l0MStuRg0KOHl5ME1WTTYydlhJbk1oTXlXa2lHWVFxMzNsempvRjF5bGJVaEVBbXp2bk5CSEQzQVpES1pSbEZGRXZtY2U4cA0KTm1Tc2g5dDAzMXQwR3VDWWtBeSszRW85QWxBVFg1Wk1pa1VjNFZNQ2dZQUZ2c0dZRG0zM1hNN3F1OTRTelo2TA0KZ1JxcTZWS2xSSTlJVVFNUlFrQVkvNTRQNnZ2N1grbnRXN2pSSGhzeWRsK2pDNWo4dG5JUE05azAwbDBMRTFhMw0KQVZpRUhrRUZFUzBhLzdqVlZORHdjU09sQ1gzbkZUOWZhL2dpT1NuRkw1SzlYZ01JRWR6MVR5ZlladlRDcXNsYQ0KTlVUcWdaZG9CMkd2OXpndXFGMEd3UUtCZ0NFN3FGQ2ZwS2RXREZ0WllBVHVlaU5MMnREMHZIblpXZDl2ekxydA0Kd0tFSng2b3FabENkUUlKaWNCSml4Q2RQYUY2K2NtaEtCWDhkQ3pKek9iQXBvdUhJZTZKY29HdXg0QlhyKzVUbQ0KZlJvSHNya1VxT0toVmhVdHY5VllJUGlBenJ1SEt6UGdVS3F2RHNLQlNGUnJWcGJPaDkzYTFRM1g1dmRkNjVxTA0KdEUyckFvR0FNUFJtL1hlWUVFMEQyTHVOUzl6VC9mWTAybWV2ZjVHTTl4RmdFV3dTeWJrbWtlZkNWZE5QeUcrNA0KMStuQVJEU1JVYjJmTUxpTDFtcGJwQTdPazhqbU8vYzYyN2p0cm9qb21hVzkzRkdtNGttZTlqTzIrZGtMd1BsbA0KOUhsNWpzUHZ1UGpXL0oyN05Td2lYK1o1Yk0rR09NVi9mQkJOTEQ5THk4MVpDUEJ2dnRRPQ0KLS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS0NCg==",
					'publicKey': "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBNHNlaG1Ob21HV0dzYXg5dHowaTMNClBacTkwMzA4Y2dNM21uSGQxWTh1c0ZhNmY5TGRONXdiREwwMG5MVW9vZEx0SDlRK3RsRGNJSlZ1cU1Da01HNVcNCmFvcHh5Y0hMTUtPVlhJK1JoQkt0RndFWGo3bmtsdDQ1ekpaOHNoUHpkd2JsczdtaEdlWklrMTJrM1dlS29sSHINCmR4c2pNaXl6cTV4L2JiZ0lHU1lGT1BtVkRGOU5kZmp0RndERkdSNnVmaFVRWUw4SjZyUzJhZmp3cGY3ZHEvS2ENClRNL3FSczh5ODNNVVRrZ1g3M2pMRzB1VytxeEVqb2hDTmQyeHNoQWFRU201ekR6aVJzSVVoQkFrR3N1WWNvV1cNCnlPdjRocWs2Vk5hUnp1WlJZb2lUcExKTmdLN0ljVUd6MVVlcWd1OXZWR3p5RU5wKzNWNVJFSktPOWhqcFpRNEENCnp3SURBUUFCDQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0NCg==",
					'receiveHash': "08e4641886",
					signature: ""
				};



				this.set({"allKeys": allKeys});

				var folders={};

				folders['a7660fcafc']={
					'exp': "1",
					'isMain': false,
					'name': "YWFh"
				};

				this.set({"folders": folders});

				var tags={};

				tags['dmdnaG5oag==']={
					'color': ""
				};

				this.set({"tags": tags});

				var filter=[];
				var spamEl={
					'field':"sender",
					'match':"contain",
					'to':'a7660fcafc',
					'text':"ZGZnZGZn"
				};

				filter.push(spamEl);

				this.set({"filter": filter});
			}

		},
		startTimer:function(){
			var sessionExpire=this.get("sessionExpiration");
			this.set({"timeLeft":sessionExpire});
			var thisComp=this;

			clearInterval(this.get('sessionExpirationFunction'));

			if(sessionExpire!=-1){

				var secs = thisComp.get("timeLeft");

				var timer = setInterval(function () {

					thisComp.set({"timeLeft":thisComp.get("timeLeft")-1});

					if (thisComp.get("timeLeft") < 0) {
                        app.restartApp();
						//todo ask for pass and logout if not
						//resetGlobal();
						//initialFunction();
						//unbindElement();
						//window.location='/logout';
						//console.log('bye bye');
						//logOutTime();
					}
					//console.log(thisComp.get("timeLeft"));
				}, 1000);

				this.set({"sessionExpirationFunction":timer});
			}

		},

		assignVariablesFromProfileObject:function (){
			var thisComp=this;

			this.set({"displayName": 		app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['displayName'])});
			if(this.get("DecryptedProfileObject")[0]['data']['email']==undefined){
                this.set({"email": 				this.get('loginEmail')});
                var temp=this.get("DecryptedProfileObject")[0]['data'];
                temp['email']=app.transform.to64str(this.get('loginEmail'));
            }else{
                this.set({"email": 				app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['email'])});
            }


			this.set({"defaultPGPKeybit": parseInt(this.get("DecryptedProfileObject")[0]['data']['defaultPGPKeybit'])});

			//this.set({"fontSize": 			this.get("DecryptedProfileObject")[0]['data']['fontSize']});
			//this.set({"fontType": 			this.get("DecryptedProfileObject")[0]['data']['fontType']});
			this.set({"mailPerPage": 		this.get("DecryptedProfileObject")[0]['data']['mailPerPage']});
			this.set({"sessionExpiration": 	this.get("DecryptedProfileObject")[0]['data']['sessionExpiration']});
			//this.set({"sessionExpirationFunction":});
			this.set({"timeLeft": ""});
			this.set({"remeberPassword": 	this.get("DecryptedProfileObject")[0]['data']['remeberPassword']});

			//console.log(this.get("DecryptedProfileObject")[0]['data']);
			this.set({"Factor2":{
				'type':this.get("DecryptedProfileObject")[0]['data']['Factor2']['type'],
				'secret':app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['Factor2']['secret']),
				'since':this.get("DecryptedProfileObject")[0]['data']['Factor2']['since']
			}});

			//this.set({"Factor2":{
			//	'type':'google',
			//	'secret':'T366-POZK-32SO-GWDD-LY2Q-J2FX',
			//	'since':'06/11/2015'
			//}});

/*

			this.set({"factor2Auth": this.get("DecryptedProfileObject")[0]['data']['factor2Auth']});
			this.set({"Fac2Enabled": app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['Fac2Enabled'])});

			this.set({"qrsecret": app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['qrsecret'])});

			this.set({"qrsecret": 'T366-POZK-32SO-GWDD-LY2Q-J2FX'});

			this.set({"factor2Auth": 'google'});
			this.set({"Fac2Enabled": '06/11/2015'});
*/


			if(!this.get("remeberPassword")){
				this.set({"secondPassword": ''});
			}



			this.set({"showDisplayName": 	this.get("DecryptedProfileObject")[0]['data']['showDisplayName']});

			this.set({"enableForwarding": 	this.get("DecryptedProfileObject")[0]['data']['enableForwarding']});
			this.set({"forwardingAddress": 	app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['forwardingAddress'])});
			this.set({"notificationSound": 	app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['notificationSound'])});
			this.set({"enableNotification": this.get("DecryptedProfileObject")[0]['data']['enableNotification']});
			this.set({"notificationAddress":app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['notificationAddress'])});

			this.set({"inboxLayout":app.transform.from64str(this.get("DecryptedProfileObject")[0]['data']['inboxLayout'])});


            if(this.get("DecryptedProfileObject")[0]['data']['rememberContacts']!==undefined){
                this.set({"rememberContacts":this.get("DecryptedProfileObject")[0]['data']['rememberContacts']});
            }

			var tags={};
			$.each(this.get("DecryptedProfileObject")[0]['data']['tags'], function( name, hren ) {
				tags[name]={'color':hren['color']};
//console.log(app.transform.from64str(name));
				//console.log(app.transform.from64str(hren['name']));
			});
			this.set({"tags": tags}); //flatten tag list


			this.set({"customDomains": this.get("DecryptedProfileObject")[0]['data']['customDomains']});

			this.startTimer();

			app.user.on("change:sessionExpiration",function() {
				thisComp.startTimer();
			});
		}

	});

	return UserData;
});
