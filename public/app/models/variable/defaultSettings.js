define([
    "app"
], function(app){

    var defaultSettings = Backbone.Model.extend({
        initialize: function(){
            this.set({"userName":"111"})
            this.set({"firstPassfield":"111111"});
            this.set({"secondPassfield":"111111"});


            this.set({"dev":false});
            this.set({'defaultPage':'mail/Inbox'});

            this.set({'domain':'https://cyberfear.com'});
            this.set({'apidomain':'https://cyber.com/api'});
            this.set({"domainMail":"@cyberfear.com"});
            this.set({"hashToken":"cyberFear"});
            this.set({'name':'CyberFear.com'});
            this.set({"perfectMecrh":"U22716410"});
            this.set({"coinMecrh":"5f45af3e16a28a399b1ff2c7da393c9a"});
        }

    });

    return defaultSettings;
});
