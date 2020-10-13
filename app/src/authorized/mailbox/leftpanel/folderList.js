define(['react','app','accounting'], function (React,app, accounting) {
	return React.createClass({
		getInitialState : function() {
			return {

				mainFolders:app.globalF.getMainFolderList(),
                customFolders:app.globalF.getCustomFolderList(),
				moveFolderMain:[],
				moveFolderCust:[],
                unopened:app.user.get('unopenedEmails'),
			}
		},
		componentDidMount: function() {
			//this.getMainFolderList();
			//$( document ).tooltip();
            var thisComp=this;

			thisComp.props.changeFodlerId(app.user.get('systemFolders')['inboxFolderId']);

thisComp.notifyMe();
			//console.log(this.props.activePage)
          //  console.log(thisComp.state.unopened);
			//this.getCustomFolderList();
			//this.getMainFolderList();

            app.user.on("change:unopenedEmails",function() {
                thisComp.updateUnopened();
            });
		},
        componentWillUnmount: function () {
            app.user.off("change:unopenedEmails");
        },

        updateUnopened:function(){
            var thisComp=this;
            this.setState({
                unopened:app.user.get('unopenedEmails'),
            });
        },

		removeClassesActive:function(){
			$('#folderul>li').removeClass('active');
			$('#folderulcustom>li').removeClass('active');

		},

		handleChange:function(i,event){
			switch(i) {
				case 'switchFolder':
					var thisComp=this;

					if(thisComp.props.activePage!=$(event.target).attr('id')){
						$('#sdasdasd').addClass("hidden");
						clearTimeout(app.user.get('emailOpenTimeOut'));

						app.mixins.canNavigate(function(decision){
							if(decision){

								$('#mMiddlePanelTop').removeClass(' hidden-xs hidden-sm hidden-md');
								var folder=app.user.get('folders')[$(event.target).attr('id')]['name'];

								thisComp.removeClassesActive();
								//$(event.target).parents('li').addClass('active');

								//console.log($(event.target).attr('id'));

								Backbone.history.navigate("/mail/"+app.transform.from64str(folder), {
									trigger : true
								});
								app.user.set({"resetSelectedItems":true});

								app.globalF.resetCurrentMessage();
								app.globalF.resetDraftMessage();

								thisComp.props.changeFodlerId($(event.target).attr('id'));


								$('#'+$(event.target).attr('id')).parents('li').addClass('active');

								$('#mMiddlePanel').scrollTop(0);
								//$('#selectAll>input').prop("checked",false);

								app.layout.display('viewBox');

							}
						});

					}else{
						thisComp.removeClassesActive();
						app.user.set({"resetSelectedItems":true});

						app.globalF.resetCurrentMessage();
						app.globalF.resetDraftMessage();
						Backbone.history.navigate("/mail/"+app.user.get("currentFolder"), {
							trigger : true
						});
$('#emailListTable tr').removeClass('selected');
						$('#sdasdasd').addClass("hidden");
						$('#mMiddlePanelTop').removeClass(' hidden-xs hidden-sm hidden-md');
						$('#mRightPanel').addClass('hidden-xs hidden-sm hidden-md');

					}










					break;
			}
		},
        notifyMe: function() {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                // alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                console.log();
                //var notification = new Notification("You have new email!");
            }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                      //  var notification = new Notification("Hi there!");
                    }
                });
            }

            // At last, if the user has denied notifications, and you
            // want to be respectful there is no need to bother them any more.
        },

		handleClick: function(i) {
			switch(i) {


				case 'composeEmail':
					app.mixins.canNavigate(function(decision){
							if(decision){

								$('#emailListTable').find("tr").removeClass("selected");
								$('#mMiddlePanelTop').addClass(' hidden-xs hidden-sm hidden-md');
								$('#mRightPanel').removeClass('hidden-xs hidden-sm hidden-md');
								Backbone.history.navigate("/mail/Compose", {
									trigger : true
								});
							}
					});


					break;


				case 'addFolder':
					app.mixins.canNavigate(function(decision){
						if(decision){
							Backbone.history.navigate("/settings/Folders", {
								trigger : true
							});
						}
					});


					break;

				case 'login':
					//console.log
					console.log(createUserFormValidator);
				break;
			}


		},
		boxSize:function(){

			//console.log(app.globalF.countEmailsSize());
			return (
				<span className="mailboxsize">

				{accounting.toFixed(app.user.get("mailboxSize")/1024/1024/1024,2)} GB
					&nbsp;/&nbsp;
					<strong>{app.user.get("userPlan")['planData']['bSize']/1000} GB</strong>
				</span>
			)
		},

		render: function () {
		//	console.log('act p: '+this.props.activePage);
			var st1 = { height: '10px', marginLeft: '4px', marginBottom: '2px' };
			var st2 = { marginTop: '3px' };
			var st3 = { width: accounting.toFixed(app.user.get("mailboxSize") / 1024 / 1024, 2) * 100 / app.user.get("userPlan")['planData']['bSize'] + '%' };

			return (
			<div className={this.props.panel.leftPanel} id="mLeftPanel">

				<div className="folder-nav">

					<div>
						<a href="javascript:void(0);" id="compose-mail" className="btn btn-primary btn-block" onClick={this.handleClick.bind(this, 'composeEmail')}>
							<strong>Compose</strong> </a>

						<h6> </h6>

						<ul className="inbox-menu-lg" id="folderul">

                            {
                                Object.keys(this.state.mainFolders).map(function (folderData, i) {
                                   // console.log(this.state.mainFolders[folderData]['index']);
                                    //console.log(this.state.mainFolders[folderData]['name']);
                                    return (
                                        <li key={"liM_"+this.state.mainFolders[folderData]['index']}
                                            className={
                                            "pull-left "+(
                                                this.state.mainFolders[folderData]['role']=='Inbox'?"active":(
                                                    this.state.unopened[this.state.mainFolders[folderData]['index']]==0?"":"bold"
                                                    )
                                                )
                                            }>
                                            <a key={"aM_"+i}
                                               className="col-xs-9"
                                               id={this.state.mainFolders[folderData]['index']}
                                               onClick={this.handleChange.bind(this, 'switchFolder')}
                                               data-name={this.state.mainFolders[folderData]['name']}>
                                                {this.state.mainFolders[folderData]['name']+" "+
                                                    (this.state.unopened[this.state.mainFolders[folderData]['index']]==0 ||
                                                        this.state.mainFolders[folderData]['index']==app.user.get('systemFolders')['sentFolderId']||
                                                        this.state.mainFolders[folderData]['index']==app.user.get('systemFolders')['trashFolderId']
                                                    ?"":"("+this.state.unopened[this.state.mainFolders[folderData]['index']]+")")
                                                }

                                            </a>

                                            <span key={"spM_"+i}
                                                  className="pull-right bg-color-blueLight">
                                            </span>
                                        </li>);

                                },this)
                            }

						</ul>

						<h6> Folders <a rel="tooltip" title="Add Folder" className="pull-right txt-color-darken">
							<i className="fa fa-plus" onClick={this.handleClick.bind(this, 'addFolder')}></i></a>
						</h6>

						<ul className="inbox-menu-lg" id="folderulcustom">

                            {
                                this.state.customFolders.map(function (folderData, i) {
                                    //console.log(folderData['index']);
                                    //console.log(folderData['name']);

                                    return (
                                        <li key={"li_"+folderData['index']}
                                            className={"pull-left "+(folderData['role']=='Inbox'?"active":(this.state.unopened[folderData['index']]==0?"":"bold"))}>
                                            <a key={"a_"+i} className="col-xs-9" id={folderData['index']}
                                               onClick={this.handleChange.bind(this, 'switchFolder')}>
                                                {folderData['name']+" "+
                                                (this.state.unopened[folderData['index']]==0?"":"("+this.state.unopened[folderData['index']]+")"
                                                )
                                                }

                                            </a>

                                            <span key={"sp_"+i}
                                                  className="badge pull-right bg-color-blueLight">

                                            </span>
                                        </li>);

                                },this)
                            }

						</ul>
					</div>

				</div>
				<div className="leftFolderAndSpace">
					<div className="inbox-space visible-md visible-sm visible-lg pull-left InboxRefresh">
						{this.boxSize()}
						<img src="img/logo1.svg" alt="emails per account" style={st1}/>
						<div className="progress progress-xs">
							<div className="progress-bar progress-primary" style={st3}></div>
						</div>

					</div>
				</div>


			</div>
			);
		}

	});

});