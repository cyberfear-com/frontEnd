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

            this.set({'domain':'http://cyberfear.com'});
            this.set({'apidomain':'https://cyberfear.com/api'});
            this.set({"domainMail":"@cyberfear.com"});
            this.set({"hashToken":"cyberFear"});
            this.set({'name':'CyberFear.com'});
            this.set({"perfectMecrh":"U22716410"});
            this.set({"coinMecrh":"5f45af3e16a28a399b1ff2c7da393c9a"});
        }

    });

    return defaultSettings;
});
