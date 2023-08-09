define(["app", "SmartNotification"], function (app, SmartNotification) {
    var SystemNotification = Backbone.Model.extend({
        //app.notifications.systemMessage('tryAgain');
        systemMessage: function (messageCode, option) {
            switch (messageCode) {
                //Login part
                case "emNotValid":
                    this.noAnswer("Invalid Email Address");
                    break;
                case "wrngPass":
                    this.noAnswer("Wrong Password");
                    break;

                case "wrngSecPass":
                    this.noAnswer("Wrong Second Password");
                    break;
                case "scrtInvld2FacGoogle":
                    this.noAnswer("Secret Is Not Correct"); //google 2 fac
                    break;

                case "vrfCodeInvld2FacGoogle":
                    this.noAnswer("Code Is Not Correct"); //google 2 fac
                    break;

                case "chckVrf":
                    this.noAnswer("Please check verification String"); //add custom domain
                    break;
                case "domAlrdExist":
                    this.noAnswer("Domain Already Exist"); //add custom domain
                    break;

                case "selectMsg":
                    this.noAnswer("Please select at least one message"); //
                    break;
                case "upgradePlan":
                    this.noAnswer(
                        "Please upgrade your plan to yearly subscription."
                    ); //
                    break;

                case "rchdLimits":
                    this.noAnswer(
                        "You've reached your plan limit. Please upgrade plan"
                    ); //
                    break;

                case "once5min":
                    this.noAnswer(
                        "Please wait 5 minutes before creating another account"
                    );
                    break;

                case "fnctDisabled":
                    this.noAnswer(
                        "Please enable this function in your plan before selecting."
                    ); //
                    break;

                case "pastDue":
                    this.noAnswer(
                        "Your plan is past due. Please refill your balance to resume normal operation."
                    );
                    break;

                case "MaxFiles":
                    this.noAnswer(
                        "Your file is larger than it is allowed by plan. Please upgrade plan"
                    ); //
                    break;

                case "rcptLimit":
                    this.noAnswer(
                        "You've reached maximum allowed recipient per mail. Please upgrade plan."
                    ); //
                    break;

                case "reuploadAttachm":
                    this.noAnswer(
                        "We have problem send email with attachment, please re-upload attchments before sending email"
                    ); //
                    break;

                case "unregNoLonger":
                    this.noAnswer("Email no longer available.");
                    break;
                case "tooBig":
                    this.noAnswer("Maximum allowed size for file is 15MB.");
                    break;

                case "unregAttempt":
                    this.omgAnswer(3 - option + " attempt(s) left");
                    break;

                case "mesgNotFound":
                    this.noAnswer("Email Not Found");
                    break;

                case "fileNotFound":
                    this.noAnswer("File Not Found");
                    break;

                case "noRecpnts":
                    this.noAnswer("Please add at least one recipient.");
                    break;

                case "alrdUsed":
                    this.noAnswer("You already claimed your reward.");
                    break;

                case "recpNotFound":
                    this.noAnswer("Recipient Not Found");
                    break;

                case "newerFnd":
                    this.noAnswer(
                        "Server has newer version. Please re-login to sync."
                    );
                    break;

                case "wrongPin":
                    this.noAnswer("Pin is incorrect. Please try again.");
                    break;

                case "fld2GeneratePgp":
                    this.noAnswer(
                        "Failed to generate PGP Keys. Please try again."
                    );
                    break;

                case "failedDecr":
                    this.noAnswer("Failed to decrypt");
                    break;

                case "limitIsReached":
                    this.noAnswer(
                        "You've reached limit for this action. Please try again later or upgrade your plan."
                    );
                    break;

                case "pasNotValid":
                    this.noAnswer("Invalid Password Format");
                    break;
                case "wrngUsrOrPass":
                    this.noAnswer(
                        "Wrong Username or Password. Please try again."
                    );
                    break;
                case "incToken":
                    this.noAnswer("Token incorrect. Please re-login");
                    break;
                case "fld2upd":
                    this.noAnswer("Failed To Update. Please try again.");
                    break;
                case "fldObj":
                    this.noAnswer("Failed To Synchronize. Please try again.");
                    break;
                case "fld2save":
                    this.noAnswer("Failed To Save. Please try again.");
                    break;

                case "tryAgain":
                    this.noAnswer("Connection Error. Please try again.");
                    break;
                case "saved":
                    this.Answer("Saved.");
                    break;
                case "Sent":
                    this.Answer("Sent");
                    break;
                case "messageMoved":
                    this.Answer("Moved");
                    break;
                case "MarkedAsSpam":
                    this.Answer("Marked as spam");
                    break;

                case "msgRemoved":
                    this.Answer("Deleted");
                    break;

                case "Thank you":
                    this.Answer("Thank you");
                    break;

                case "nthTochng":
                    this.omgAnswer("Nothing changed");
                    break;

                case "nthTochngORexst":
                    this.omgAnswer("Nothing changed Or already exist");
                    break;
                case "email2often":
                    this.omgAnswer(
                        "You've reached hourly sending limit. Please try again later or upgrade your plan."
                    );
                    break;
            }
        },

        noAnswer: function (text) {
            $.smallBox({
                title: text,
                content: "",
                color: "#fff", // #A65858 / #2277F6
                iconSmall: "fa fa-times",
                timeout: 3000,
            });
        },

        omgAnswer: function (text) {
            $.smallBox({
                title: text,
                content: "",
                color: "#B4990D",
                iconSmall: "fa fa-times",
                timeout: 5000,
            });
        },

        Answer: function (text) {
            $.smallBox({
                title: text,
                content: "",
                color: "#FFFFFF",
                iconSmall: "fa fa-check",
                timeout: 2000,
            });
        },
    });

    return SystemNotification;
});
