define(["react", "app", "select2", "ckeditor"], function (
  React,
  app,
  select2,
  ClassicEditor
) {
  return React.createClass({
    getInitialState: function () {
      return {
        fromEmail: this.emailsender(),
        to: this.buildFieldsforSelect(
          app.user.get("draftMessageView")["meta"]["to"]
        ),
        toCC: this.buildFieldsforSelect(
          app.user.get("draftMessageView")["meta"]["toCC"]
        ),
        toBCC: this.buildFieldsforSelect(
          app.user.get("draftMessageView")["meta"]["toBCC"]
        ),

        showCC: "",
        showBCC: "",
        showAtt: "",
        showPin: "",

        subject: app.user.get("draftMessageView")["meta"]["subject"],
        body: app.globalF.filterXSSwhite(
          app.user.get("draftMessageView")["body"]["html"]
        ),

        manualSignature:
          app.user.get("draftMessageView")["meta"]["signatureOn"],
        emailAttachment: app.user.get("draftMessageView")["attachment"],
        fileObject: app.user.get("draftMessageView")["attachment"],

        fromOptions: [],
        fromArray: {},
        signature: "",
        recipientLimit: app.user.get("userPlan")["planData"]["recipPerMail"],
        planRcptLimit: app.user.get("userPlan")["planData"]["recipPerMail"],
        contactArray: app.globalF.createContactFromSelect(),

        messageId: app.user.get("draftMessageView")["messageId"],
        sendingProgress: false,

        fileObjectNoData: {},
        prevFileObject: Object.keys(
          app.user.get("draftMessageView")["attachment"]
        ),
        fileSize: this.getFilesize(
          app.user.get("draftMessageView")["attachment"]
        ),
        emailProtected: -1,
        recipientList: [],

        enablePin: app.user.get("draftMessageView")["meta"]["pinEnabled"],
        pinText: app.user.get("draftMessageView")["meta"]["pin"],
        userPin: false,
        savingDraft: {},

        encryptionKey: "",
        changedHash: "",
        correctSig:
          '<a href="https://mailum.com/mailbox/#signup/' +
          app.user.get("userPlan")["coupon"] +
          '/" target="_blank" contenteditable="false">mailum.com</a>',

        modKey: app.user.get("draftMessageView")["modKey"],
        allEmails: {},
        uploadProgress: 0,
        uploadInterval: {},
        showUploadBar: "d-none",
        isMounted: app.globalF.generateStateRandomId(),

        oldPublicKeys: {},
        oldPublicKeysHash: "",
        sizeBarText: "",

        isMaximized: app.mailMan.get("webview"),
        isMobile: app.mailMan.get("webview"),
        isMinimized: false,
        composeOriginate: app.user.get('composeOriginate'),
      };
    },
    componentDidMount: async function () {
      //return;
      var thisComp = this;
      await this.fromField("initialize");
      fileSelector = $("#fileselector");
      // Initialize CKEditor 5
      ClassicEditor.create(document.querySelector("#composeEmail"), {
        //toolbar: ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', 'link', 'undo', 'redo']
        toolbar: [
          "bold",
          "italic",
          "bulletedList",
          "numberedList",
          "link",
          "blockquote",
          "undo",
          "redo",
        ],
        htmlSupport: {
          allow: [
            {
              name: 'div',
              classes: ['emailbody', 'emailsignature', 'oldemail','fileattach']
            }
          ]
        }
      })
        .then((editor) => {

          thisComp.editor = editor;

          // Set initial data
          var newEmailBody = "";
          //var newEmailText = '<div class="emailbody"><br/><br/></div>';
          var newEmailText = '<div class="emailbody"></div>';
          var signature = "";
          var curSig = app.transform
            .from64str(this.fromField("sig"))
            .toLowerCase();
          var cSig = app.transform.from64str(this.fromField("sig"));
          if (app.user.get("composeOriginate") == "new") {
            if (
              (curSig.includes("mailum.com") ||
                curSig.includes("cyberfear.com")) &&
              !curSig.includes('href="https://mailum.com"')
            ) {
              cSig =
                "Sent using Encrypted Email Service - " +
                thisComp.state.correctSig;
            }
          }

          if (this.state.fromArray[this.state.fromEmail]["includeSignature"]) {
            signature =
              '<div class="emailsignature" contenteditable="false">' +
              cSig +
              "</div>";
          } else {
            signature = '<div class="emailsignature"></div>';
          }

          // cSig = 'Sent using Encrypted Email Service - ' + thisComp.state.correctSig;
          // signature = '<div class="emailsignature">' + cSig + '</div>';
          // alert(signature);
          //console.log(signature);

          var oldEmailText = "";

          if (app.user.get("composeOriginate") == "new") {
            newEmailBody = newEmailText + "<br/>" + signature;
            //newEmailBody = newEmailText + signature;
          } else if (
            app.user.get("composeOriginate") == "reply" ||
            app.user.get("composeOriginate") == "forward"
          ) {
            newEmailBody = newEmailText + "<br/>" + signature;
            oldEmailText =
              //'<br/><div class="oldemail">' + thisComp.state.body + "</div>";
              '<div class="oldemail">' + thisComp.state.body + "</div>";
          } else {
            oldEmailText = thisComp.state.body;
          }

          editor.editing.view.focus();
          editor.setData(newEmailBody + oldEmailText);

          thisComp.setState({
            originalHash: thisComp.getEmailHash(),
          });
          // Override the downcast converter for the 'paragraph' model element.

        })
        .catch((error) => {
          console.error("Error initializing CKEditor:", error);
        });

      thisComp.toSelect();
      thisComp.toCCSelect();
      thisComp.toBCCSelect();
      thisComp.attachFiles();

      $("#toRcpt").on("select2:selecting", function (e) {
        var limits = thisComp.countTotalRcpt();
        if (limits >= thisComp.state.planRcptLimit) {
          app.notifications.systemMessage("rcptLimit");
          e.preventDefault();
        }
      });
      $("#toRcpt").on("select2:select", function (e) {
        thisComp.checkRcpt();
        var element = e.params.data.element;
        var $element = $(element);

        $element.detach();
        $(this).append($element);
        $(this).trigger("change");
      });

      $("#toCCRcpt").on("select2:selecting", function (e) {
        var limits = thisComp.countTotalRcpt();
        if (limits >= thisComp.state.planRcptLimit) {
          app.notifications.systemMessage("rcptLimit");
          e.preventDefault();
        }
      });
      $("#toCCRcpt").on("select2:select", function (e) {
        thisComp.checkRcpt();
        var element = e.params.data.element;
        var $element = $(element);

        $element.detach();
        $(this).append($element);
        $(this).trigger("change");
      });

      $("#toBCCRcpt").on("select2:selecting", function (e) {
        var limits = thisComp.countTotalRcpt();
        if (limits >= thisComp.state.planRcptLimit) {
          app.notifications.systemMessage("rcptLimit");
          e.preventDefault();
        }
      });
      $("#toBCCRcpt").on("select2:select", function (e) {
        thisComp.checkRcpt();
        var element = e.params.data.element;
        var $element = $(element);

        $element.detach();
        $(this).append($element);
        $(this).trigger("change");
      });

      $("#atachFiles").on("select2:selecting", function (e) {
        e.preventDefault();
      });

      $("#atachFiles").on("select2:unselecting", function (e) {
        app.mixins.canNavigate(function (decision) {
          if (decision) {
            thisComp.fileRemove(
              e["params"]["args"]["data"]["id"],
              function () {}
            );

            e.preventDefault();
          }
        });
      });

      $("#atachFiles").on("select2:select", function (e) {
        e.preventDefault();
        var element = e.params.data.element;
        var $element = $(element);

        $element.detach();
        $(this).append($element);
        $(this).trigger("change");
      });

      $("#toRcpt").on("select2:unselect", function (e) {
        thisComp.setState({
          recipientLimit:
            thisComp.state.recipientLimit <= thisComp.state.planRcptLimit
              ? thisComp.state.planRcptLimit
              : thisComp.state.recipientLimit + 1,
        });

        thisComp.checkRcpt();
      });
      $("#toCCRcpt").on("select2:unselect", function (e) {
        thisComp.setState({
          recipientLimit:
            thisComp.state.recipientLimit <= thisComp.state.planRcptLimit
              ? thisComp.state.planRcptLimit
              : thisComp.state.recipientLimit + 1,
        });
        thisComp.checkRcpt();
      });
      $("#toBCCRcpt").on("select2:unselect", function (e) {
        thisComp.setState({
          recipientLimit:
            thisComp.state.recipientLimit <= thisComp.state.planRcptLimit
              ? thisComp.state.planRcptLimit
              : thisComp.state.recipientLimit + 1,
        });
        thisComp.checkRcpt();
      });

      thisComp.setState({
        showCC: this.state.toCC.length == 0 ? "d-none" : "",
        showBCC: this.state.toBCC.length == 0 ? "d-none" : "",
        showAtt:
          Object.keys(this.state.emailAttachment).length == 0 ? "d-none" : "",
        showPin: !this.state.enablePin ? "d-none" : "",
        originalHash: thisComp.getEmailHash(),
      });
      $("#toRcpt").val(this.state.to).trigger("change");
      $("#toCCRcpt").val(this.state.toCC).trigger("change");
      $("#toBCCRcpt").val(this.state.toBCC).trigger("change");
      $("#atachFiles")
        .val(Object.keys(thisComp.state.fileObject))
        .trigger("change");

      // sig removed temporarily

      thisComp.draftSaveInterval();
    },

    buildFieldsforSelect: function (data) {
      var options = [];
      if (Object.keys(data).length > 0) {
        $.each(data, function (index, emailData) {
          options.push(index);
        });
      }
      return options;
    },
    emailsender: function () {
      var sender = app.user.get("draftMessageView")["meta"]["from"];
      if (sender === "") {
        var keys = app.user.get("allKeys");
        $.each(keys, function (index, keyValue) {
          if (keyValue["isDefault"]) {
            sender = index;
          }
        });
      }
      return sender;
    },
    fromField: function (action) {
      var thisComp = this;
      var keys = app.user.get("allKeys");
      var options = [];
      var sendArr = [];
      var from =
        this.state == undefined
          ? app.user.get("draftMessageView")["meta"]["from"]
          : this.state.fromEmail;

      var signature = "";
      var stateFrom = "";
      var includeSig = false;

      $.each(keys, function (index, keyValue) {
        var emailRaw =
          app.transform.from64str(keyValue["name"]) +
          " <" +
          app.transform.from64str(keyValue["email"]) +
          ">";
        var parsedEmail = app.globalF.parseEmail(emailRaw);

        if (keyValue["canSend"]) {
          sendArr[keyValue["email"]] = keyValue;
          options.push(
            <option key={index} value={index}>
              {parsedEmail["display"]}
            </option>
          );
        }
        if (from != "" && from == index && keyValue["includeSignature"]) {
          signature = keyValue["signature"];
        } else if (
          from == "" &&
          keyValue["isDefault"] &&
          keyValue["includeSignature"]
        ) {
          includeSig = keyValue["includeSignature"];
          signature = keyValue["signature"];
        }
      });

      if (action == "initialize") {
        this.setState({
          fromOptions: options,
          fromArray: sendArr,
        });
      }

      if (action == "includeSig") {
        return includeSig;
      }
      if (action == "sig") {
        return signature;
      }
    },
    componentWillUnmount: function () {
      clearTimeout(this.state.savingDraft);
      app.globalF.resetDraftMessage();
      this.setState({ isMounted: "" });
      app.user.set({ emailReplyState: "" });
    },

    toSelect: function () {
      var thisComp = this;
      $("#toRcpt").select2({
        debug: true,
        tags: true,
        data: thisComp.state.contactArray,
        placeholder:
          "Recipients can see each other emails. Maximum " +
          app.user.get("userPlan")["planData"]["recipPerMail"] +
          " recipients per mail",
        tokenSeparators: [";"],
        selectOnClose: true,
        minimumInputLength: 2,
        maximumInputLength: 250,
        maximumSelectionLength: thisComp.state.recipientLimit,
        language: {
          maximumSelected: function () {
            return (
              "Your plan is limited to " +
              app.user.get("userPlan")["planData"]["recipPerMail"] +
              " recipients per email. Please upgrade plan to raise limit."
            );
          },
          inputTooShort: function () {
            return "";
          },
        },
        templateSelection: app.globalF.emailSelection,
        escapeMarkup: function (markup) {
          return markup;
        },
      });
    },

    toCCSelect: function () {
      var thisComp = this;

      $("#toCCRcpt").select2({
        debug: true,
        tags: true,
        data: thisComp.state.contactArray,
        placeholder:
          "Recipient can see each other emails. Maximum " +
          app.user.get("userPlan")["planData"]["recipPerMail"] +
          " recipients per mail",
        tokenSeparators: [";"],
        minimumInputLength: 2,
        maximumInputLength: 250,
        maximumSelectionLength: thisComp.state.recipientLimit,
        language: {
          maximumSelected: function () {
            return (
              "Your plan is limited to " +
              app.user.get("userPlan")["planData"]["recipPerMail"] +
              " recipients per email. Please upgrade plan to raise limit."
            );
          },
          inputTooShort: function () {
            return "";
          },
        },
        templateSelection: app.globalF.emailSelection,
        escapeMarkup: function (m) {
          return m;
        },
      });
    },

    toBCCSelect: function () {
      var thisComp = this;

      $("#toBCCRcpt").select2({
        debug: true,
        tags: true,
        data: thisComp.state.contactArray,
        placeholder:
          "Recipient can not see each other emails. Maximum " +
          app.user.get("userPlan")["planData"]["recipPerMail"] +
          " recipients per mail",
        tokenSeparators: [";"],
        minimumInputLength: 2,
        maximumInputLength: 250,
        maximumSelectionLength: thisComp.state.recipientLimit,
        language: {
          maximumSelected: function () {
            return (
              "Your plan is limited to " +
              app.user.get("userPlan")["planData"]["recipPerMail"] +
              " recipients per email. Please upgrade plan to raise limit."
            );
          },
        },
        templateSelection: app.globalF.emailSelection,
        escapeMarkup: function (m) {
          return m;
        },
      });
    },
    attachFiles: function () {
      var thisComp = this;

      $("#atachFiles").select2({
        tags: true,
        data: Object.keys(thisComp.state.fileObject),
        placeholder:
          "10 files max, not more than " +
          app.user.get("userPlan")["planData"]["attSize"] +
          " Mb total",
        tokenSeparators: ["/"],
        maximumSelectionLength: 10,
        formatSelectionTooBig: "Max of 10 files allowed.",
        language: {
          maximumSelected: function () {
            return "Your plan is limited to 10 files per email.";
          },
          noResults: function () {
            return "Click on icon to select file";
          },
        },
        templateSelection: app.globalF.fileSelection,
        escapeMarkup: function (m) {
          return m;
        },
      });
    },
    getEmailHash: function () {
      var prehash = {
        from: this.state.fromEmail,
        to: this.checkRcpt()["allList"],
        subject: app.globalF.stripHTML(this.state.subject.substring(0, 150)),
        pin: this.state.pinText,
        pinEnabled: this.state.enablePin,
        body: this.editor ? this.editor.getData() : "",
        attachment: this.state.fileObject,
      };

      return app.transform.SHA512(JSON.stringify(prehash));
    },
    countTotalRcpt: function () {
      var total = 0;
      var thisComp = this;

      var rcpt = $("#toRcpt").val();
      var ccRcpt = $("#toCCRcpt").val();
      var bccRcpt = $("#toBCCRcpt").val();

      if (rcpt != null) {
        total += rcpt.length;
      }
      if (ccRcpt != null) {
        total += ccRcpt.length;
      }
      if (bccRcpt != null) {
        total += bccRcpt.length;
      }

      return total;
    },
    checkRcpt: function (callback) {
      var total = 0;

      var allList = {
        to: {},
        cc: {},
        bcc: {},
        noDups: {},
      };
      var requestHashes = [];
      var allListWHash = {};

      var AllRecipients = {};
      var AllRecipientsByEmail = {};

      var AllRecipientsNoBcc = {};
      var AllRecipientsonlyBcc = {};

      var thisComp = this;

      var contacts = app.user.get("contacts");

      var rcpt = $("#toRcpt").val();
      var ccRcpt = $("#toCCRcpt").val();
      var bccRcpt = $("#toBCCRcpt").val();

      if (rcpt == null) {
        rcpt = [];
      } else {
        total += rcpt.length;

        $.each(rcpt, function (index, value) {
          if (!app.transform.check64str(value)) {
            var parsed = app.globalF.parseEmail(value);
            var ind = app.transform.to64str(parsed["email"]);

            allList["to"][ind] = {
              name: app.transform.to64str(parsed["name"]),
              dest: "to",
            };
            allList["noDups"][ind] = {
              name: app.transform.to64str(parsed["name"]),
              dest: "to",
            };
          } else {
            allList["to"][value] = { name: "", dest: "to" };
            allList["noDups"][value] = { name: "", dest: "to" };
          }
        });
      }

      if (ccRcpt == null) {
        ccRcpt = [];
      } else {
        total += ccRcpt.length;

        $.each(ccRcpt, function (index, value) {
          if (!app.transform.check64str(value)) {
            var parsed = app.globalF.parseEmail(value);
            var ind = app.transform.to64str(parsed["email"]);

            allList["cc"][ind] = {
              name: app.transform.to64str(parsed["name"]),
              dest: "cc",
            };
            allList["noDups"][ind] = {
              name: app.transform.to64str(parsed["name"]),
              dest: "cc",
            };
          } else {
            allList["cc"][value] = { name: "", dest: "cc" };
            allList["noDups"][value] = { name: "", dest: "cc" };
          }
        });
      }

      if (bccRcpt == null) {
        bccRcpt = [];
      } else {
        total += bccRcpt.length;

        $.each(bccRcpt, function (index, value) {
          if (!app.transform.check64str(value)) {
            var parsed = app.globalF.parseEmail(value);
            var ind = app.transform.to64str(parsed["email"]);

            allList["bcc"][ind] = {
              name: app.transform.to64str(parsed["name"]),
              dest: "bcc",
            };
            allList["noDups"][ind] = {
              name: app.transform.to64str(parsed["name"]),
              dest: "bcc",
            };
          } else {
            allList["bcc"][value] = { name: "", dest: "bcc" };
            allList["noDups"][value] = { name: "", dest: "bcc" };
          }
        });
      }

      var dataResult = {
        total: total,
        allList: allList,
      };

      if (Object.keys(allList["noDups"]).length > 0) {
        var pinEnabled = thisComp.state.enablePin;
        var pin = thisComp.state.pinText;

        $.each(allList["noDups"], function (email64, data) {
          if (contacts[email64] != undefined) {
            var ind = app.transform.SHA512(app.transform.from64str(email64));

            AllRecipients[ind] = {
              email: email64,
              name: contacts[email64]["n"],
              destination: data["dest"],
              internal: false,
              pin: pinEnabled ? pin : "",
              publicKey:
                contacts[email64]["pgpOn"] === true
                  ? contacts[email64]["pgp"]
                  : "",
            };
            AllRecipientsByEmail[email64] = AllRecipients[ind];

            requestHashes.push(ind);
          } else {
            var newCont = app.transform.from64str(email64);

            AllRecipients[app.transform.SHA512(newCont)] = {
              email: email64,
              name: email64 != data["name"] ? data["name"] : "",
              destination: data["dest"],
              internal: false,
              pin: pinEnabled ? pin : "",
              publicKey: "",
            };
            AllRecipientsByEmail[email64] =
              AllRecipients[app.transform.SHA512(newCont)];
            requestHashes.push(app.transform.SHA512(newCont));
          }
        });
        var post = {
          mails: JSON.stringify(requestHashes),
        };

        var newHash = app.transform.SHA256(JSON.stringify(requestHashes));
        if (newHash != thisComp.state.oldPublicKeysHash) {
          app.serverCall.ajaxRequest(
            "retrievePublicKeys",
            post,
            function (result) {
              if (result["response"] == "success") {
                $.each(result["data"], function (index, emailData) {
                  //allListWHash[index]['internal']=1;
                  AllRecipients[index]["internal"] = true;
                  AllRecipients[index]["v"] = emailData["v"];
                  AllRecipients[index]["publicKey"] = emailData["mailKey"];

                  AllRecipientsByEmail[AllRecipients[index]["email"]] =
                    AllRecipients[index];
                });

                thisComp.setState(
                  {
                    oldPublicKeys: AllRecipientsByEmail,
                    oldPublicKeysHash: newHash,
                    allEmails: AllRecipientsByEmail,
                  },
                  function () {
                    thisComp.verifyIfencrypted();
                    if (typeof callback !== "undefined") {
                      callback(dataResult);
                    }
                  }
                );
              }
            }
          );
          thisComp.setState({
            oldPublicKeysHash: newHash,
          });
        } else {
          AllRecipientsByEmail = thisComp.state.oldPublicKeys;
          if (typeof callback !== "undefined") {
            thisComp.verifyIfencrypted();
            callback(dataResult);
          }
        }
      } else {
        thisComp.setState(
          {
            //recipientList:allListWHash,
            oldPublicKeysHash: "",
            allEmails: {},
          },
          function () {
            thisComp.verifyIfencrypted();
          }
        );
      }

      return dataResult;
    },
    getFileMeta: function (fileObject) {
      var tempObj = jQuery.extend(true, {}, this.state.fileObject);

      if (Object.keys(tempObj).length > 0) {
        $.each(tempObj, function (index, value) {
          delete tempObj[index]["data"];
        });
      }

      return tempObj;
    },
    getFilesize: function (fileObject) {
      var fSize = 0;
      if (Object.keys(fileObject).length > 0) {
        $.each(fileObject, function (index, value) {
          fSize += parseInt(app.transform.from64str(value["size"]));
        });
      }

      return fSize;
    },
    fileTag: function () {
      if (Object.keys(this.state.fileObject).length > 0) {
        $.each(this.state.fileObject, function (index, value) {
          $("#file_" + app.transform.SHA1(index) + " >i").removeClass();
          $("#file_" + app.transform.SHA1(index))
            .parent()
            .addClass("file-uploaded");
        });
      }
    },

    readFile: function (event) {
      var thisComp = this;

      $.each($(event)[0].target.files, function (index, fileData) {
        var file = fileData;

        var fileObject = thisComp.state.fileObject;

        if (
          Object.keys(thisComp.state.fileObject).length <= 10 &&
          thisComp.state.fileSize + file["size"] <=
            parseInt(app.user.get("userPlan")["planData"]["attSize"]) *
              1024 *
              1024 *
              1.1
        ) {
          if (
            file["size"] <
            parseInt(app.user.get("userPlan")["planData"]["attSize"]) *
              1024 *
              1024 *
              1.1
          ) {
            if (
              Object.keys(fileObject).indexOf(
                app.transform.to64str(file["name"])
              ) == -1
            ) {
              app.user.set({
                uploadInProgress: true,
              });

              var reader = new FileReader();

              reader.onload = function (e) {
                var binary_string = "";
                var bytes = new Uint8Array(reader.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                  binary_string += String.fromCharCode(bytes[i]);
                }

                var fname = app.transform.to64str(file["name"]);
                fileObject[fname] = {};

                fileObject[fname]["base64"] = true;
                fileObject[fname]["data"] =
                  app.transform.to64bin(binary_string);
                fileObject[fname]["name"] = app.transform.to64str(file["name"]);
                fileObject[fname]["key"] = app.transform.to64bin(
                  app.globalF.createEncryptionKey256()
                );

                fileObject[fname]["fileName"] = "toBeDetermenedAfterFileSave";
                fileObject[fname]["size"] = app.transform.to64str(file["size"]);
                fileObject[fname]["type"] = app.transform.to64str(file["type"]);
                fileObject[fname]["modKey"] = app.globalF.makeModKey();
                fileObject[fname]["v"] = 2;

                var list = Object.keys(fileObject);

                selectedValues = [];

                $("#atachFiles").children().remove();

                if (list.length > 0) {
                  $.each(list, function (index, value) {
                    $("#atachFiles").append(
                      '<option class="attached-files-list" value="' +
                        value +
                        '">' +
                        app.transform.from64str(value) +
                        "</option>"
                    );
                    selectedValues.push(value);
                  });
                }
                thisComp.handleClick("showAtt");

                $("#atachFiles").val(selectedValues).trigger("change");

                thisComp.fileUpload();
              };

              thisComp.setState(
                {
                  uploadProgress: 15,
                  sizeBarText: "Encrypting File",
                },
                function () {
                  reader.readAsArrayBuffer(file);
                }
              );
            }
          } else {
            app.notifications.systemMessage("tooBig");
          }
        } else {
          app.notifications.systemMessage("MaxFiles");
        }
      });

      $("#ddd").val("");
    },

    fileUpload: function () {
      clearInterval(this.state.savingDraft);

      var thisComp = this;

      var oldList = this.state.prevFileObject;
      var newList = this.state.fileObject;
      var fileList = {};

      $.each(newList, function (fName, fData) {
        if (oldList[fName] == undefined) {
          fileList = {
            index: fName,
            modKey: fData["modKey"],
            key: fData["key"],
          };
        }
      });

      thisComp.setState({
        prevFileObject: Object.keys(newList),
        showUploadBar: "",
      });

      thisComp.prepareToSafeDraft("force", function () {
        thisComp.setState({
          uploadProgress: 50,
          sizeBarText: "Uploading File",
        });
        app.globalF.sendNewAttachment(
          newList,
          fileList,
          thisComp.state.messageId,
          thisComp.state.modKey,
          function (result) {
            clearInterval(thisComp.state.uploadInterval);

            if (result["response"] == "success") {
              newList[fileList["index"]]["fileName"] = result["fileName"];
              delete newList[fileList["index"]]["data"];

              thisComp.setState({
                uploadProgress: 100,
                sizeBarText: "File Successfully Uploaded",
                showUploadBar: "d-none",
              });
              app.user.set({
                uploadInProgress: false,
              });

              thisComp.addFileLink();

              thisComp.prepareToSafeDraft("", function () {});

              thisComp.setState({
                fileSize: thisComp.getFilesize(newList),
              });
            } else if (result["fileSize"] == "overLimit") {
              app.notifications.systemMessage("MaxFiles");
              app.user.set({
                uploadInProgress: false,
              });
            } else {
              app.user.set({
                uploadInProgress: false,
              });

              $(
                "#file_" + app.transform.SHA1(fileList["index"]) + " >i"
              ).removeClass();
              $("#file_" + app.transform.SHA1(fileList["index"]))
                .parent()
                .addClass("file-upload-failed");
            }
          }
        );
      });
    },

    addFileLink: function () {
      var time = new Date(new Date().setYear(new Date().getFullYear() + 1));

      if (this.state.emailProtected === 3 || this.state.emailProtected === 1) {
        // Remove file attachments from the editor content
        if (this.editor) {
          var data = this.editor.getData();
          console.log('emaildata:');
          console.log(data);
         // console.log();
          var updatedData = data.replace(
            /<p[^>]*>Files will be available for download until[\s\S]*?<\/p>/gi,
            ""
          );
          this.editor.setData(updatedData);
        }
      } else {
        // Build the file attachment links
        var linkbody =
          "<br/><div class='fileattach' style='background-color:#F2F2F2;'><span>Files will be available for download until " +
          time.toLocaleString() +
          //"<br/>";
          "";

        var fileObj = this.state.fileObject;
        var c = 1;
        $.each(fileObj, function (fName, fData) {
          linkbody +=
            '<div style="clear:both; margin-top:5px;">' +
            ' <a href="' +
            app.defaults.get("domainVPS") +
            "/api/dFV2/" +
            fData["fileName"] +
            "1/p/" +
            app.transform.bin2hex(app.transform.from64bin(fData["key"])) +
            '" target="_blank" contenteditable="false">' +
            app.transform.from64str(fName) +
            "</a></div>";
          c++;
        });

        linkbody += "</div>";

        if (Object.keys(fileObj).length > 0 && this.editor) {
          var data = this.editor.getData()
          var updatedData = data.replace(
              /<p[^>]*>Files will be available for download until[\s\S]*?<p><a[\s\S]*?<\/p>/gi,
              ""
          );
          var updatedData1 = updatedData + linkbody;
          console.log('emaildata:');
          console.log(updatedData);
          this.editor.setData(updatedData1);
        }
      }
    },
    fileRemove: function (fileName64, callback) {
      console.log('removing');
      clearInterval(this.state.savingDraft);
      var thisComp = this;
      var fileObject = thisComp.state.fileObject;
      var fileSize = thisComp.state.fileSize;

      var fileList = {
        fileName: fileObject[fileName64]["fileName"],
        modKey: fileObject[fileName64]["modKey"],
      };

      app.serverCall.ajaxRequest(
        "removeFileFromDraft",
        fileList,
        function (result) {
          if (result["response"] == "success") {
            delete fileObject[fileName64];

            thisComp.setState({
              fileSize: thisComp.getFilesize(fileObject),
              prevFileObject: Object.keys(fileObject),
            });

            $("#atachFiles").children().remove();

            selectedValues = [];

           // $("#atachFiles").children().remove();

            if (Object.keys(fileObject).length > 0) {
              $.each(Object.keys(fileObject), function (index, value) {
                $("#atachFiles").append(
                  '<option value="' +
                    value +
                    '">' +
                    app.transform.from64str(value) +
                    "</option>"
                );
                selectedValues.push(value);
              });
            } else {
              thisComp.setState({
                showAtt: "d-none",
              });
            }
            $("#atachFiles").val(selectedValues).trigger("change");
            console.log('going to link');
            thisComp.addFileLink();
            thisComp.fileTag();
            thisComp.prepareToSafeDraft("", function () {});
            callback();
          } else {
            app.notifications.systemMessage("tryAgain");
          }
        }
      );
    },
    verifyIfencrypted: function () {
      var thisComp = this;
      var AllRecipients = this.state.allEmails;
      var internals = {};
      var outsiders = {};
      var pin = this.state.pinText;
      var clearTexter = false;
      var pinProtected = false;
      var pgpProtected = false;
      var allRecip = $.Deferred();
      var protect = 0;

      if (Object.keys(AllRecipients).length > 0) {
        $.each(AllRecipients, function (index, rcpt) {
          if (rcpt["internal"] === true) {
            internals[index] = rcpt;
          } else {
            outsiders[index] = rcpt;
          }
          if (
            rcpt["internal"] === false &&
            rcpt["publicKey"] == "" &&
            (thisComp.state.enablePin === false || thisComp.state.pinText == "")
          ) {
            clearTexter = true;
          }

          if (
            rcpt["internal"] === false &&
            rcpt["publicKey"] == "" &&
            thisComp.state.enablePin === true &&
            thisComp.state.pinText != ""
          ) {
            pinProtected = true;
          }

          if (rcpt["internal"] === false && rcpt["publicKey"] != "") {
            pgpProtected = true;
          }
        });

        // console.log("PIN");
        // console.log(this.state.enablePin);
        // console.log(this.state.pinText);
        // console.log(this.state.userPin);
        if (
          Object.keys(outsiders).length == 1 &&
          this.state.enablePin === true &&
          this.state.pinText == "" &&
          !this.state.userPin
        ) {
          var contacts = app.user.get("contacts");
          var index = Object.keys(outsiders)[0];
          if (index != "") {
            if (contacts[index] !== undefined) {
              pin = app.transform.from64str(contacts[index]["p"]);
            }

            thisComp.setState(
              {
                pinText: pin,
                userPin: true,
              },
              function () {
                thisComp.verifyIfencrypted();
              }
            );
          }
        }

        if (
          Object.keys(outsiders).length > 1 &&
          this.state.pinText != "" &&
          this.state.userPin
        ) {
          pin = "";
          thisComp.setState({
            pinText: "",
          });
        }

        var cc = Object.keys(AllRecipients).length;
        var out = Object.keys(outsiders).length;

        $.each(AllRecipients, function (index, emailData) {
          var id = "." + app.transform.SHA256(app.transform.from64str(index));
          var classSpan = "";
          var classI = "";
          if (clearTexter) {
            classSpan = "email-unprotected";
            classI = "fa fa-unlock";
            protect = 0;
          } else if (pinProtected) {
            classSpan = "email-pinprotected";
            classI = "fa fa-lock";
            protect = 1;
          } else if (pgpProtected) {
            classSpan = "email-pgpprotected";
            classI = "fa fa-lock";
            protect = 2;
          } else if (out == 0) {
            classSpan = "email-protected";
            classI = "fa fa-lock";
            protect = 3;
          }

          $(id)
            .parent()
            .removeClass(
              "email-protect email-unprotected email-pinprotected email-pgpprotected"
            )
            .addClass(classSpan);
          $(id + ">i")
            .removeClass()
            .addClass(classI);

          cc--;
          if (cc === 0) {
            allRecip.resolve();
          }
        });
      } else {
        thisComp.setState({
          emailProtected: -1,
        });
      }

      allRecip.done(function () {
        thisComp.setState(
          {
            emailProtected: protect,
          },
          function () {
            thisComp.addFileLink();
          }
        );
      });
    },

    prepareToSafeDraft: function (action, callback) {
      var thisComp = this;
      var changedHash = this.getEmailHash();
      clearInterval(this.state.savingDraft);

      if (this.state.originalHash != changedHash || action == "force") {
        this.setState({
          originalHash: changedHash,
        });

        var d = new Date();

        var draft = {
          meta: {},
          attachment: {},
          body: {},
        };

        draft["messageId"] = thisComp.state.messageId;

        var editorData = thisComp.editor ? thisComp.editor.getData() : "";

        draft["body"] = {
          text: app.transform.to64str(app.globalF.stripHTML(editorData)),
          html: app.transform.to64str(app.globalF.filterXSSwhite(editorData)),
        };
        draft["meta"]["from"] = $("#fromSender").val();
        draft["meta"]["to"] = this.checkRcpt()["allList"]["to"];
        draft["meta"]["toCC"] = this.checkRcpt()["allList"]["cc"];
        draft["meta"]["toBCC"] = this.checkRcpt()["allList"]["bcc"];

        draft["meta"]["attachment"] =
          Object.keys(this.state.fileObject).length > 0 ? 1 : 0;
        draft["meta"]["body"] = app.transform.to64str(
          app.globalF
            .stripHTML(
              //this.editor.getData()
              editorData
            )
            .substring(0, 50)
        );
        draft["meta"]["opened"] = true;
        draft["meta"]["pin"] = app.transform.to64str(thisComp.state.pinText);
        draft["meta"]["pinEnabled"] = thisComp.state.enablePin;
        draft["meta"]["status"] = "normal";
        draft["meta"]["subject"] = app.transform.to64str(
          app.globalF.stripHTML(thisComp.state.subject.substring(0, 150))
        );
        draft["meta"]["timeSent"] = Math.round(d.getTime() / 1000);
        draft["meta"]["timeCreated"] =
          draft["messageId"] == ""
            ? Math.round(d.getTime() / 1000)
            : draft["meta"]["timeCreated"];
        draft["meta"]["timeUpdated"] = Math.round(d.getTime() / 1000);
        draft["meta"]["signatureOn"] = true;

        draft["meta"]["type"] = 3;
        draft["meta"]["version"] = 2;

        draft["meta"]["modKey"] = thisComp.state.modKey;
        draft["meta"]["pinTop"] = draft["meta"]["timeSent"];

        draft["attachment"] = thisComp.getFileMeta(thisComp.state.fileObject);
        draft["size"] =
          JSON.stringify(draft["meta"]).length +
          JSON.stringify(draft["body"]).length +
          thisComp.getFilesize(this.state.fileObject);
        draft["modKey"] = thisComp.state.modKey;

        app.globalF.saveDraft(
          draft,
          thisComp.state.isMounted,
          function (result, uniqDraftId) {
            if (thisComp.state.isMounted === uniqDraftId) {
              thisComp.setState(
                {
                  messageId: result["messageId"],
                  modKey: result["modKey"],
                },
                function () {
                  app.globalF.syncUpdates();

                  callback();
                }
              );
            }

            //
          }
        );

        thisComp.draftSaveInterval();
      } else {
        thisComp.draftSaveInterval();
        callback();
      }
    },
    draftSaveInterval: function () {
      clearInterval(this.state.savingDraft);
      var thisComp = this;
      var setDraftSafe = setInterval(function () {
        thisComp.prepareToSafeDraft("", function () {});
      }, 5000);
      thisComp.setState({
        savingDraft: setDraftSafe,
      });
    },
    handleChange: function (i, event) {
      switch (i) {
        case "fromSelecting":
          var thisComp = this;
          thisComp.setState(
            {
              fromEmail: event.target.value,
            },
            function () {
              var curSig = app.globalF
                .filterXSSwhite(app.transform.from64str(this.fromField("sig")))
                .toLowerCase();
              var cSig = "";

              if (
                (curSig.includes("mailum.com") || curSig.includes("cyberfear.com")) &&
                !curSig.includes('href="https://mailum.com"')
              ) {
                cSig =
                  "Sent using Encrypted Email Service - " +
                  thisComp.state.correctSig;
              } else {
                cSig = app.globalF.filterXSSwhite(
                  app.transform.from64str(this.fromField("sig"))
                );
              }
              $(".emailsignature").html(cSig);

              thisComp.setState({
                signature: cSig,
              });
            }
          );

          break;
        case "enterSubject":
          var thisComp = this;
          thisComp.setState({
            subject: event.target.value,
          });
          break;
        case "enterPinText":
          var thisComp = this;
          thisComp.setState(
            {
              pinText: event.target.value,
              userPin: false,
            },
            function () {
              thisComp.verifyIfencrypted();
            }
          );
          break;
        case "getFile":
          this.setState({
            uploadProgress: 15,
            sizeBarText: "Reading File",
          });

          this.readFile(event);
          break;
      }
    },
    handleClick: function (i) {
      switch (i) {
        case "showCC":
          this.setState({
            showCC: this.state.showCC === "d-none" ? "" : "d-none",
          });
          break;
        case "showBCC":
          this.setState({
            showBCC: this.state.showBCC === "d-none" ? "" : "d-none",
          });
          break;
        case "showPin":
          var thisComp = this;
          this.setState(
            {
              showPin: this.state.showPin === "d-none" ? "" : "d-none",
              enablePin: !this.state.enablePin,
            },
            function () {
              thisComp.verifyIfencrypted();
            }
          );

          break;
        case "attachFile":
          fileSelector.click();
          break;
        case "showAtt":
          this.setState({
            showAtt: "",
          });
          break;
        case "sendEmail":
          var thisComp = this;
          //preparation to send email
          /*
                        1)stop draft saving
                        2)gather all infor for email
                        3)detect recipients protection level
                        4)encrypt email
                        5)send out
                        6)close email
                         */

          thisComp.setState({
            sendingProgress: true,
          });

          var saveDraft = $.Deferred();

          thisComp.prepareToSafeDraft("force", function () {
            // console.log('resolved');
            saveDraft.resolve();
          });

          if (thisComp.checkRcpt()["total"] > 0) {
            saveDraft.done(function () {
              clearInterval(thisComp.state.savingDraft);

              var d = new Date();

              var draft = {
                body: {},
                meta: {},
              };
              var editorData = thisComp.editor ? thisComp.editor.getData() : "";
              draft["body"] = {
                text: app.transform.to64str(
                  app.globalF.stripHTML(
                    //this.editor.getData()
                    editorData
                  )
                ),
                html: app.transform.to64str(
                  app.globalF.filterXSSwhite(
                    //this.editor.getData()
                    editorData
                  )
                ),
              };

              draft["meta"]["from"] =
                app.user.get("allKeys")[$("#fromSender").val()]["displayName"];
              draft["meta"]["to"] = thisComp.checkRcpt()["allList"]["to"];
              draft["meta"]["toCC"] = thisComp.checkRcpt()["allList"]["cc"];
              draft["meta"]["toBCC"] = thisComp.checkRcpt()["allList"]["bcc"];

              draft["meta"]["attachment"] = 0;
              draft["meta"]["body"] = app.transform.to64str(
                app.globalF
                  .stripHTML(
                    //this.editor.getData()
                    editorData
                  )
                  .substring(0, 50)
              );
              draft["meta"]["opened"] = true;
              draft["meta"]["pin"] = app.transform.to64str(
                thisComp.state.pinText
              );
              draft["meta"]["pinEnabled"] = thisComp.state.enablePin;
              draft["meta"]["status"] = "normal";
              draft["meta"]["subject"] = app.transform.to64str(
                app.globalF.stripHTML(thisComp.state.subject.substring(0, 150))
              );
              draft["meta"]["timeSent"] = Math.round(d.getTime() / 1000);
              draft["meta"]["timeCreated"] =
                draft["messageId"] == ""
                  ? Math.round(d.getTime() / 1000)
                  : draft["meta"]["timeCreated"];
              draft["meta"]["timeUpdated"] = Math.round(d.getTime() / 1000);
              draft["meta"]["signatureOn"] = true;

              draft["meta"]["type"] = 3;
              draft["meta"]["version"] = 2;
              draft["meta"]["pinTop"] = draft["meta"]["timeSent"];

              draft["attachment"] = jQuery.extend(
                true,
                {},
                thisComp.state.fileObject
              );

              thisComp.checkRcpt(function (result) {
                app.globalF
                  .prepareForSending(
                    draft,
                    thisComp.state.allEmails,
                    result,
                    thisComp.state.emailProtected,
                    thisComp.state.messageId,
                    thisComp.state.pinText
                  )
                  .then(function (response) {
                    app.globalF.syncUpdates();
                    app.globalF.resetCurrentMessage();
                    app.globalF.resetDraftMessage();

                    app.user.set({
                      isDecryptingEmail: false,
                    });

                    // Backbone.history.navigate(
                    //     "/mail/" +
                    //         app.user.get("currentFolder"),
                    //     {
                    //         trigger: true,
                    //     }
                    // );
                    app.layout.display("viewBox");
                    app.user.set({
                      isComposingEmail: false,
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);
                  })
                  .fail(function (error) {
                    //  console.log(error);
                    var emailId = thisComp.state.messageId;
                    var messages = app.user.get("emails")["messages"];
                    var origFolder =
                      app.user.get("systemFolders")["draftFolderId"];
                    messages[emailId]["tp"] = 3;

                    app.globalF.move2Folder(origFolder, [emailId], function () {
                      if (
                        error["data"] != "email2often" &&
                        error["data"] != "outgoingFreeLimited"
                      ) {
                        app.notifications.systemMessage("tryAgain");
                      } else if (error["data"] == "email2often") {
                        app.notifications.systemMessage("email2often");
                      } else if (error["data"] == "attachmentError") {
                        app.notifications.systemMessage("reuploadAttachm");
                      } else if (error["data"] == "outgoingFreeLimited") {
                        app.notifications.systemMessage("outgoingFreeLimited");
                      }
                    });

                    thisComp.setState({
                      sendingProgress: false,
                    });
                  });
              });
            });
          } else {
            thisComp.setState({
              sendingProgress: false,
            });
            app.notifications.systemMessage("noRecpnts");
          }

          break;
        case "closeCompose":
          app.user.set({ isComposingEmail: false });
          app.user.set({ isDraftOpened: false });
          $("body").removeClass("draft-opened");
          $("#appRightSide").css("display", "none");
          Backbone.history.loadUrl(Backbone.history.fragment);
          break;
        case "confirmDeleteDraft":
          $("#dialogModHead").html("Delete email draft");
          $("#dialogModBody").html("Delete Draft?");
          $("#dialogOk")
            .off("click")
            .on("click", () => {
              this.handleClick("deleteDraft");
            });

          $("#dialogPop").modal("show");
          break;

        case "deleteDraft":
          var thisComp = this;

          // Show the spinner at the beginning of the deletion process
          $("#settings-spinner").removeClass("d-none").addClass("d-block");

          app.user.set({ isComposingEmail: false });
          app.user.set({ isDraftOpened: false });
          $("body").removeClass("draft-opened");
          $("#appRightSide").css("display", "none");

          if (this.state.messageId == "") {
            // No message ID, navigate back to current folder
            Backbone.history.navigate(
              "/mail/" + app.user.get("currentFolder"),
              {
                trigger: true,
              }
            );
            Backbone.history.loadUrl(Backbone.history.fragment);

            // Hide the spinner and the confirmation dialog
            $("#settings-spinner").removeClass("d-block").addClass("d-none");
            $("#dialogPop").modal("hide");
          } else {
            // Function to delete the email after files are removed
            function deleteEmail() {
              var selected = [];
              selected.push(thisComp.state.messageId);

              if (selected.length > 0) {
                // Delete email physically
                app.globalF.resetCurrentMessage();
                app.globalF.resetDraftMessage();

                app.globalF.deleteEmailsFromFolder(
                  selected,
                  function (emails2Delete) {
                    if (emails2Delete.length > 0) {
                      app.userObjects.updateObjects(
                        "deleteEmail",
                        emails2Delete,
                        function (result) {
                          app.globalF.syncUpdates();

                          Backbone.history.navigate(
                            "/mail/" + app.user.get("currentFolder"),
                            {
                              trigger: true,
                            }
                          );
                          Backbone.history.loadUrl(Backbone.history.fragment);

                          // Hide the spinner and the confirmation dialog
                          $("#settings-spinner")
                            .removeClass("d-block")
                            .addClass("d-none");
                          $("#dialogPop").modal("hide");
                        }
                      );
                    } else {
                      // No emails to delete
                      // Hide the spinner and the confirmation dialog
                      $("#settings-spinner")
                        .removeClass("d-block")
                        .addClass("d-none");
                      $("#dialogPop").modal("hide");
                    }
                  }
                );
              } else {
                // No selected emails
                // Hide the spinner and the confirmation dialog
                $("#settings-spinner")
                  .removeClass("d-block")
                  .addClass("d-none");
                $("#dialogPop").modal("hide");
              }
            }

            if (Object.keys(thisComp.state.fileObject).length > 0) {
              var files = Object.keys(thisComp.state.fileObject);
              var filesDeleted = 0;
              var totalFiles = files.length;

              // Remove each file asynchronously
              $.each(files, function (index, fileName64) {
                thisComp.fileRemove(fileName64, function () {
                  filesDeleted++;
                  if (filesDeleted === totalFiles) {
                    // All files have been removed, proceed to delete the email
                    deleteEmail();
                  }
                });
              });
            } else {
              // No files to delete, proceed to delete the email
              deleteEmail();
            }
          }
          break;
      }
    },
    handleEmailHeaderAction: function (i) {
      // switch (i) {
      //   case "maximize":
      //     this.setState({
      //       isMaximized: this.state.isMaximized ? false : true,
      //       isMinimized: false,
      //     });
      //     break;
      //   case "minimize":
      //     this.setState({
      //       isMaximized: false,
      //       isMinimized: this.state.isMinimized ? false : true,
      //     });
      //     break;
      // }
        switch (i) {
          case "maximize":
            this.setState({
              isMaximized: !this.state.isMaximized,
              isMinimized: false,
            });

            this.setState((prevState) => {
              const newIsMaximized = !this.state.isMaximized;
              const newIsMinimized = false;

              return {
                isMaximized: newIsMaximized,
                isMinimized: newIsMinimized,
              };
            }, () => {
              // This callback runs after the state is updated
              // if (this.state.isMaximized) {
              //   document.body.style.overflow = 'hidden';
              // }
            });

            break;

          case "minimize":
            this.setState((prevState) => {
              const newIsMaximized = prevState.isMinimized && this.state.isMobile ? true : false;
              const newIsMinimized = !prevState.isMinimized;

              return {
                isMaximized: newIsMaximized,
                isMinimized: newIsMinimized,
              };
            }, () => {
              if (this.state.isMinimized) {
                document.body.style.overflow = 'auto';
              } else {
                document.body.style.overflow = 'hidden';
              }
            });
            break;
        }


    },
    handleToLabelClick: function () {
      const searchField = document.querySelector(
        "#toRcpt ~ .select2-container .select2-search__field"
      );
      if (searchField) {
        searchField.focus();
      }
    },
    handleSubjectLabelClick: function () {
      const searchField = document.querySelector("#subject");
      if (searchField) {
        searchField.focus();
      }
    },
    handleCcLabelClick: function () {
      const searchField = document.querySelector(
        "#toCCRcpt ~ .select2-container .select2-search__field"
      );
      if (searchField) {
        searchField.focus();
      }
    },
    handleBccLabelClick: function () {
      const searchField = document.querySelector(
        "#toBCCRcpt ~ .select2-container .select2-search__field"
      );
      if (searchField) {
        searchField.focus();
      }
    },
    handlePinLabelClick: function () {
      const searchField = document.querySelector("#pin");
      if (searchField) {
        searchField.focus();
      }
    },
    render: function () {
      var sizeBar = { width: this.state.uploadProgress + "%" };
      var sizeBarText =
        this.state.sizeBarText + " " + this.state.uploadProgress + "%";
      return (
        <div
          className={`compose-email-wrapper ${
            this.state.isMaximized
              ? "compose-maximize"
              : this.state.isMinimized
              ? "compose-minimize"
              : ""
          }${this.state.isMobile ? " mobile" : ""}`}
        >
          {/* <button */}
          {/*   id="dev-test-button" */}
          {/*   style={{ */}
          {/*     position: "fixed", */}
          {/*     bottom: "20px", */}
          {/*     right: "20px", */}
          {/*     zIndex: 999999, */}
          {/*     background: "#fff", */}
          {/*     color: "#000", */}
          {/*     border: "1px solid #ccc", */}
          {/*     padding: "10px 15px", */}
          {/*     cursor: "pointer", */}
          {/*   }} */}
          {/*   onClick={() => { */}
          {/*     app.mailMan.set("webview", !app.mailMan.get("webview")); */}
          {/*     this.setState((prevState) => ({ isMobile: !prevState.isMobile })); */}
          {/*   }} */}
          {/* > */}
          {/*   Tog */}
          {/* </button> */}

          <div className="compose-ec">
            <style>
              {`
                body {
                  overflow: hidden;
                }
                .ck.ck-balloon-panel.ck-balloon-panel_visible.ck-balloon-panel_with-arrow {
                  z-index: 9999 !important;
                }

                /* Non-maximized case */
                ${
                  !this.state.isMaximized
                    ? `
                  .compose-email-wrapper .ck-editor__editable_inline {
                    max-height: 200px;
                  }
                `
                    : ""
                }

                .ck-editor {
                  height: 100% !important;
                  display: flex;
                  flex-direction: column;

                  .ck-editor__top {
                    flex-shrink: 1;
                  }

                  .ck-editor__main {
                    flex-grow: 1;
                    position: relative;

                    ${
                      this.state.isMaximized
                        ? `
                      .ck-editor__editable, .ck-source-editing-area {
                        position: absolute;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                      }
                    `
                        : ""
                    }
                  }
                }
              `}
            </style>

            <input
              type="file"
              id="fileselector"
              name="files"
              className="invisible d-none"
              onChange={this.handleChange.bind(this, "getFile")}
            />
            {/* Compose Window Content */}
            <div
              className={`compose-window ${
                this.state.isMaximized ? "compose-maximize" : ""
              }`}
            >
              {/* Header */}
              <div className="the-header  c-actions">
                <div className="c-title">
                  <h3>New message</h3>
                </div>
                <div className="c-actions">
                  <button
                    type="button"
                    onClick={this.handleEmailHeaderAction.bind(
                      this,
                      "minimize"
                    )}
                    // className={this.state.isMobile ? "d-none" : ""}
                    className={this.state.isMobile ? "" : ""}
                  >
                    <span
                      className={`icon ${
                        this.state.isMinimized ? "d-none" : ""
                      }`}
                    >
                      <svg
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 41.5v-3h24.05v3Z" />
                      </svg>
                    </span>
                    <span
                      className={`icon ${
                        this.state.isMinimized ? "d-block" : "d-none"
                      }`}
                    >
                      <svg
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5.95 9.5v-3H42v3Z" />
                      </svg>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={this.handleEmailHeaderAction.bind(
                      this,
                      "maximize"
                    )}
                    className={`${this.state.isMobile ? "d-none" : ""}`}
                  >
                    <span
                      className={`icon type-max-min ${
                        this.state.isMaximized ? "d-none" : ""
                      }`}
                    >
                      <svg
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 42V27h3v9.9L36.9 9H27V6h15v15h-3v-9.9L11.1 39H21v3Z" />
                      </svg>
                    </span>
                    <span
                      className={`icon type-max-min ${
                        this.state.isMaximized ? "d-block" : "d-none"
                      }`}
                    >
                      <svg
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.1 42 6 39.9l10.7-10.7h-5.9v-3h11v11h-3v-5.9Zm18.15-20.25v-11h3v5.9L39.9 6 42 8.1 31.35 18.75h5.9v3Z" />
                      </svg>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={this.handleClick.bind(this, "closeCompose")}
                    disabled={this.state.sendingProgress}
                  >
                    <span className="icon">
                      <svg
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Compose Body */}
              <div className="compose-body">
                <div className="the-content">
                  <div className="com-content-header">
                    <div className="he-header-wrap">
                      <div className="he-item">
                        <span className="he-label">From:</span>
                        <div className="inputs-wrap">
                          <select
                            id="fromSender"
                            value={this.state.fromEmail}
                            onChange={this.handleChange.bind(
                              this,
                              "fromSelecting"
                            )}
                          >
                            {this.state.fromOptions}
                          </select>
                          <div className="com-cc-bcc-buttons">
                            <button
                              type="button"
                              onClick={this.handleClick.bind(this, "showCC")}
                            >
                              Cc
                            </button>
                            <button
                              type="button"
                              onClick={this.handleClick.bind(this, "showBCC")}
                            >
                              Bcc
                            </button>
                            <button
                              type="button"
                              onClick={this.handleClick.bind(this, "showPin")}
                            >
                              PIN
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={`he-item`}>
                        <span
                          className="he-label"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleToLabelClick}
                        >
                          To:
                        </span>
                        <div className="inputs-wrap">
                          <select
                            className="form-control"
                            id="toRcpt"
                            multiple="multiple"
                          ></select>
                        </div>
                      </div>
                      <div className={`he-item ${this.state.showCC}`}>
                        <span
                          className="he-label"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleCcLabelClick}
                        >
                          CC:
                        </span>
                        <div className="inputs-wrap">
                          <select
                            className="form-control"
                            id="toCCRcpt"
                            multiple="multiple"
                          ></select>
                        </div>
                      </div>
                      <div className={`he-item ${this.state.showBCC}`}>
                        <span
                          className="he-label"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleBccLabelClick}
                        >
                          BCC:
                        </span>
                        <div className="inputs-wrap">
                          <select
                            className="form-control"
                            id="toBCCRcpt"
                            multiple="multiple"
                          ></select>
                        </div>
                      </div>
                      <div className={`he-item ${this.state.showAtt}`}>
                        <span className="he-label">
                          <span className="the-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                              />
                            </svg>
                          </span>
                        </span>
                        <div className="inputs-wrap">
                          <select
                            className="form-control attachFiles"
                            id="atachFiles"
                            multiple="multiple"
                          ></select>
                        </div>
                      </div>
                      <div
                        className={
                          "modal-body he-item att-bar " +
                          this.state.showUploadBar
                        }
                      >
                        <div className="form-group">
                          <div
                            className="bs-example"
                            data-example-id="progress-bar-with-label"
                          >
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="60"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={sizeBar}
                              >
                                {sizeBarText}{" "}
                                <i className="fa fa-refresh fa-spin"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`he-item ${this.state.showPin}`}>
                        <span
                          className="he-label"
                          style={{ cursor: "pointer" }}
                          onClick={this.handlePinLabelClick}
                        >
                          PIN:
                        </span>
                        <div className="inputs-wrap">
                          <input
                            type="text"
                            className="form-control"
                            id="pin"
                            placeholder="PIN"
                            value={this.state.pinText}
                            onChange={this.handleChange.bind(
                              this,
                              "enterPinText"
                            )}
                          />
                        </div>
                      </div>
                      <div className="he-item">
                        <span
                          className="he-label"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleSubjectLabelClick}
                        >
                          Subject:
                        </span>
                        <div className="inputs-wrap">
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            value={this.state.subject}
                            onChange={this.handleChange.bind(
                              this,
                              "enterSubject"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="com-content-editor">
                    <div id="composeEmail"></div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="compose-footer p-3 bg-white">
                {/* Buttons */}
                <div className="c-editor-actions">
                  <div className="c-editor-send-actions d-flex justify-content-between align-items-center">
                    {/* Left side: Delete button */}
                    <div>
                      <button
                        type="submit"
                        className="delete-draft btn"
                        onClick={this.handleClick.bind(
                          this,
                          "confirmDeleteDraft"
                        )}
                        disabled={this.state.sendingProgress}
                      >
                        <span className="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>

                    {/* Right side: Attach and Send buttons */}
                    <div className="d-flex align-items-center">
                      <button
                        type="button"
                        className="attach-button btn me-3"
                        onClick={this.handleClick.bind(this, "attachFile")}
                      >
                        <span className="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21.586 10.461l-10.05 10.075c-1.95 1.949-5.122 1.949-7.071 0s-1.95-5.122 0-7.072l10.628-10.585c1.17-1.17 3.073-1.17 4.243 0 1.169 1.17 1.17 3.072 0 4.242l-8.507 8.464c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414l7.093-7.05-1.415-1.414-7.093 7.049c-1.172 1.172-1.171 3.073 0 4.244s3.071 1.171 4.242 0l8.507-8.464c.977-.977 1.464-2.256 1.464-3.536 0-2.769-2.246-4.999-5-4.999-1.28 0-2.559.488-3.536 1.465l-10.627 10.583c-1.366 1.368-2.05 3.159-2.05 4.951 0 3.863 3.13 7 7 7 1.792 0 3.583-.684 4.95-2.05l10.05-10.075-1.414-1.414z" />
                          </svg>
                        </span>
                      </button>
                      <button
                        type="submit"
                        className="send-email-button btn btn-primary ml-2"
                        disabled={this.state.sendingProgress}
                        onClick={this.handleClick.bind(this, "sendEmail")}
                      >
                        {this.state.sendingProgress
                          ? "Sending..."
                          : "Send email"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });
});
