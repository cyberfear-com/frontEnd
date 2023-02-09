require.config({
	deps: ["main"],
	paths: {
		jquery: "../js/main/jquery-2.1.3.min",
		backbone: "../js/main/backbone-min",
		underscore: "../js/main/underscore-min",
		react: '../js/main/react-with-addons',
		wow: '../js/Plugins/wow.min',
		smoothscroll: '../js/Plugins/smoothscroll',
		bootstrap: "../js/main/bootstrap",
		validation: "/js/Plugins/jquery.validate.min",
		//md: "/js/main/forge/md",
		//forge: "/js/main/forge.bundle",
		CryptoJS: "/js/main/core",
		//ciphercore: "/js/main/cipher-core-min",
		//x64core: "/js/main/x64-core",
		aes: "/js/main/aes",
		twofish: "/js/main/twofish",
		SmartNotification: "/js/Plugins/SmartNotification",
		dataTable: "/js/Plugins/dataTables/jquery.dataTables",
		dataTableBoot: "/js/Plugins/dataTables/dataTables.bootstrap",
		//sha512:"/js/main/forge/sha512",
		//util:"/js/main/forge/util",
		forge: "/js/main/forge/forge",
		xss: "/js/Plugins/xss/xss",
		ajaxQueue: "/js/Plugins/ajaxqueue/ajaxq",
		summernote: "/js/Plugins/summernote/summernote",
		qrcode: "/js/Plugins/qrcode/qrcode",
		jsui: "/js/Plugins/jquery-ui/jquery-ui.min",
		accounting: "/js/Plugins/accounting/accounting",
		select2: "/js/Plugins/select2/select2.full",
		openpgp: "/js/Plugins/openpgp/openpgp",
		//Elements:"@stripe/react-stripe-js",
		//loadStripe:"/js/Plugins/@stripe/stripe-js/dist/stripe",
		//useEffect:"react"

       // mailreader: "/js/Plugins/mailParser/mailreader",
        //mailparser:"/js/Plugins/mailParser/mailparser"

        //mailreaderParser:"/js/Plugins/mailParser/mailreader-parser",
        //mimeparser:"/js/Plugins/mailParser/mimeparser",
        //stringencoding:"/js/Plugins/mailParser/stringencoding",
       // mimefuncs:"/js/Plugins/mailParser/mimefuncs",
        //addressparser:"/js/Plugins/mailParser/addressparser",
       // mimeparserTzabbr:"/js/Plugins/mailParser/mimeparser-tzabbr"

		//indexeddb:"/js/Plugins/indexedDb/jquery.indexeddb"


	},
	shim: {
		backbone: {
			deps: ["jquery", 'underscore'],
			exports: "Backbone"
		},
		"jquery": {
			"exports": "$"
		},
        "jsui":{
            deps: ["jquery"],
            "exports": "jsui"
        },
		"underscore": {
			"exports": "_"
		},
		wow: {
			deps: ["jquery"],
			exports: "Wow"
		},
		smoothscroll: {
			deps: ["jquery"],
			exports: "SmoothScroll"
		},
		bootstrap: {
			deps: ["jquery"],
			exports: "Bootstrap"
		},
		validation: {
			deps: ["jquery"],
			exports: "Validation"
		},
		//forge: {
		//	exports: "Forge"
		//},
		CryptoJS: {
			exports: "CryptoJS"
		},
		twofish: {
			deps: ["CryptoJS", "aes"],
			exports: "TwoFish"
		},
		aes: {
			deps: ["CryptoJS"],
			exports: "aes"
		},
		SmartNotification: {
			deps: ["jquery"],
			exports: "SmartNotification"
		},
		dataTable: {
			deps: ["jquery"],
			exports: "dataTable"
		},
		dataTableBoot: {
			deps: ["jquery", "dataTable"],
			exports: "dataTableBoot"
		},
		ajaxQueue: {
			deps: ["jquery"],
			exports: "ajaxQueue"
		},
		summernote: {
			deps: ["jquery"],
			exports: "summernote"
		},
		qrcode: {
			deps: ["jquery"],
			exports: "qrcode"
		},
		select2: {
			deps: ["jquery"],
			exports: "select2"
		},

       // mailreader: {
       //     exports: "mailreader"
       //  },

       // Mailreader: {
       //     deps: ["mailreaderParser","mimeparser","stringencoding","mimefuncs","addressparser","mimeparserTzabbr"],
       //     exports: "Mailreader"
       // },
		//xss: {
		//	exports: "xss"
		//},

		//	util:{
		//		exports: "util"
		//	},
		//sha512:{
		//	deps: ["util"],
		//	exports: "sha512"
		//},
		forge: {
			//	//deps: ["sha512"],
			exports: "forge"
		},
		//	indexeddb: {
		//		deps: ["jquery"],
		//		exports: "indexedDb"
		//	}
		//x64core:{
		//	deps: ["CryptoJS"],
		//	exports: "x64-core"
		//},
		/*
		 aes:{
		 deps: ["CryptoJS"],
		 exports: "aes"
		 },

		 ciphercore: {
		 deps: ["CryptoJS"],
		 exports: "cipher-core"
		 }
		 */
	},
    urlArgs:"bust=" +  62
});

