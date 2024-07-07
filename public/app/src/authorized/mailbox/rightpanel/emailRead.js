define(["react", "app"], function (React, app) {
    return React.createClass({
        mixins: [app.mixins.touchMixins()],
        getInitialState: function () {
            return {
                from: "",
                realSender:"",
                mFromColor:"#2277F6",
                domainWarning:false,
                fromExtra: "",
                to: "",
                cc: "",
                bcc: "",
                pin: "",
                subject: "",
                dmarc: "",
                header: "",
                timeSent: "",
                type: "",
                attachment: {},
                hideEmailRead: true,
                renderButtonClass: "",
                rawHeadVisible: "",
                toggleHTMLtext: "html",
                renderFull: false,
                pgpEncrypted: false,
                decryptedEmail: false,
                emailLoading: app.user.get("isDecryptingEmail"),
                pinTop: 0,
            };
        },
        componentWillUnmount: function () {
            this.setState({
                hideEmailRead: true,
                emailLoading: false,
                decryptedEmail: false,
            });
            app.user.off("change:currentMessageView");
            app.globalF.resetCurrentMessage();
            clearTimeout(app.user.get("emailOpenTimeOut"));
            // $('[data-toggle="popover-hover"]').popover("hide");
        },
        componentDidMount: function () {
            var thisComp = this;
            // $("#sdasdasd").addClass("hidden"); - [NEW VERSION AVAILABLE BUTTON]
            app.user.on(
                "change:currentMessageView",
                function () {
                    thisComp.setState({
                        from: "",
                        realSender:"",
                        domainWarning:false,
                        mFromColor:"#2277F6",
                        fromExtra: "",
                        to: "",
                        cc: "",
                        bcc: "",
                        pin: "",
                        subject: "",
                        dmarc: "",
                        header: "",
                        timeSent: "",
                        type: "",
                        attachment: {},
                        hideEmailRead: true,
                        renderButtonClass: "",
                        rawHeadVisible: "",
                        toggleHTMLtext: "html",
                        renderFull: false,
                        pgpEncrypted: false,
                        decryptedEmail: false,
                        emailLoading: app.user.get("isDecryptingEmail"),
                        pinTop: 0,
                    });

                    this.renderEmail();
                },
                this
            );

            $("#virtualization")
                .contents()
                .find("html")
                .append(
                    "<style>table,table tbody,table tr,table td{display:block;width:100%;}</style>"
                );
        },
        getTagColor: function (tagName) {
            var colorCode = `#c9d0da`;
            $.each(app.user.get("tags"), function (index, labelData) {
                if (tagName === app.transform.from64str(index)) {
                    colorCode = labelData.color;
                }
            });
            return colorCode;
        },
        getTagsList: function () {
            var labels = [];

            var thisComp = this;
            $.each(app.user.get("tags"), function (index, labelData) {
                labels.push(
                    <li key={index}>
                        <a
                            id={index + "3"}
                            onClick={thisComp.handleChange.bind(
                                thisComp,
                                "assignLabel"
                            )}
                            value={index}
                            className={
                                thisComp.state.tag ===
                                app.transform.from64str(index)
                                    ? "active"
                                    : ""
                            }
                        >
                            <span className="icon">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M13.5119 9.2475L12.5969 8.3325C12.3794 8.145 12.2519 7.8675 12.2444 7.56C12.2294 7.2225 12.3644 6.885 12.6119 6.6375L13.5119 5.7375C14.2919 4.9575 14.5844 4.2075 14.3369 3.615C14.0969 3.03 13.3544 2.7075 12.2594 2.7075H4.42187V2.0625C4.42187 1.755 4.16687 1.5 3.85937 1.5C3.55187 1.5 3.29688 1.755 3.29688 2.0625V15.9375C3.29688 16.245 3.55187 16.5 3.85937 16.5C4.16687 16.5 4.42187 16.245 4.42187 15.9375V12.2775H12.2594C13.3394 12.2775 14.0669 11.9475 14.3144 11.355C14.5619 10.7625 14.2769 10.02 13.5119 9.2475Z"
                                        fill={labelData.color}
                                    />
                                </svg>
                            </span>
                            <span>{app.transform.from64str(index)}</span>
                            <span className="tick-icon">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.17188 10.0416L6.35369 13.1666L14.8385 4.83325"
                                        stroke="#2277F6"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </a>
                    </li>
                );
            });
            return labels;
        },
        verifySignature: function () {
            var thisComp = this;
            var from = app.transform.from64str(
                app.user.get("currentMessageView")["meta"]["from"]
            );

            var fromEmail = app.globalF.getEmailsFromString(from);

            var post = {
                mails: JSON.stringify([app.transform.SHA512(fromEmail)]),
            };

            var options = [];

            var trusted = app.user.get("trustedSenders");

            if (
                trusted.indexOf(
                    app.transform.SHA256(
                        app.globalF.parseEmail(fromEmail)["email"]
                    )
                ) !== -1
            ) {
                thisComp.setState({
                    signatureHeader: [],
                });
            } else {
                app.serverCall.ajaxRequest(
                    "retrievePublicKeys",
                    post,
                    function (result) {
                        if (result["response"] == "success") {
                            if (Object.keys(result["data"]).length > 0) {
                                var senderPK =
                                    result["data"][
                                        app.transform.SHA512(fromEmail)
                                    ]["mailKey"];
                                var emailVersion =
                                    app.user.get("currentMessageView")[
                                        "version"
                                    ];

                                if (
                                    app.globalF.verifySignature(
                                        senderPK,
                                        emailVersion
                                    ) === true
                                ) {
                                    options.push(
                                        <div
                                            key="sig1"
                                            className="alert alert-success pgpsignature-success"
                                        >
                                            <i className="fa-fw fa fa-check"></i>{" "}
                                            <strong>Signature verified</strong>{" "}
                                            To learn more about{" "}
                                            <strong>
                                                <a
                                                    href="https://blog.mailum.com/signatures"
                                                    target="_blank"
                                                >
                                                    signatures
                                                </a>
                                            </strong>
                                            . Link will be open in new tab
                                        </div>
                                    );
                                    thisComp.setState({
                                        signatureHeader: options,
                                    });
                                } else if (
                                    app.globalF.verifySignature(
                                        senderPK,
                                        emailVersion
                                    ) === false
                                ) {
                                    options.push(
                                        <div
                                            key="sig1"
                                            className="alert alert-danger pgpsignature-danger"
                                        >
                                            <i className="fa-fw fa fa-times"></i>{" "}
                                            <strong>Signature mismatch</strong>{" "}
                                            To learn more about{" "}
                                            <strong>
                                                <a
                                                    href="https://blog.mailum.com/signatures"
                                                    target="_blank"
                                                >
                                                    signatures
                                                </a>
                                            </strong>
                                            . Link will be open in new tab
                                        </div>
                                    );
                                    thisComp.setState({
                                        signatureHeader: options,
                                    });
                                } else if (
                                    app.globalF.verifySignature(
                                        senderPK,
                                        emailVersion
                                    ) == "old"
                                ) {
                                }
                            } else {
                                options.push(
                                    <div
                                        key="sig1"
                                        className="alert alert-warning pgpsignature-warning"
                                    >
                                        <i className="fa-fw fa fa-warning"></i>{" "}
                                        <strong>
                                            Signature can not be verified
                                        </strong>{" "}
                                        To learn more about{" "}
                                        <strong>
                                            <a
                                                href="https://blog.mailum.com/email-signatures"
                                                target="_blank"
                                            >
                                                signatures
                                            </a>
                                        </strong>
                                        . Link will be open in new tab
                                    </div>
                                );
                                thisComp.setState({
                                    signatureHeader: options,
                                });
                            }
                        }
                    }
                );
            }
        },
        renderEmail: function () {
            if (
                app.user.get("currentMessageView")["id"] !== undefined &&
                app.user.get("currentMessageView")["id"] !== ""
            ) {
                //console.log(app.user.get("currentMessageView"));
                clearTimeout(app.user.get("emailOpenTimeOut"));

                var email = app.user.get("currentMessageView");
                // console.log(email);

                var from2 = [];
                var from = app.transform.from64str(email["meta"]["from"]);
                var realSender=email["meta"]["realSender"]==undefined?from:app.transform.from64str(email["meta"]["realSender"]);

                var testFrom=app.globalF.parseEmail(from,"",)['email'];
                var fromDomain=app.globalF.getEmailDomain(testFrom);

                var testSReal=app.globalF.parseEmail(realSender,"",)['email'];
                var RealSDomain=app.globalF.getEmailDomain(testSReal);

                this.setState({

                    realSender: email["meta"]["realSender"]==undefined?from:app.transform.from64str(email["meta"]["realSender"]),
                    mFromColor:fromDomain!=RealSDomain?"#c71c36":this.state.mFromColor,
                    domainWarning:fromDomain!=RealSDomain
                });


                var emailAddress = "";

                if (
                    app.globalF.parseEmail(from)["name"] !=
                    app.globalF.parseEmail(from)["email"]
                ) {
                    from2.push(
                        <span key="ab">
                            <b key="bc">
                                {app.globalF.parseEmail(from)["name"]}
                            </b>
                            {"<" + app.globalF.parseEmail(from)["email"] + ">"}
                        </span>
                    );
                } else {
                    from2.push(
                        <span key="ab">
                            {app.globalF.parseEmail(from)["email"]}
                        </span>
                    );
                }

                var fromExtra = "";

                if (email["meta"]["fromExtra"] != "") {
                    if (app.transform.check64str(email["meta"]["fromExtra"])) {
                        fromExtra = filterXSS(
                            app.transform.from64str(email["meta"]["fromExtra"])
                        );
                    } else {
                        fromExtra = filterXSS(email["meta"]["fromExtra"]);
                    }
                }

                var to = [];
                var cc = [];
                var bcc = [];

                var emailsTo = email["meta"]["to"];
                var emailsCC =
                    email["meta"]["toCC"] != undefined
                        ? email["meta"]["toCC"]
                        : [];
                var emailsBCC =
                    email["meta"]["toBCC"] != undefined
                        ? email["meta"]["toBCC"]
                        : [];

                emailAddress = app.globalF.exctractOwnEmail(emailsTo);

                if (emailAddress === false) {
                    emailAddress = app.globalF.exctractOwnEmail(emailsCC);
                }

                var pins = "";
                var pin = [];

                if (
                    email["meta"]["version"] == 2 &&
                    email["meta"]["pin"] != ""
                ) {
                    console.log(email["meta"]["pin"])
                    pin.push(
                        <span className="pinHeader email-head" key="pin2">
                            PIN:{" "}
                            <span
                                className="label label-success"
                                key="pinLabel2"
                            >
                                {app.transform.from64str(email["meta"]["pin"])}
                            </span>
                        </span>
                    );
                } else if (
                    email["meta"]["pin"] != undefined &&
                    email["meta"]["pin"] != ""
                ) {
                    pins = JSON.parse(email["meta"]["pin"]);
                }

                $.each(emailsTo, function (index, folderData) {
                    folderData = app.transform.from64str(folderData);

                    if (emailsTo.length <= 3) {
                        if (
                            pins[app.globalF.parseEmail(folderData)["email"]] !=
                            undefined
                        ) {
                            var lock = <i className="fa fa-lock"></i>;
                            var title =
                                '<i class="fa fa-lock"></i> ' +
                                app.transform.from64str(
                                    pins[
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    ]["pin"]
                                );
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }
                    } else {
                        if (
                            pins[app.globalF.parseEmail(folderData)["email"]] !=
                            undefined
                        ) {
                            var lock = <i className="fa fa-lock"></i>;
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"] +
                                "<br/>" +
                                '<i class="fa fa-lock"></i> ' +
                                app.transform.from64str(
                                    pins[
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    ]["pin"]
                                );
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }
                    }

                    if (
                        app.globalF.parseEmail(folderData)["name"] !=
                        app.globalF.parseEmail(folderData)["email"]
                    ) {
                        to.push(
                            <span
                                key={index}
                                className="" // badge light email-head
                                data-placement="bottom"
                                data-toggle="popover-hover"
                                title=""
                                data-content={title}
                            >
                                {lock}{" "}
                                <b key={index + "b"}>
                                    {app.globalF.parseEmail(folderData)["name"]}
                                </b>
                                {emailsTo.length <= 3
                                    ? " <" +
                                      app.globalF.parseEmail(folderData)[
                                          "email"
                                      ] +
                                      ">"
                                    : ""}
                            </span>
                        );
                    } else {
                        to.push(
                            <span
                                key={index}
                                className="" // badge light email-head
                                data-placement="bottom"
                                data-toggle="popover-hover"
                                title=""
                                data-content={title}
                            >
                                {lock}{" "}
                                {app.globalF.parseEmail(folderData)["email"]}
                            </span>
                        );
                    }
                });

                if (emailsCC.length > 0) {
                    $.each(emailsCC, function (index, folderData) {
                        folderData = app.transform.from64str(folderData);

                        if (emailsCC.length <= 1) {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }

                        if (
                            app.globalF.parseEmail(folderData)["name"] !=
                            app.globalF.parseEmail(folderData)["email"]
                        ) {
                            cc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    <b key={index + "b"}>
                                        {
                                            app.globalF.parseEmail(folderData)[
                                                "name"
                                            ]
                                        }
                                    </b>
                                    {emailsCC.length <= 1
                                        ? " <" +
                                          app.globalF.parseEmail(folderData)[
                                              "email"
                                          ] +
                                          ">"
                                        : ""}
                                </span>
                            );
                        } else {
                            cc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    {
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    }
                                </span>
                            );
                        }
                    });
                }

                if (emailsBCC.length > 0) {
                    $.each(emailsBCC, function (index, folderData) {
                        folderData = app.transform.from64str(folderData);

                        if (emailsCC.length <= 3) {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        } else {
                            var lock = "";
                            var title =
                                '<i class="fa fa-envelope-o"></i> ' +
                                app.globalF.parseEmail(folderData)["email"];
                        }

                        if (
                            app.globalF.parseEmail(folderData)["name"] !=
                            app.globalF.parseEmail(folderData)["email"]
                        ) {
                            bcc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    <b key={index + "b"}>
                                        {
                                            app.globalF.parseEmail(folderData)[
                                                "name"
                                            ]
                                        }
                                    </b>
                                    {emailsCC.length <= 3
                                        ? " <" +
                                          app.globalF.parseEmail(folderData)[
                                              "email"
                                          ] +
                                          ">"
                                        : ""}
                                </span>
                            );
                        } else {
                            bcc.push(
                                <span
                                    key={index}
                                    className="" // badge light email-head
                                    data-placement="bottom"
                                    data-toggle="popover-hover"
                                    title=""
                                    data-content={title}
                                >
                                    {lock}{" "}
                                    {
                                        app.globalF.parseEmail(folderData)[
                                            "email"
                                        ]
                                    }
                                </span>
                            );
                        }
                    });
                }
                var message = app.user.get("emails")["messages"][email["id"]];
                if (message["st"] == 0) {
                    var setOpen = setTimeout(function () {
                        message["st"] = message["st"] == 0 ? 3 : message["st"];

                        app.userObjects.updateObjects(
                            "folderUpdate",
                            "",
                            function (result) {
                                app.globalF.syncUpdates(true);
                            }
                        );
                    }, 1000);
                } else {
                    var setOpen = {};
                }

                this.setState({
                    emailAddress: emailAddress,
                    fromExtra: fromExtra,
                    from: from2,
                    to: to,
                    cc: cc,
                    bcc: bcc,
                    pin: pin,
                    subject: app.transform.from64str(email["meta"]["subject"]),
                    dmarc: "",
                    header: "",
                    timeSent: new Date(
                        parseInt(email["meta"]["timeSent"] + "000")
                    ).toLocaleString(),
                    type: "",
                    tag:
                        app.user.get("emails")["messages"][email["id"]]["tg"]
                            .length > 0
                            ? app.transform.from64str(
                                  app.user.get("emails")["messages"][
                                      email["id"]
                                  ]["tg"][0]["name"]
                              )
                            : "",
                    emailBody: app.transform.from64str(email["body"]["html"]),
                    emailBodyTXT: app.transform.from64str(
                        email["body"]["text"]
                    ),
                    attachment: email["attachment"],
                    rawHeadVisible:
                        email["originalBody"]["rawHeader"] == undefined
                            ? "hidden"
                            : "",
                    toggleHTMLtext: "html",
                    pgpEncrypted: email["pgpEncrypted"],
                    hideEmailRead: false,
                    pinTop: email["meta"]["pinTop"],
                });

                if (message["tp"] == 2) {
                    this.renderFull();
                    this.setState({
                        renderButtonClass: "d-none",
                    });
                } else {
                    this.renderStrictBody();
                }
                this.setState({
                    hideEmailRead: false,
                });
                this.verifySignature();
            } else {
                this.setState({
                    hideEmailRead: true,
                });
            }

            app.layout.display("readEmail");

            // $('[data-toggle="popover-hover"]').on(
            //     "shown.bs.popover",
            //     function () {
            //         var $pop = $(this);
            //         setTimeout(function () {
            //             $pop.popover("hide");
            //         }, 5000);
            //     }
            // );
        },
        displayAttachments: function () {
            var attachments = [];
            var files = [];
            var thisComp = this;

            if (Object.keys(this.state.attachment).length > 0) {
                if (this.state.decryptedEmail) {
                    var size = 0;
                    $.each(this.state.attachment, function (index, attData) {
                        size += attData["contents"].length;

                        files.push(
                            <span className="clearfix" key={"a" + index}>
                                <br />
                                <span className="attchments" key={"as" + index}>
                                    {attData["fileName"]}
                                </span>
                                <button
                                    key={"ab" + index}
                                    id={index}
                                    className="btn btn-sm btn-primary pull-right"
                                    onClick={thisComp.handleClick.bind(
                                        thisComp,
                                        "downloadFileDecrypted"
                                    )}
                                >
                                    Download
                                </button>
                            </span>
                        );
                    });
                } else {
                    var size = 0;
                    $.each(this.state.attachment, function (index, attData) {
                        size += parseInt(
                            app.transform.from64str(attData["size"])
                        );

                        if (attData["isPgp"]) {
                            files.push(
                                <span className="clearfix" key={"a" + index}>
                                    <br />
                                    <span
                                        className="attchments"
                                        key={"as" + index}
                                    >
                                        {app.transform.from64str(
                                            attData["name"]
                                        )}
                                    </span>

                                    <div
                                        className="btn-group pull-right"
                                        key={"abc" + index}
                                    >
                                        <button
                                            type="button"
                                            id={index}
                                            className="btn btn-primary"
                                            key={"abcd" + index}
                                            onClick={thisComp.handleClick.bind(
                                                thisComp,
                                                "downloadFile"
                                            )}
                                        >
                                            Download
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <span className="caret"></span>
                                            <span className="sr-only">
                                                Toggle Dropdown
                                            </span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li
                                                onClick={thisComp.handleClick.bind(
                                                    thisComp,
                                                    "downloadFilePGP"
                                                )}
                                            >
                                                <a href="javascript:void(0);">
                                                    Decrypt & Display
                                                </a>
                                            </li>
                                            <li
                                                onClick={thisComp.handleClick.bind(
                                                    thisComp,
                                                    "downloadFilePGP"
                                                )}
                                            >
                                                <a href="javascript:void(0);">
                                                    Decrypt & Download
                                                </a>
                                            </li>
                                            <li
                                                role="separator"
                                                className="divider"
                                            ></li>
                                            <li
                                                onClick={thisComp.handleClick.bind(
                                                    thisComp,
                                                    "downloadFile"
                                                )}
                                            >
                                                <a href="javascript:void(0);">
                                                    Download
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </span>
                            );
                        } else {
                            files.push(
                                <span className="clearfix" key={"a" + index}>
                                    <br />
                                    <span
                                        className="attchments"
                                        key={"as" + index}
                                    >
                                        {app.transform.from64str(
                                            attData["name"]
                                        )}
                                    </span>
                                    <button
                                        key={"ab" + index}
                                        id={index}
                                        className="btn btn-sm btn-primary pull-right"
                                        onClick={thisComp.handleClick.bind(
                                            thisComp,
                                            "downloadFile"
                                        )}
                                    >
                                        Download
                                    </button>
                                </span>
                            );
                        }
                    });
                }

                size =
                    size > 1000000
                        ? Math.round(size / 10000) / 100 + " Mb"
                        : Math.round(size / 10) / 100 + " Kb";

                attachments.push(
                    <div className="panel-footer" key="1">
                        <h5>
                            Attchments (
                            {Object.keys(this.state.attachment).length} file(s),{" "}
                            {size})
                        </h5>
                        <div className="alert alert-warning text-left" key="2">
                            Please use <b>EXTREME</b> caution when downloading
                            files. We strongly recommend scanning them for
                            viruses/malware after downloading.
                        </div>
                        <div className="inbox-download"></div>

                        {files}
                    </div>
                );
            }

            return attachments;
        },

        handleChange: function (i, event) {
            switch (i) {
                case "removeTag":
                    var emailId = app.user.get("currentMessageView")["id"];
                    var message = app.user.get("emails")["messages"][emailId];
                    message["tg"] = [];
                    var thisComp = this;

                    app.userObjects.updateObjects(
                        "folderUpdate",
                        "",
                        function (result) {
                            app.globalF.syncUpdates();
                            thisComp.setState({
                                tag: "",
                            });
                        }
                    );

                    break;

                case "assignLabel":
                    var thisComp = this;
                    var emailId = app.user.get("currentMessageView")["id"];
                    var message = app.user.get("emails")["messages"][emailId];

                    message["tg"] = [];

                    if (
                        this.state.tag ===
                        app.transform.from64str($(event.target).attr("value"))
                    ) {
                        // same tag is being clicked, so remove it by leaving out the tag array as blank
                        // update local state
                        thisComp.setState({
                            tag: "",
                        });
                        thisComp.handleChange("removeTag");
                    } else {
                        message["tg"].push({
                            name: $(event.target).attr("value"),
                        });
                        var name = $(event.target).attr("value");
                        app.userObjects.updateObjects(
                            "folderUpdate",
                            "",
                            function (result) {
                                app.globalF.syncUpdates();

                                thisComp.setState({
                                    tag: app.transform.from64str(name),
                                });
                            }
                        );
                    }

                    break;
            }
        },
        getSelected: function () {
            var selected = [];

            selected = Object.keys(app.user.get("selectedEmails"));

            if (selected.length == 0) {
                var item = $("#emailListTable tr.selected").attr("id");
                if (item != undefined) {
                    selected.push(item);
                }
            }
            return selected;
        },

        handleClick: function (i, event) {
            switch (i) {
                case "downloadFilePGP":
                    var fileButton = $(event.target);
                    var email = app.user.get("currentMessageView");
                    var emailAttachments = email["attachment"];
                    var fileBId = fileButton
                        .parent()
                        .parent()
                        .parent()
                        .children()
                        .attr("id");

                    var thisComp = this;

                    if (email["version"] === 15) {
                        var fileName = app.transform.SHA512(
                            emailAttachments[fileBId]["fileName"] +
                                app.user.get("userId")
                        );
                        var modKey = "none";
                        var version = 15;
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                    } else if (email["version"] === 2) {
                        var fileName = emailAttachments[fileBId]["fileName"];
                        var modKey = emailAttachments[fileBId]["modKey"];
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                        var version = 2;
                    }

                    var type = app.transform.from64str(
                        emailAttachments[fileBId]["type"]
                    );
                    var size = app.transform.from64str(
                        emailAttachments[fileBId]["size"]
                    );
                    var name = app.transform.from64str(
                        emailAttachments[fileBId]["name"]
                    );

                    fileButton
                        .parent()
                        .parent()
                        .parent()
                        .children(":first")
                        .html(
                            '<i class="fa fa-spin fa-refresh"></i> Downloading'
                        );

                    app.globalF.downloadFile(
                        fileName,
                        modKey,
                        version,
                        function (result) {
                            fileButton
                                .parent()
                                .parent()
                                .parent()
                                .children(":first")
                                .html("Download");
                            var decryptedFile64 = app.transform.fromAesBin(
                                key,
                                result
                            );
                            var decryptedFile =
                                app.transform.from64bin(decryptedFile64);

                            thisComp.readPGP(decryptedFile);
                        }
                    );

                    break;

                case "detectDirection":
                    var arrow = $(".navArrow1");

                    app.layout.display("left");

                    break;

                case "downloadFileDecrypted":
                    var fileButton = $(event.target);
                    var emailAttachments = this.state.attachment;
                    var fileBId = fileButton.attr("id");
                    var file = emailAttachments[fileBId];

                    var content =
                        file["encoding"] === "base64"
                            ? app.transform.from64bin(file["contents"])
                            : file["contents"];

                    var arbuf = app.globalF.base64ToArrayBuffer(content);

                    var type = file["contentType"];
                    var size =
                        file["encoding"] === "base64"
                            ? app.transform.from64bin(file["contents"]).length
                            : file["contents"].length;
                    var name = file["fileName"];

                    app.globalF.createDownloadLink(arbuf, type, name);

                    break;

                case "downloadFile":
                    var fileButton = $(event.target);
                    var email = app.user.get("currentMessageView");
                    var emailAttachments = email["attachment"];
                    var fileBId = fileButton.attr("id");

                    if (email["version"] === 15) {
                        var fileName = app.transform.SHA512(
                            emailAttachments[fileBId]["fileName"] +
                                app.user.get("userId")
                        );

                        var modKey = "none";
                        var version = 15;
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                    } else if (email["version"] === 2) {
                        var fileName = emailAttachments[fileBId]["fileName"];
                        var modKey = emailAttachments[fileBId]["modKey"];
                        var key = app.transform.from64bin(
                            emailAttachments[fileBId]["key"]
                        );
                        var version = 2;
                    } else if (
                        email["version"] == undefined ||
                        email["version"] === 1
                    ) {
                        var fileName = app.transform.from64str(
                            emailAttachments[fileBId]["filename"]
                        );
                        var version = 1;
                        var modKey = "none";

                        var message =
                            app.user.get("emails")["messages"][
                                app.user.get("currentMessageView")["id"]
                            ];

                        var key = app.transform.from64bin(message["p"]);
                    }

                    var type = app.transform.from64str(
                        emailAttachments[fileBId]["type"]
                    );
                    var size = app.transform.from64str(
                        emailAttachments[fileBId]["size"]
                    );
                    var name = app.transform.from64str(
                        emailAttachments[fileBId]["name"]
                    );

                    fileButton.html(
                        '<i class="fa fa-spin fa-refresh"></i> Downloading'
                    );

                    var thisComp = this;

                    app.globalF.downloadFile(
                        fileName,
                        modKey,
                        version,
                        function (result) {
                            if (result === false) {
                                fileButton.html("Download");
                            } else {
                                fileButton.html("Download");

                                var decryptedFile64 = app.transform.fromAesBin(
                                    key,
                                    result
                                );
                                var decryptedFile =
                                    app.transform.from64bin(decryptedFile64);

                                var arbuf =
                                    app.globalF.base64ToArrayBuffer(
                                        decryptedFile
                                    );
                                app.globalF.createDownloadLink(
                                    arbuf,
                                    type,
                                    name
                                );
                            }
                        }
                    );

                    break;

                case "email":
                    $("#col1").toggleClass("hide");
                    $("#view-mail-wrapper").toggleClass("visible-lg");

                    break;
                case "emailBig":
                    $("#view-mail-wrapper").toggleClass("col-lg-6 auto");
                    $("#col1").toggleClass("hide");
                    $(".fa-chevron-left").toggleClass("fa-rotate-180");

                    break;

                case "addNewTag":
                    Backbone.history.navigate("/settings/Folders", {
                        trigger: true,
                    });
                    break;

                case "reply":
                    if (this.state.renderFull) {
                        app.globalF.reply("replyFull");
                    } else {
                        app.globalF.reply("replyStrict");
                    }

                    // Backbone.history.navigate("/mail/Compose", {
                    //     trigger: true,
                    // });
                    app.user.set({ isComposingEmail: true });
                    app.user.set({ composeOriginate: 'reply' });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;

                case "replyAll":
                    if (this.state.renderFull) {
                        app.globalF.reply("replyAFull");
                    } else {
                        app.globalF.reply("replyAStrict");
                    }

                    // Backbone.history.navigate("/mail/Compose", {
                    //     trigger: true,
                    // });
                    app.user.set({ isComposingEmail: true });
                    app.user.set({ composeOriginate: 'reply' });
                    Backbone.history.loadUrl(Backbone.history.fragment);
                    break;
                case "forward":
                    if (this.state.renderFull) {
                        app.globalF.reply("forwardFull");
                    } else {
                        app.globalF.reply("forwardStrict");
                    }

                    // Backbone.history.navigate("/mail/Compose", {
                    //     trigger: true,
                    // });
                    app.user.set({ isComposingEmail: true });
                    app.user.set({ composeOriginate: 'forward' });
                    Backbone.history.loadUrl(Backbone.history.fragment);
                    break;

                case "renderImages":
                    this.renderFull();
                    this.setState({
                        renderButtonClass: "d-none",
                    });

                    break;

                case "decryptPGP":
                    var thisComp = this;
                    if (this.state.emailBody.length == 0) {
                        thisComp.readPGP(this.state.emailBodyTXT);
                    } else {
                        thisComp.readPGP(this.state.emailBody);
                    }

                    break;

                case "showHeader":
                    var w = window.open();
                    var html =
                        "<pre " +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' +
                        app.transform.escapeTags(
                            app.transform.from64str(
                                app.user.get("currentMessageView")[
                                    "originalBody"
                                ]["rawHeader"]
                            )
                        ) +
                        "<pre>";
                    html +=
                        "------ HTML ---------" +
                        "<br /><pre " +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' +
                        app.transform.escapeTags(
                            app.transform.from64str(
                                app.user.get("currentMessageView")[
                                    "originalBody"
                                ]["body"]["html"]
                            )
                        ) +
                        "<pre><br />------END HTML ---------<br /><br />";
                    html +=
                        "------ TEXT ---------" +
                        "<br /><pre " +
                        'style="white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;">' +
                        app.transform.escapeTags(
                            app.transform.from64str(
                                app.user.get("currentMessageView")[
                                    "originalBody"
                                ]["body"]["text"]
                            )
                        ) +
                        "<pre><br />------ END TEXT ---------";
                    $(w.document.body).html(html);
                    break;

                case "pinToTop":
                    var thisComp = this;
                    if (
                        app.user.get("currentMessageView")["id"] !==
                            undefined &&
                        app.user.get("currentMessageView")["id"] !== ""
                    ) {
                        thisComp.setState({
                            isWorkingFlag: true,
                        });
                        var messages = app.user.get("emails")["messages"];
                        var email = app.user.get("currentMessageView");
                        var emailId = email["id"];

                        const pinnedTop = this.state.pinTop;
                        const pinnedRowNumber = this.state.pinRowNumber;

                        var updatePinToTop = setTimeout(function () {
                            if (parseInt(pinnedTop) < 0) {
                                messages[emailId]["pt"] =
                                    email["meta"]["timeSent"];
                                thisComp.setState({
                                    pinTop: 0,
                                });
                            } else {
                                messages[emailId]["pt"] = -1;
                                thisComp.setState({
                                    pinTop: -1,
                                });
                            }

                            app.userObjects.updateObjects(
                                "folderUpdate",
                                "",
                                function (result) {
                                    app.globalF.syncUpdates();
                                    thisComp.setState({
                                        isWorkingFlag: false,
                                    });
                                }
                            );
                        }, 500);
                    }

                    break;
                case "togglePlainHTML":
                    if (this.state.toggleHTMLtext == "html") {
                        this.setState({
                            toggleHTMLtext: "text",
                        });

                        app.globalF.renderBodyNoImages(
                            "",
                            this.state.emailBodyTXT,
                            function (prerenderedBody) {
                                $("#virtualization").height(0);

                                setTimeout(function () {
                                    $("#virtualization")
                                        .contents()
                                        .find("html")
                                        .html(prerenderedBody);
                                    $("#virtualization")
                                        .contents()
                                        .find("html")
                                        .append(
                                            "<style>table,table tbody,table tr,table td{display:block;width:100%;}</style>"
                                        );

                                    $("#virtualization").height(
                                        $("#virtualization")
                                            .contents()
                                            .find("html")
                                            .height()
                                    );
                                }, 100);
                            }
                        );
                    } else if (this.state.toggleHTMLtext == "text") {
                        this.setState({
                            toggleHTMLtext: "html",
                        });

                        app.globalF.renderBodyNoImages(
                            this.state.emailBody,
                            "",
                            function (prerenderedBody) {
                                $("#virtualization").height(0);

                                setTimeout(function () {
                                    $("#virtualization")
                                        .contents()
                                        .find("html")
                                        .html(prerenderedBody);
                                    $("#virtualization")
                                        .contents()
                                        .find("html")
                                        .append(
                                            "<style>table,table tbody,table tr,table td{display:block;width:100%;}</style>"
                                        );
                                    $("#virtualization").height(
                                        $("#virtualization")
                                            .contents()
                                            .find("html")
                                            .height()
                                    );
                                }, 100);
                            }
                        );
                    }

                    break;
                case "printEmail":
                    var contentToPrint =
                        document.getElementById("mail-data-content").innerHTML;
                    var iFrame = document.getElementById("virtualization");
                    var a = window.open("", "", "height=500, width=500");
                    a.document.write("<html>");
                    a.document.write("<body >");
                    a.document.write(contentToPrint);
                    a.document.write(
                        iFrame.contentWindow.document.body.innerHTML
                    );
                    a.document.write("</body></html>");
                    a.print();
                    a.document.close();

                    break;
                case "moveToTrash":
                    var thisComp = this;
                    this.setState({
                        trashStatus: true,
                        isWorkingFlag: true,
                    });
                    var target = {};
                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target
                        .removeClass("fa-trash-o")
                        .addClass("fa-refresh fa-spin");

                    if (
                        this.props.folderId ==
                            app.user.get("systemFolders")["spamFolderId"] ||
                        this.props.folderId ==
                            app.user.get("systemFolders")["trashFolderId"] ||
                        this.props.folderId ==
                            app.user.get("systemFolders")["draftFolderId"]
                    ) {
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            //console.log(selected);
                            //delete email physically;
                            app.user.set({ currentMessageView: {} });

                            app.globalF.deleteEmailsFromFolder(
                                selected,
                                function (emails2Delete) {
                                    //console.log(emails2Delete);
                                    if (emails2Delete.length > 0) {
                                        app.userObjects.updateObjects(
                                            "deleteEmail",
                                            emails2Delete,
                                            function (result) {
                                                $("#selectAll>input").prop(
                                                    "checked",
                                                    false
                                                );
                                                $("#selectAllAlt > input").prop(
                                                    "checked",
                                                    false
                                                );
                                                app.user.set({
                                                    resetSelectedItems: true,
                                                });
                                                app.globalF.syncUpdates();
                                                app.layout.display("viewBox");

                                                target
                                                    .removeClass(
                                                        "fa-refresh fa-spin"
                                                    )
                                                    .addClass("fa-trash-o");

                                                thisComp.setState({
                                                    trashStatus: false,
                                                    isWorkingFlag: false,
                                                });
                                                $(
                                                    "#mail-extra-options"
                                                ).removeClass("active");
                                            }
                                        );
                                    }
                                }
                            );
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target
                                .removeClass("fa-refresh fa-spin")
                                .addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false,
                            });
                        }
                    } else {
                        var destFolderId =
                            app.user.get("systemFolders")["trashFolderId"];
                        var selected = this.getSelected();

                        if (selected.length > 0) {
                            app.user.set({ currentMessageView: {} });
                            app.globalF.move2Folder(
                                destFolderId,
                                selected,
                                function () {
                                    app.userObjects.updateObjects(
                                        "folderUpdate",
                                        "",
                                        function (result) {
                                            $("#selectAll>input").prop(
                                                "checked",
                                                false
                                            );
                                            $("#selectAllAlt > input").prop(
                                                "checked",
                                                false
                                            );
                                            app.user.set({
                                                resetSelectedItems: true,
                                            });
                                            app.globalF.syncUpdates();
                                            app.layout.display("viewBox");

                                            target
                                                .removeClass(
                                                    "fa-refresh fa-spin"
                                                )
                                                .addClass("fa-trash-o");

                                            thisComp.setState({
                                                trashStatus: false,
                                                isWorkingFlag: false,
                                            });
                                            $(
                                                "#mail-extra-options"
                                            ).removeClass("active");
                                        }
                                    );
                                }
                            );
                        } else {
                            app.notifications.systemMessage("selectMsg");
                            target
                                .removeClass("fa-refresh fa-spin")
                                .addClass("fa-trash-o");
                            thisComp.setState({
                                trashStatus: false,
                                isWorkingFlag: false,
                            });
                        }
                    }

                    app.user.set({
                        isDecryptingEmail: false,
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;

                case "moveToSpam":
                    // console.log('move to spam');

                    var thisComp = this;

                    thisComp.setState({
                        spamStatus: true,
                        isWorkingFlag: true,
                    });
                    var target = {};

                    if ($(event.target).is("i")) {
                        target = $(event.target);
                    } else {
                        target = $(event.target).find("i");
                    }

                    target.addClass("fa-spin");

                    var destFolderId =
                        app.user.get("systemFolders")["spamFolderId"];
                    var selected = this.getSelected();

                    if (selected.length > 0) {
                        app.user.set({ currentMessageView: {} });
                        app.globalF.move2Folder(
                            destFolderId,
                            selected,
                            function () {
                                $.each(selected, function (index, emailId) {
                                    var email = app.transform.from64str(
                                        app.user.get("emails")["messages"][
                                            emailId
                                        ]["fr"]
                                    );
                                    app.globalF.createFilterRule(
                                        "",
                                        "sender",
                                        "strict",
                                        destFolderId,
                                        app.globalF.parseEmail(email)["email"],
                                        function () {}
                                    );
                                });

                                app.userObjects.updateObjects(
                                    "folderSettings",
                                    "",
                                    function (result) {
                                        if (
                                            result["response"] == "success" &&
                                            result["data"] == "saved"
                                        ) {
                                            $("#selectAll>input").prop(
                                                "checked",
                                                false
                                            );
                                            $("#selectAllAlt > input").prop(
                                                "checked",
                                                false
                                            );
                                            app.user.set({
                                                resetSelectedItems: true,
                                            });
                                            app.globalF.syncUpdates();
                                            app.layout.display("viewBox");

                                            target.removeClass("fa-spin");

                                            thisComp.setState({
                                                spamStatus: false,
                                                isWorkingFlag: false,
                                            });
                                            $(
                                                "#mail-extra-options"
                                            ).removeClass("active");
                                        }
                                    }
                                );
                            }
                        );
                    } else {
                        app.notifications.systemMessage("selectMsg");
                        target.removeClass("fa-spin");

                        thisComp.setState({
                            spamStatus: false,
                            isWorkingFlag: false,
                        });
                    }

                    app.user.set({
                        isDecryptingEmail: false,
                    });
                    Backbone.history.loadUrl(Backbone.history.fragment);

                    break;
            }
        },

        readPGP: function (PGPtext) {
            var thisComp = this;

            app.globalF
                .decryptPGPMessage(PGPtext, thisComp.state.emailAddress)
                .then(function (email64, decryptedText) {
                    thisComp.setState({
                        emailBody: decryptedText["html"],
                        emailBodyTXT: decryptedText["text"],
                        attachment: decryptedText["attachments"],
                        decryptedEmail: app.transform.from64str(email64),
                        pgpEncrypted: false,
                    });

                    thisComp.renderStrictBody();
                });
        },

        showDMARC: function () {
            var options = [];

            options.push(
                <div className="dmark-header">
                    <span className="label label-default">DMARC:</span>{" "}
                    <span className="txt-color-green">SPF</span>{" "}
                    <span className="txt-color-green">DKIM</span>{" "}
                    <span className="txt-color-red">PGP Signature</span>{" "}
                    <span className="txt-color-green">Encrypted</span>
                </div>
            );
        },
        componentDidUpdate: function () {
            // console.log(this.state.emailLoading);
        },
        renderFull: function () {
            app.globalF.renderBodyFull(
                this.state.emailBody,
                this.state.emailBodyTXT,
                function (prerenderedBody) {
                    $("#virtualization").height(0);
                    setTimeout(function () {
                        $("#virtualization")
                            .contents()
                            .find("html")
                            .html(prerenderedBody);
                        $("#virtualization")
                            .contents()
                            .find("html")
                            .append(
                                "<style>table,table tbody,table tr,table td{display:block;width:100%;}</style>"
                            );
                        $("#virtualization").height(
                            $("#virtualization")
                                .contents()
                                .find("html")
                                .height() + 50
                        );
                    }, 300);
                }
            );
            this.setState({
                renderFull: true,
            });
        },

        renderStrictBody: function () {
            var thisComp = this;
            app.globalF.renderBodyNoImages(
                this.state.emailBody,
                this.state.emailBodyTXT,
                function (prerenderedBody) {
                    $("#virtualization").height(0);

                    if (
                        thisComp.state.pgpEncrypted &&
                        !thisComp.state.decryptedEmail
                    ) {
                        prerenderedBody =
                            "<div style='white-space: pre-line;'>" +
                            prerenderedBody +
                            "</div>";
                    }

                    setTimeout(function () {
                        $("#virtualization")
                            .contents()
                            .find("html")
                            .html(prerenderedBody);
                        $("#virtualization")
                            .contents()
                            .find("html")
                            .append(
                                "<style>table,table tbody,table tr,table td{display:block;width:100%;}</style>"
                            );
                        $("#virtualization").height(
                            $("#virtualization")
                                .contents()
                                .find("html")
                                .height() + 50
                        );

                        var tt = app.mixins.touchMixins();

                        $("#virtualization")
                            .contents()
                            .bind("touchstart", function () {
                                {
                                    tt.handleTouchStart;
                                }
                            });
                        $("#virtualization")
                            .contents()
                            .bind("touchmove", function () {
                                {
                                    tt.handleTouchMove;
                                }
                            });
                        $("#virtualization")
                            .contents()
                            .bind("touchend", function () {
                                {
                                    tt.handleTouchEnd;
                                }
                            });
                    }, 300);
                }
            );
        },

        handleBackToEmailList: function () {
            $("#appRightSide").css("display", "none");
            $("#wrapper").removeClass("email-read-active");
        },

        render: function () {
            return (
                <div>
                    <div
                        className={
                            this.state.isWorkingFlag
                                ? "in-working popup d-block"
                                : "in-working popup d-none"
                        }
                    >
                        <div className="wrapper">
                            <div className="inner">
                                <div className="content">
                                    <div className="t-animation">
                                        <div className="loading-animation type-progress style-circle">
                                            <div className="progress-circle medium">
                                                <div className="circle-bg">
                                                    <img
                                                        src="/images/loading-circle.svg"
                                                        alt="loading-circle"
                                                        style={{
                                                            width: "91px",
                                                            height: "91px",
                                                        }}
                                                    />
                                                </div>
                                                <div className="circle-content">
                                                    <div className="loading-spinner">
                                                        <div className="the-spinner">
                                                            <div className="_bar1"></div>
                                                            <div className="_bar2"></div>
                                                            <div className="_bar3"></div>
                                                            <div className="_bar4"></div>
                                                            <div className="_bar5"></div>
                                                            <div className="_bar6"></div>
                                                            <div className="_bar7"></div>
                                                            <div className="_bar8"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="t-text">
                                        <h2>Processing...</h2>
                                        <h6>
                                            Please wait while we set things up
                                            for you.
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-side" id="appRightSide">
                        <div className="email-conetent-wrp">
                            <div
                                className={`mail-data emailNo ${
                                    this.state.hideEmailRead
                                        ? "d-active"
                                        : "d-none"
                                }`}
                            >
                                <div>
                                    <div>
                                        <span className="inbox-icon">
                                            <svg
                                                width="236"
                                                height="210"
                                                viewBox="0 0 236 210"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle
                                                    cx="134.945"
                                                    cy="107.461"
                                                    r="100.078"
                                                    fill="#FAFBFF"
                                                />
                                                <g clip-path="url(#clip0_111_4240)">
                                                    <mask
                                                        id="mask0_111_4240"
                                                        style={{
                                                            maskType: "alpha",
                                                        }}
                                                        maskUnits="userSpaceOnUse"
                                                        x="34"
                                                        y="7"
                                                        width="202"
                                                        height="201"
                                                    >
                                                        <circle
                                                            cx="134.945"
                                                            cy="107.461"
                                                            r="100.078"
                                                            fill="#F3F6FB"
                                                        />
                                                    </mask>
                                                    <g mask="url(#mask0_111_4240)">
                                                        <path
                                                            d="M109.109 161.197H136.519V207.813H109.109V161.197Z"
                                                            fill="#D9E8FF"
                                                        />
                                                        <path
                                                            d="M128.885 161.197H136.541V207.813H128.885V161.197Z"
                                                            fill="#C2D9FC"
                                                        />
                                                    </g>
                                                    <path
                                                        d="M207.809 81.7031V144.747H120.068V81.7031C120.074 76.3009 119.014 70.9506 116.95 65.9585C114.885 60.9664 111.856 56.4305 108.036 52.6105C104.216 48.7906 99.6801 45.7616 94.688 43.6969C89.6959 41.6322 84.3456 40.5724 78.9434 40.5781H166.684C177.591 40.5781 188.051 44.911 195.764 52.6234C203.476 60.3358 207.809 70.7961 207.809 81.7031Z"
                                                        fill="#E8F1FF"
                                                    />
                                                    <path
                                                        d="M120.07 124.316H207.811V144.747H120.07V124.316Z"
                                                        fill="#D0E3FF"
                                                    />
                                                    <path
                                                        d="M177.711 97.2125H191.404C192.599 97.2125 193.746 96.7378 194.591 95.8927C195.436 95.0476 195.911 93.9014 195.911 92.7063V81.7688C195.938 73.2189 193.292 64.8744 188.342 57.9031C185.558 54.0737 181.906 50.9589 177.685 48.8143C173.464 46.6697 168.795 45.5563 164.061 45.5656C163.25 45.5482 162.452 45.7734 161.771 46.2124C161.089 46.6513 160.554 47.284 160.234 48.0293C159.914 48.7745 159.824 49.5983 159.976 50.3949C160.128 51.1915 160.514 51.9245 161.086 52.5C164.927 56.3259 167.973 60.8739 170.049 65.8821C172.125 70.8903 173.19 76.2598 173.182 81.6813V92.6188C173.174 93.2189 173.284 93.8148 173.508 94.3718C173.732 94.9287 174.064 95.4357 174.485 95.8631C174.907 96.2906 175.409 96.63 175.962 96.8617C176.516 97.0933 177.11 97.2126 177.711 97.2125Z"
                                                        fill="white"
                                                    />
                                                    <path
                                                        d="M120.07 144.747H37.8203V81.7031C37.8203 70.7961 42.1531 60.3358 49.8655 52.6234C57.578 44.9109 68.0383 40.5781 78.9453 40.5781C89.8523 40.5781 100.313 44.9109 108.025 52.6234C115.738 60.3358 120.07 70.7961 120.07 81.7031V144.747Z"
                                                        fill="#C1DAFF"
                                                    />
                                                    <path
                                                        d="M111.32 81.7031V135.997H46.5703V81.7031C46.5703 77.4516 47.4077 73.2417 49.0347 69.3138C50.6617 65.3858 53.0464 61.8168 56.0527 58.8105C59.059 55.8042 62.628 53.4195 66.5559 51.7925C70.4839 50.1655 74.6938 49.3281 78.9453 49.3281C83.1969 49.3281 87.4068 50.1655 91.3347 51.7925C95.2626 53.4195 98.8316 55.8042 101.838 58.8105C104.844 61.8168 107.229 65.3858 108.856 69.3138C110.483 73.2417 111.32 77.4516 111.32 81.7031Z"
                                                        fill="#A7C3EC"
                                                    />
                                                    <path
                                                        d="M111.318 81.7031V135.997H78.9434V81.7031C78.9461 76.0228 80.4434 70.4432 83.2847 65.5245C86.1261 60.6059 90.2115 56.5214 95.1309 53.6813C100.05 56.5214 104.136 60.6059 106.977 65.5245C109.818 70.4432 111.316 76.0228 111.318 81.7031Z"
                                                        fill="#7EA1D6"
                                                    />
                                                    <path
                                                        d="M109.109 144.747H136.519V161.197H109.109V144.747Z"
                                                        fill="#7EA1D6"
                                                    />
                                                    <path
                                                        d="M89.9262 68.1844V114.997C89.9263 115.887 89.7498 116.769 89.4071 117.59C89.0645 118.412 88.5623 119.158 87.9297 119.784C87.2971 120.411 86.5466 120.906 85.7216 121.24C84.8966 121.575 84.0134 121.743 83.1231 121.734H8.92308C7.13796 121.729 5.4276 121.017 4.16532 119.755C2.90304 118.492 2.19135 116.782 2.18558 114.997V68.1844C2.1827 67.2978 2.35485 66.4193 2.69215 65.5993C3.02945 64.7794 3.52528 64.0341 4.1512 63.4061C4.77712 62.7781 5.52083 62.2799 6.33969 61.94C7.15855 61.6 8.03646 61.425 8.92308 61.425H83.1231C84.0152 61.4163 84.9002 61.5849 85.7267 61.921C86.5531 62.257 87.3046 62.7539 87.9375 63.3827C88.5704 64.0115 89.0721 64.7598 89.4135 65.5841C89.7549 66.4083 89.9292 67.2922 89.9262 68.1844Z"
                                                        fill="#C1DAFF"
                                                    />
                                                    <path
                                                        d="M89.9262 68.1845V70.3719L46.045 111.563L2.18558 70.4157V68.2282C2.1827 67.3416 2.35485 66.4631 2.69215 65.6432C3.02945 64.8232 3.52528 64.0779 4.1512 63.4499C4.77712 62.822 5.52083 62.3237 6.33969 61.9838C7.15855 61.6438 8.03646 61.4688 8.92308 61.4688H83.1231C84.0115 61.4602 84.8929 61.6273 85.7165 61.9607C86.5401 62.294 87.2896 62.787 87.9219 63.4111C88.5543 64.0353 89.0569 64.7784 89.4008 65.5976C89.7448 66.4168 89.9234 67.296 89.9262 68.1845Z"
                                                        fill="#AECBF7"
                                                    />
                                                    <path
                                                        d="M87.4988 120.116C86.2788 121.157 84.728 121.731 83.1238 121.734H8.92383C7.31926 121.733 5.76788 121.159 4.54883 120.116L46.1113 91.6781C58.602 100.231 53.8769 96.9937 87.4988 120.116Z"
                                                        fill="#DEEAFC"
                                                    />
                                                    <path
                                                        d="M58.3152 100.034L46.0434 111.563L33.7715 100.056L46.0434 91.6125L58.3152 100.034Z"
                                                        fill="#CADBF4"
                                                    />
                                                    <path
                                                        d="M87.8926 63.4375L46.0457 102.55L4.2207 63.4375C5.47925 62.2125 7.16758 61.5294 8.92383 61.5344H83.1238C84.9023 61.5144 86.6165 62.1985 87.8926 63.4375Z"
                                                        fill="#E8F1FF"
                                                    />
                                                    <path
                                                        d="M191.994 103.053H177.097C174.935 103.053 173.182 104.806 173.182 106.969C173.182 109.131 174.935 110.884 177.097 110.884H191.994C194.157 110.884 195.91 109.131 195.91 106.969C195.91 104.806 194.157 103.053 191.994 103.053Z"
                                                        fill="white"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_111_4240">
                                                        <rect
                                                            width="210"
                                                            height="210"
                                                            fill="white"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                    </div>
                                    <h1>{`Choose an Email`}</h1>
                                    <p>
                                        Do you have any comment or question?{" "}
                                        <br />
                                        Please contact us at{" "}
                                        <strong>support@Mailum.com</strong>
                                    </p>
                                    <div className="the-link">
                                        <div>
                                            <strong>Check Our Blog</strong>{" "}
                                            <br />
                                            blog.mailum.com
                                        </div>
                                        <div className="the-icon-wrapper">
                                            <span className="the-icon">
                                                <svg
                                                    width="29"
                                                    height="28"
                                                    viewBox="0 0 22 21"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M14.6534 11.8689L14.6534 6.65584L9.44035 6.65584"
                                                        stroke="#2277F7"
                                                        strokeWidth="1.3"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M7.3531 13.956L14.5801 6.729"
                                                        stroke="#2277F7"
                                                        strokeWidth="1.3"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="with-bg">
                                            <img
                                                src="/images/bg-link.png"
                                                alt="bg"
                                            />
                                        </div>
                                        <a
                                            href="https://blog.mailum.com/"
                                            target="_blank"
                                        ></a>
                                    </div>
                                </div>
                                <div
                                    className={`d-decrypting-message ${
                                        app.user.get("isDecryptingEmail")
                                            ? "d-flex"
                                            : "d-none"
                                    }`}
                                >
                                    <div>
                                        <div className="loading-spinner">
                                            <div className="the-spinner">
                                                <div className="_bar1"></div>
                                                <div className="_bar2"></div>
                                                <div className="_bar3"></div>
                                                <div className="_bar4"></div>
                                                <div className="_bar5"></div>
                                                <div className="_bar6"></div>
                                                <div className="_bar7"></div>
                                                <div className="_bar8"></div>
                                            </div>
                                        </div>
                                        <div className="the-content">
                                            <h3>Decrypting...</h3>
                                            <p>
                                                {`Please wait while we set`}
                                                <br />
                                                {`things up for you!`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`email-content-top ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <div className={`email-title-wrapper`}>
                                    <div className="email-title">
                                        <h1 className="email-subject">
                                            {this.state.subject}
                                        </h1>
                                        <div className="email-sent-date">
                                            {this.state.timeSent}
                                        </div>
                                    </div>
                                    {this.state.tag !== `` ? (
                                        <div className="email-labels">
                                            <span className="label-wrapper">
                                                <span className="label label-success">
                                                    <span className="icon">
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 18 18"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M13.5119 9.2475L12.5969 8.3325C12.3794 8.145 12.2519 7.8675 12.2444 7.56C12.2294 7.2225 12.3644 6.885 12.6119 6.6375L13.5119 5.7375C14.2919 4.9575 14.5844 4.2075 14.3369 3.615C14.0969 3.03 13.3544 2.7075 12.2594 2.7075H4.42187V2.0625C4.42187 1.755 4.16687 1.5 3.85937 1.5C3.55187 1.5 3.29688 1.755 3.29688 2.0625V15.9375C3.29688 16.245 3.55187 16.5 3.85937 16.5C4.16687 16.5 4.42187 16.245 4.42187 15.9375V12.2775H12.2594C13.3394 12.2775 14.0669 11.9475 14.3144 11.355C14.5619 10.7625 14.2769 10.02 13.5119 9.2475Z"
                                                                fill={this.getTagColor(
                                                                    this.state
                                                                        .tag
                                                                )}
                                                            />
                                                        </svg>
                                                    </span>
                                                    {this.state.tag}
                                                </span>

                                                <a
                                                    onClick={this.handleChange.bind(
                                                        null,
                                                        "removeTag"
                                                    )}
                                                    title="Remove Tag"
                                                >
                                                    <svg
                                                        width="9"
                                                        height="9"
                                                        viewBox="0 0 6 6"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M5.13895 0.861119C5.29018 1.01235 5.29018 1.25755 5.13895 1.40878L3.54767 3.00007L5.13895 4.59135C5.29018 4.74259 5.29018 4.98779 5.13895 5.13902C4.98772 5.29025 4.74252 5.29025 4.59129 5.13902L3 3.54774L1.40871 5.13902C1.25748 5.29025 1.01228 5.29025 0.861049 5.13902C0.709815 4.98779 0.709815 4.74259 0.861049 4.59135L2.45233 3.00007L0.861049 1.40878C0.709816 1.25755 0.709816 1.01235 0.861049 0.861119C1.01228 0.709885 1.25748 0.709885 1.40871 0.861119L3 2.4524L4.59129 0.861119C4.74252 0.709885 4.98772 0.709885 5.13895 0.861119Z"
                                                            fill="#959595"
                                                        />
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="email-additional-details">
                                    <div className="email-content-top-left">
                                        <div className="email-content-header-bottom-details">
                                            <div className="word color-1">
                                                {this.state.from !== ""?app.globalF.parseEmail(app.transform.from64str(app.user.get("currentMessageView")["meta"]["from"]))["name"].substring(0,2)
                                                    : ""}
                                            </div>
                                            <div className="sender-name">
                                                <div>{this.state.from} </div>
                                                <span>
                                                    {this.state.fromExtra}
                                                </span>
                                            </div>
                                            <div className="sender-detail-dropdown">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-secondary dropdown-toggle"
                                                        type="button"
                                                        id="sender-details"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        To me{" "}
                                                        <span className="arrow"></span>{" "}
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu"
                                                        aria-labelledby="sender-details"
                                                    >
                                                        <li>
                                                            <span>from:</span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .from
                                                                }
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                reply-to:
                                                            </span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .from
                                                                }
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <span>to:</span>
                                                            <div>
                                                                {this.state.to}
                                                            </div>
                                                        </li>
                                                        <li className="sent_date_time">
                                                            <span>date:</span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .timeSent
                                                                }
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                subject:
                                                            </span>
                                                            <div>
                                                                {
                                                                    this.state
                                                                        .subject
                                                                }
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="email-content-top-right">
                                        <div
                                            className="mail-back"
                                            onClick={this.handleBackToEmailList}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 48 48"
                                            >
                                                <path d="M18 38 4 24l14-14 2.1 2.1L9.7 22.5H44v3H9.7l10.4 10.4Z" />
                                            </svg>
                                        </div>
                                        <div className="right-menus">
                                            <div className="button-group">
                                                <button
                                                    type="button"
                                                    className={`btn btn-secondary btn-pin-to-top ${
                                                        this.state.pinTop === -1
                                                            ? "active"
                                                            : "normal"
                                                    }`}
                                                    onClick={this.handleClick.bind(
                                                        null,
                                                        "pinToTop"
                                                    )}
                                                >
                                                    <span className="icon normal">
                                                        {this.state.pinTop ===
                                                        -1 ? (
                                                            <svg
                                                                width="28"
                                                                height="27"
                                                                viewBox="0 0 28 27"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g clipPath="url(#clip0_1534_22508)">
                                                                    <path
                                                                        d="M14.336 8.48426L11.3611 11.4592C11.3053 11.515 11.2361 11.5557 11.1602 11.5774L8.78272 12.2567C8.44207 12.354 8.3313 12.7815 8.58182 13.032L13.9701 18.4202C14.2206 18.6708 14.6481 18.56 14.7454 18.2193L15.4247 15.8419C15.4464 15.766 15.4871 15.6968 15.5429 15.641L18.5178 12.6661C18.8807 12.3031 18.8807 11.7148 18.5178 11.3518L15.6502 8.48426C15.2873 8.12135 14.6989 8.12135 14.336 8.48426Z"
                                                                        fill="#2277F6"
                                                                    />
                                                                    <path
                                                                        d="M7.75371 18.2443L11.4709 14.5271C11.7275 14.2705 12.1435 14.2705 12.4002 14.5271C12.6568 14.7838 12.6568 15.1998 12.4002 15.4564L8.683 19.1736C8.42638 19.4302 8.01032 19.4302 7.75371 19.1736C7.49709 18.917 7.49709 18.5009 7.75371 18.2443Z"
                                                                        fill="#2277F6"
                                                                    />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_1534_22508">
                                                                        <rect
                                                                            width="19"
                                                                            height="19"
                                                                            fill="white"
                                                                            transform="translate(14) rotate(45)"
                                                                        />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                width="28"
                                                                height="27"
                                                                viewBox="0 0 28 27"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <g clipPath="url(#clip0_1534_22293)">
                                                                    <path
                                                                        d="M11.8539 11.952L14.8288 8.97709C14.9196 8.88636 15.0667 8.88636 15.1574 8.97708L18.025 11.8447C18.1157 11.9354 18.1157 12.0825 18.025 12.1732L15.0501 15.1481C14.9105 15.2877 14.8088 15.4606 14.7545 15.6504L14.1837 17.6482L9.35384 12.8183L11.3517 12.2475C11.5415 12.1933 11.7143 12.0916 11.8539 11.952Z"
                                                                        stroke="#080D13"
                                                                        strokeWidth="1.39393"
                                                                        strokeLinecap="round"
                                                                    />
                                                                    <path
                                                                        d="M7.75371 18.2443L10.9967 15.0013C11.2672 14.7308 11.7107 14.7477 11.9599 15.0379C12.1837 15.2986 12.1689 15.6877 11.926 15.9306L8.683 19.1736C8.42638 19.4302 8.01032 19.4302 7.75371 19.1736C7.49709 18.917 7.49709 18.5009 7.75371 18.2443Z"
                                                                        fill="#080D13"
                                                                    />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_1534_22293">
                                                                        <rect
                                                                            width="19"
                                                                            height="19"
                                                                            fill="white"
                                                                            transform="translate(14) rotate(45)"
                                                                        />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <span className="text">
                                                        {this.state.pinTop ===
                                                        -1
                                                            ? `Pinned`
                                                            : `Pin to top`}
                                                    </span>
                                                </button>
                                                <div className="dropdown dropdown-labels-wrapper">
                                                    <button
                                                        className="btn btn-secondary dropdown-toggle dropdown-toggle-labels"
                                                        type="button"
                                                        id="label-list"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <span className="icon normal">
                                                            <svg
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 18 18"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M13.5119 9.2475L12.5969 8.3325C12.3794 8.145 12.2519 7.8675 12.2444 7.56C12.2294 7.2225 12.3644 6.885 12.6119 6.6375L13.5119 5.7375C14.2919 4.9575 14.5844 4.2075 14.3369 3.615C14.0969 3.03 13.3544 2.7075 12.2594 2.7075H4.42187V2.0625C4.42187 1.755 4.16687 1.5 3.85937 1.5C3.55187 1.5 3.29688 1.755 3.29688 2.0625V15.9375C3.29688 16.245 3.55187 16.5 3.85937 16.5C4.16687 16.5 4.42187 16.245 4.42187 15.9375V12.2775H12.2594C13.3394 12.2775 14.0669 11.9475 14.3144 11.355C14.5619 10.7625 14.2769 10.02 13.5119 9.2475Z"
                                                                    fill={
                                                                        this
                                                                            .state
                                                                            .tag !==
                                                                        ``
                                                                            ? this.getTagColor(
                                                                                  this
                                                                                      .state
                                                                                      .tag
                                                                              )
                                                                            : `#C9D0DA`
                                                                    }
                                                                />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu dropdown-labels"
                                                        aria-labelledby="label-list"
                                                    >
                                                        {this.getTagsList()}
                                                    </ul>
                                                </div>
                                                <button
                                                    className="back"
                                                    onClick={this.handleClick.bind(
                                                        null,
                                                        "reply"
                                                    )}
                                                ></button>
                                                <button
                                                    className="next"
                                                    onClick={this.handleClick.bind(
                                                        null,
                                                        "forward"
                                                    )}
                                                ></button>
                                                {/* <button className="star"></button> */}
                                                <button
                                                    className="delete"
                                                    onClick={this.handleClick.bind(
                                                        null,
                                                        "moveToTrash"
                                                    )}
                                                ></button>
                                            </div>
                                            <div className="content-list-menu">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-secondary dropdown-toggle"
                                                        type="button"
                                                        id="content-list"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    ></button>
                                                    <ul
                                                        className="dropdown-menu"
                                                        aria-labelledby="content-list"
                                                    >
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "reply"
                                                                )}
                                                            >
                                                                Reply
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "forward"
                                                                )}
                                                            >
                                                                Forward
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "printEmail"
                                                                )}
                                                            >
                                                                Print
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "moveToTrash"
                                                                )}
                                                            >
                                                                Delete this
                                                                message
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "moveToSpam"
                                                                )}
                                                            >
                                                                Report Spam
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "showHeader"
                                                                )}
                                                            >
                                                                Show Raw Header
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={this.handleClick.bind(
                                                                    null,
                                                                    "pinToTop"
                                                                )}
                                                            >
                                                                {this.state
                                                                    .pinTop ===
                                                                -1
                                                                    ? `Un-pin from top`
                                                                    : `Pin to top`}
                                                            </button>
                                                        </li>
                                                        <li className="dropdown-labels-wrapper dropdown-labels-mobile">
                                                            <ul
                                                                className="dropdown-labels"
                                                                aria-labelledby="label-list"
                                                            >
                                                                {this.getTagsList()}
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`real-sender ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <div>
                                    <span className="sender-icon">
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.5067 9.61325L9.23998 1.93325C8.66665 0.899919 7.87332 0.333252 6.99998 0.333252C6.12665 0.333252 5.33332 0.899919 4.75998 1.93325L0.493318 9.61325C-0.0466816 10.5933 -0.106682 11.5333 0.326652 12.2733C0.759985 13.0133 1.61332 13.4199 2.73332 13.4199H11.2667C12.3867 13.4199 13.24 13.0133 13.6733 12.2733C14.1067 11.5333 14.0467 10.5866 13.5067 9.61325ZM6.49998 4.99992C6.49998 4.72658 6.72665 4.49992 6.99998 4.49992C7.27332 4.49992 7.49998 4.72658 7.49998 4.99992V8.33325C7.49998 8.60658 7.27332 8.83325 6.99998 8.83325C6.72665 8.83325 6.49998 8.60658 6.49998 8.33325V4.99992ZM7.47332 10.8066C7.43998 10.8333 7.40665 10.8599 7.37332 10.8866C7.33332 10.9133 7.29332 10.9333 7.25332 10.9466C7.21332 10.9666 7.17332 10.9799 7.12665 10.9866C7.08665 10.9933 7.03998 10.9999 6.99998 10.9999C6.95998 10.9999 6.91332 10.9933 6.86665 10.9866C6.82665 10.9799 6.78665 10.9666 6.74665 10.9466C6.70665 10.9333 6.66665 10.9133 6.62665 10.8866C6.59332 10.8599 6.55998 10.8333 6.52665 10.8066C6.40665 10.6799 6.33332 10.5066 6.33332 10.3333C6.33332 10.1599 6.40665 9.98659 6.52665 9.85992C6.55998 9.83325 6.59332 9.80658 6.62665 9.77992C6.66665 9.75325 6.70665 9.73325 6.74665 9.71992C6.78665 9.69992 6.82665 9.68659 6.86665 9.67992C6.95332 9.65992 7.04665 9.65992 7.12665 9.67992C7.17332 9.68659 7.21332 9.69992 7.25332 9.71992C7.29332 9.73325 7.33332 9.75325 7.37332 9.77992C7.40665 9.80658 7.43998 9.83325 7.47332 9.85992C7.59332 9.98659 7.66665 10.1599 7.66665 10.3333C7.66665 10.5066 7.59332 10.6799 7.47332 10.8066Z"
                                                fill={this.state.mFromColor}
                                            />
                                        </svg>
                                    </span>
                                    <span className="text-from">
                                        Mail from:
                                    </span>{" "}
                                    <span className="sender-email">
                                        {this.state.realSender}
                                    </span>
                                    {this.state.domainWarning &&

                                        <div className="" style={{marginTop:"5px",color:"#c71c36",lineHeight: "20px"}}>
                                            Please be careful; the email was sent from a domain that does not match the domain in the "FROM" field of the same email, which could be an indication of a spoofed email.
                                    </div>
                                        }

                                </div>
                            </div>
                            <div
                                className={`image-disabled ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <div className={this.state.renderButtonClass}>
                                    To protect you from tracking, images are
                                    disabled.{" "}
                                    <a
                                        className="btn btn-default btn-xs"
                                        href="javascript:void(0)"
                                        onClick={this.handleClick.bind(
                                            null,
                                            "renderImages"
                                        )}
                                    >
                                        Render Images
                                    </a>
                                </div>
                            </div>
                            <div
                                id="mail-data-content"
                                className={`mail-data ${
                                    this.state.hideEmailRead ? "d-none" : ""
                                }`}
                            >
                                <iframe
                                    id="virtualization"
                                    scrolling="no"
                                    frameBorder="0"
                                    width="100%"
                                ></iframe>
                                {this.displayAttachments()}
                            </div>
                        </div>
                        <div
                            className={
                                "emailShow " +
                                (this.state.hideEmailRead ? "hidden" : "")
                            }
                        ></div>
                    </div>
                </div>
            );
        },
    });
});
