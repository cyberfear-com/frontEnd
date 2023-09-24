define([
    "app"
], function(app){

    var defaultSettings = Backbone.Model.extend({
        initialize: function(){
            this.set({"userName":"111"})
            this.set({"firstPassfield":"111111"});
            this.set({"secondPassfield":'111111'});

         /*   this.set({"userName":"sergei"})
            this.set({"firstPassfield":"61Saksak!!631ee!!"});
            this.set({"secondPassfield":'êX©½¯ìÁCà/1Ó±{:°Ò\\üJø*ÕnêØÇú¢ÃÊ¯¸Ðåh0ÏÌè®Ñ×df®@ã{ó(BÛR~üïu9VTZwn'});*/


            this.set({"dev":true});
            //this.set({'defaultPage':'settings/Plan'});
            this.set({'defaultPage':'mail/Inbox'});

            this.set({'domain':'https://mailum.com'});
            this.set({'apidomain':'https://cyber.com/api'});
            this.set({"defLogDomain":"@cyberfear.com"});
            this.set({"domainMail":"@cyberfear.com"});
            this.set({"hashToken":"cyberFear"});
            this.set({'name':'CyberFear.com'});
            this.set({"perfectMecrh":"U22716410"});
            this.set({"coinMecrh":"5f45af3e16a28a399b1ff2c7da393c9a"});
            this.set({"stripeKey":"pk_test_51JCndgEhlFLLeix2t93EKf8aZQ99PCQNs9w5SMLUV9uWoGOAbMK1AiLV6Gad34yZQ56Tr8B7TQncqCrDZzidCqrD00QIxQITUy"}); //test
        }

    });

    return defaultSettings;
});