require(['app', 'cmpld/router',
		'models/ApiCalls',
		//'models/splashValidate',
		'models/GlobalFunctions',
		'models/SystemNotification',
		'models/EncodingDecodingFunctions',
		'models/generateUserFunctions',

		'models/userBasicF/userLogin',
		'models/variable/userData',
		'models/variable/appData',
		'models/indexedDb/indexedDBWorker',
		'models/updates/versioning',
		'models/userBasicF/userObjectsWorker',
		'models/userBasicF/stripeCheckOut',
		'models/mixins/mixins',
		'models/variable/defaultSettings',
        'models/mailMan',
        'models/userBasicF/mailParser',
        'cmpld/unregistered/Body/unregFunctions',
        'models/userBasicF/layoutFunct'


	],
	function (app, Router,
			  ApiCalls,
			  //SpValidation,
			  GlobalFunctions, SystemNotification,
			  EncodingDecodingFunctions,
			  GenerateFunctions,
			  UserLogin,
			  UserData,
			  AppData,
			  IndexedDBWorker,
			  Versioning,
			  UserObjectsWorker,
			  StripeCheckOut,
			  Mixins,
			  defaultSettings,
              fetchingEmails,
              mailParser,
              unregFunctions,
              layoutFunct
        ) {
		"use strict";

		//'/app/models/SessionModel.js'
		//Backbone.emulateHTTP = true;

		//Footer = Backbone.Model.extend({
		//	defaults: {
		//		terms: 'ttt',
		//		privacy: null,
		//		report: null,
		//		canary: "Error!"
		//	}
		//});

		app.router = new Router();

		//app.validation=new SpValidation();


		//=====================
		//global variable initialization
		app.user = new UserData();
		app.sessionData = new AppData();


		//====================
		//global function initialization
		app.notifications = new SystemNotification();
		app.transform = new EncodingDecodingFunctions();
		app.generate = new GenerateFunctions();
		app.serverCall = new ApiCalls();

		app.globalF = new GlobalFunctions();
		app.auth = new UserLogin();
		app.indexedDBWorker = new IndexedDBWorker();
		app.userObjects = new UserObjectsWorker();
		app.stripeCheckOut=new StripeCheckOut();

		app.versioning = new Versioning();
		app.mixins = new Mixins();
		app.defaults = new defaultSettings();
        app.mailMan = new fetchingEmails();

        app.mailParser = new mailParser();
        app.unregF = new unregFunctions();

        app.layout= new layoutFunct();



		// Create a new session model and scope it to the app global
		// This will be a singleton, which other modules can access
		//app.session = new SessionModel({});

		// Check the auth status upon initialization,
		// before rendering anything or matching routes
		/*

		 app.session.checkAuth({
		 // Start the backbone routing once we have captured a user's auth status
		 complete: function(){
		 //	console.log(app.session);
		 // HTML5 pushState for URLs without hashbangs
		 //var hasPushstate = !!(window.history && history.pushState);
		 //if(hasPushstate) Backbone.history.start({ pushState: true, root: '/' });
		 //else Backbone.history.start();
		 }
		 });
		 */
		app.restartApp = function () {
			window.location.href = '';
		};

		app.run();

		if(document.domain=='cyberfe3gvh7cvq2nhuqtaghjxebhcnqafnfvalwvq6mxrinep7m7xqd.onion'){
			app.defaults.set({'apidomain':'http://cyberfe3gvh7cvq2nhuqtaghjxebhcnqafnfvalwvq6mxrinep7m7xqd.onion/api'});
		}

		//var person = new Person;
	});
