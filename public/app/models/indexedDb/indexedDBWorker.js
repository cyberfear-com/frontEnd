/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
	"app"
], function(app){

	var IndexedDbWorker = Backbone.Model.extend({
		initialize: function(){
			//app.indexedDBWorker
			// this.bind("change:EncryptedUserObject", this.uptdUserObj);
			this.set({"name": 'cyberF'});
			this.set({"indexedDB_supported": this.ifSupport()});
			this.set({"allowedToUse": false});
			this.set({"handler": {}});
			//this.openDb();

		},

		ifSupport:function() {

			window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

			if (!window.indexedDB) {
				return false;
			}else
				return true;
		},

		openDb: function() {

			if(this.get('indexedDB_supported') && this.get('allowedToUse')){
				window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
				window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
				window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

				//todo make sure absent bucket not causing error
				var request = window.indexedDB.open(this.get('name'), 2);

				request.onerror = function(event) {
					app.indexedDBWorker.set({"allowedToUse":false});
				};

				request.onsuccess = function(event) {
					//console.log(parseInt(event.target.result.version));

					app.indexedDBWorker.set({"handler":event.target});
				};

				request.onupgradeneeded = function(event) {
					var db = event.target.result;

					//var objectStore = db.createObjectStore("usersBucket", { keyPath: "object_name" });
				//	objectStore.createIndex("nonce", "nonce", { unique: false });
				//	objectStore.createIndex("hash", "hash", { unique: false });


					if(!db.objectStoreNames.contains("usersBucket")) {

						var objectStore = db.createObjectStore("usersBucket", { keyPath: "object_name" });
						objectStore.createIndex("nonce", "nonce", { unique: false });
						objectStore.createIndex("hash", "hash", { unique: false });

					}



				};


			}

		},
		addData: function(value) {


				var db = this.get('handler').result;
				var transaction = db.transaction(["usersBucket"], "readwrite");


				// Do something when all the data is added to the database.
				transaction.oncomplete = function(event) {
					alert("All done!");
				};

				transaction.onerror = function(event) {
					alert("Error1");
				};

				var objectStore = transaction.objectStore("usersBucket");

				var request = objectStore.add(value);
					//request.onsuccess = function(event) {

					//};



		//	});
			//console.log(this.get('handler'));
		//	console.log(this.handler);
		},
		showRecord: function(key,success,error) {

			var db = this.get('handler').result;

			var transaction = db.transaction(["usersBucket"]);
			var objectStore = transaction.objectStore("usersBucket");
			var request = objectStore.get(key);
			request.onerror = function(event) {
				error();
				// Handle errors!
			};
			request.onsuccess = function(event) {
				success(request.result);
				// Do something with the request.result!
				//console.log(request.result);
			};

		},
		deleteRecord: function(key) {

			var db = this.get('handler').result;

			var request = db.transaction(["usersBucket"], "readwrite")
				.objectStore("usersBucket")
				.delete('userProfile');
			request.onsuccess = function(event) {
				// It's gone!
			};

		},
		deleteStore: function(key) {

			var db = this.get('handler').result;
			db.close();

			var request = window.indexedDB.open(this.get('name'), 3);

			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				//this.model.set({handler:event.target.result});
				//console.log(this.handler);

				db.deleteObjectStore("usersBucket");
				alert('objectStore deleted');

			};



		}
	//	if (!window.indexedDB) {
		//console.info('Indexed Database API not supported on this browser');
	//}

	//}
	});

	return IndexedDbWorker;
});
