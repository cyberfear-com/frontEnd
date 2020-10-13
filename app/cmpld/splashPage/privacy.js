define(['react'], function (React) {
	return React.createClass({

		onClick: function () {
			$('.hiddens').toggle();
		},
		render: function () {

			return React.createElement(
				'section',
				{ className: 'services grey-bg', id: 'section1' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'div',
						{ className: 'section-header' },
						React.createElement(
							'h2',
							{ className: 'dark-text' },
							'Privacy Statement of SCRYPTmail'
						),
						React.createElement('div', { className: 'colored-line' }),
						'Status: January 6th, 2015'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'General'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'Any emails or other information provided to SCRYPTmail through either the service or our waiting list are considered privileged information will never be sold or shared with any third parties.',
						React.createElement('br', null),
						'All customer data in SCRYPTmail is encrypted end-to-end.',
						React.createElement('br', null),
						'We are always at your disposal for any questions about privacy. We will be glad to answer any concerns or inquiries. Please contact us via email: support@CyberFear.com',
						React.createElement('br', null),
						'We do not use any scripts or documents hosted outside of our server.',
						React.createElement('br', null),
						'Account creation: We do not require ANY personal information to create an account.',
						React.createElement('br', null)
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Data Collection'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'SCRYPTmail user data collection is limited to the following:',
						React.createElement('br', null),
						React.createElement('br', null),
						React.createElement(
							'ul',
							null,
							React.createElement(
								'li',
								null,
								'Account activity involving sending or receiving email to/from third party server - Due to limitations of the SMTP protocol, we have access to the following email metadata: sender and recipient email addresses, the IP address incoming messages originated from, message subject, body and attachments and message sent and received times.',
								React.createElement('br', null),
								React.createElement('br', null)
							),
							React.createElement(
								'li',
								null,
								'Account activity involving sending or receiving email within SCRYPTmail servers - Sent times. Due to exclusive way SCRYPTmail operates, all other metadata is encrypted and not accessible to the server to read. Retrieving recipient public keys and sending emails is two different API calls. To establish connection, it would be required to store detailed API call information and run complex data analysis. This action can be performed but only through a court order or a subpoena. Please refer to our canary warrant for more information.',
								React.createElement('br', null),
								React.createElement('br', null)
							),
							React.createElement(
								'li',
								null,
								'SCRYPTmail using access log to store the following records to improve service and optimize server efficiency - Last login time, IP address, User agent, API call. All API call data is encrypted whenever it\u2019s possible and not recorded anywhere in our system.',
								React.createElement('br', null),
								React.createElement('br', null)
							),
							React.createElement(
								'li',
								null,
								'We have no ability to match an IP to a specific user account.',
								React.createElement('br', null),
								React.createElement('br', null)
							),
							React.createElement(
								'li',
								null,
								'Communicating with SCRYPTmail - Your communications with SCRYPTmail, such as sales and support requests, bug reports or feature requests are retained and may be saved by our staff.',
								React.createElement('br', null),
								React.createElement('br', null)
							),
							React.createElement(
								'li',
								null,
								'During beta stage, we also collect debugging information from our PHP server and JavaScript code. This data is sent to us only if script caused error and contains only information about user agent, script name and line caused error. No personal information is collected.'
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Personal Data'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'We collect, process and use your personal data confidentially and exclusively for the initiation and fulfillment of the contract as well as for billing purposes. In addition, this data will be used for the verification of personal data in the case of password changes. Depending on the usage, more data will be included at a later date. All personal data is kept securely by us and thus protected from unauthorized access.',
						React.createElement('br', null),
						React.createElement('br', null),
						'For the initiation and fulfillment of a contractual relationship, the following data (= Inventory data) will be required depending on the product version and the selected range:',
						React.createElement('br', null),
						React.createElement('br', null),
						React.createElement(
							'ul',
							null,
							React.createElement(
								'li',
								null,
								'First, Last name(s)'
							),
							React.createElement(
								'li',
								null,
								'Company'
							),
							React.createElement(
								'li',
								null,
								'Street and house number, postal code and city'
							),
							React.createElement(
								'li',
								null,
								'Mobile phone number(s)'
							),
							React.createElement(
								'li',
								null,
								'Email address'
							),
							React.createElement(
								'li',
								null,
								'We will not disclose your personal data including your email address to third parties categorically. There will be no sale of data.'
							)
						),
						React.createElement('br', null),
						React.createElement('br', null),
						'We will not disclose your personal data including your email address to third parties categorically. There will be no sale of data.'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Period of Data Storage'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'Your personal data shall be deleted no later than at the end of the calendar year following the year of the termination of the contract unless in an individual case specific reasons to the contract apply. For example, in the case of a customer objecting to the amount of the charged fees, the accounting data may be stored until the objections are terminally clarified. Furthermore, inventory data can be stored for up to two years if the handling of a complaint and other reasons require this action for an orderly settlement of the contract. Moreover, the deletion of inventory and billing data may be omitted provided that legal regulations or the prosecution of claims require this action. Order-related data and the addresses associated with the order are stored in respect to tax, contract and commercial law retention periods and erased at the conclusion of those periods.'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Data Retention'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'When a SCRYPTmail account is closed, data is immediately deleted; however, data may be retained for up to 7 days in our backups. Free Accounts that are inactive for over 3 months may be automatically deleted. Active accounts will have data retained indefinitely. Deleted emails are instantly deleted although they may be retained in our backups for up to 7 days.'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Cookies'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'"Cookies" are small text files that can be stored by a website locally in the memory of your Internet browser on the computer you are using. Our website, CyberFear.com, uses so-called cookies which are stored on your computer in order to establish session with server. No other information is stored in cookie. The cookies on our sites do not collect personal information about you or your use. You can delete cookies by clicking on the appropriate menu item in your internet browser or by deleting them on your hard drive. For details, refer to the help menu on your internet browser.'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Disclaimer Information'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'Although you have given us your consent to process your personal data, we would like to point out that you can revoke your consent in the future at any time. Upon request, we will give you information about the data stored about you free of charge. Please send a message with your request to support@CyberFear.com. In addition, we are obliged to delete, to correct or to block the data stored about you upon request. Please also refer to the instructions under "Period of Data Storage."'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Modifications to Privacy Policy'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'We may update this Privacy Statement at any time so please review it frequently. If we change our Privacy Statement, we will post the revised version here with an updated revision date. If we make significant changes to our Privacy Statement, we may also notify you by other means prior to the changes taking effect such as sending an email or posting a notice on our website.'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Applicable Law'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'This Agreement shall be governed in all respects by the laws of the state of Washington, USA. All actions commenced pursuant hereto shall be brought in a court of competent jurisdiction residing in the state of Washington, USA.'
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'COPPA (Children Online Privacy Protection Act)'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'When it comes to the collection of personal information from children under 13, the Children\'s Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation\'s consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children\'s privacy and safety online.',
						React.createElement('br', null),
						React.createElement('br', null),
						React.createElement(
							'strong',
							null,
							'We do not specifically market to children under 13.'
						)
					),
					React.createElement(
						'div',
						{ className: 'sub-heading' },
						React.createElement(
							'h3',
							null,
							'Update'
						)
					),
					React.createElement(
						'div',
						{ className: 'row sMailTextAlignLeft' },
						'This Privacy Policy was last updated on: Tuesday, January 6th, 2015.'
					)
				)
			);
		}

	});
});