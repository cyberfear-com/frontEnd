define([
    "app"
], function(app){

    var defaultSettings = Backbone.Model.extend({
        initialize: function(){
            this.set({"userName":""})
            this.set({"firstPassfield":""});
            this.set({"secondPassfield":""});


            this.set({"dev":false});
            this.set({'defaultPage':'mail/Inbox'});

            this.set({'domain':'https://mailum.com'});
            this.set({'apidomain':'https://mailum.com/api'});
            this.set({"defLogDomain":"@cyberfear.com"});

            this.set({"domainMail":"@mailum.com"});
            this.set({"hashToken":"cyberFear"});
            this.set({'domainVPS':'https://attachhost.com'});
            this.set({'name':'Mailum.com'});
            this.set({"perfectMecrh":"U22716410"});
            this.set({"coinMecrh":"5f45af3e16a28a399b1ff2c7da393c9a"});
            //this.set({"stripeKey":"pk_live_51JCndgEhlFLLeix2okFIvfGygQLAfIMQHqq3xfO6V63Z0QPjAcxSiZKeVkdFcAkPGUONI4g0HcLchS5bE5jb4MGN00WbsDYIqR"}); //old
            this.set({"stripeKey":"pk_test_51PlGhbKMl0SJBybZrFLXMlZvbyD06OB0UrVHYMEjzZLxjvBKBmZ8pTFhHE9KNNF4Xm5YbpleCvXJOaQaCvFGxo2s0056PPnnzK"});
        }

    });

    return defaultSettings;
});
