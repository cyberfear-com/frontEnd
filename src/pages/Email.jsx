import * as openpgp from 'openpgp'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import styles from "./Email.module.scss"
import { ReactComponent as MailumSVG } from "@/assets/mailum.svg"
import { ReactComponent as ReplyIconSVG } from "@/assets/reply-icon.svg"
import { ReactComponent as DeleteIconSVG } from '@/assets/delete-icon.svg'
import { ReactComponent as FacebookIconSVG } from '@/assets/facebook-icon.svg'
import { ReactComponent as TwitterIconSVG } from '@/assets/twitter-icon.svg'
import { ReactComponent as RedditIconSVG } from '@/assets/reddit-icon.svg'
import { ReactComponent as CrownIconSVG } from '@/assets/crown-icon.svg'
import ReactQuill from 'react-quill';
import { filterXSS } from 'xss'
import {
    ab2hex,
    ab2str,
    encode,
    encode8,
    encryptPin,
    encryptAes64,
    decryptAes64,
    base64ToArrayBuffer,
    to64str,
    createEncryptionKey256,
    makeModKey, decryptAes64bin
} from '../crypto'
import 'react-quill/dist/quill.snow.css'
//https://mu.com/email/655432ce80b12ce6008b4567
function generateReplyHtml(message) {
  return `
<br />
<br />
<blockquote>
On ${message.meta.timeSent.toDateString({timeZoneName: 'short'})}, at ${message.meta.timeSent.toLocaleTimeString()}, ${message.meta.from} wrote:<br /><br />
${message.body.html}
</blockquote>
  `
}

export default function Email(props) {
  const { messageId } = useParams()
  let [isNoLongerAvailable, setIsNoLongerAvailable] = useState(false)
  let [isSending, setIsSending] = useState(false)
  let [isReplySent, setIsReplySent] = useState(false)
  const [viewHtml, setViewHtml] = useState(true)
  const [message, setMessage] = useState(null)
  const [isReplying, setIsReplying] = useState(false)
  const [replyHtml, setReplyHtml] = useState('')

  useEffect(() => {
    async function makeRequest() {
      /*
      let pin = '1234'
      let data = {
        "response": "success",
        "data": {
          "email": "TQr3+nZqlx5mT2xcldAgBQ==;GIvDVPemQLyF1+LAI4iIsAOQLgPIqybt9Svkt0CXWtzcWyuzEaYpnPgTASIgwem/KDRHcJ7/yBbaSReUbjpiYqqtqwIuvDLBlPSHtmtW5GNXkOGbh0wx1SdoiGZxQpNdVbCjGJzg8y13YncLoSCr6B2YGu6ckYRVfbXCwHO77Z0M2xZSrsEBJqM97oderjfcGe2iuT0j/RKTKACMrAmAlPt+Gwt6v/ey/NnUw7dJiRAryfgUyLpzUMTkiUhY9cPQ5ukQ4BjJn56VLkMJUZbKJUxlHTqIAGPybaPV+ApD6ECIfJlCIq5qGzmJ47GWcFZKWSTVUkNoETiigj9+mJtfLdTfs4X+1MVYKxZSmqyoVEPJ3rfKQAVKeuq1w5VoLuMVy9UkOqIk2kZvxNA5hkY9qxutPNRB93OZGFu/oPt3JzRLXnGIm66OsgVOI3B/hOADgucG/aU0W5iQTTD/JssN0MjAwC2ivV0Wa//jSr40a479UydyLyTMZV371SeDIudyTuuhHqDbl/cSPywjdklm7mSrNzBlZ+J+WXrrm0U/oG5rISJiDiuveWZSlaqAqBHQMgUX9+8YPD8V8Rl3bW1jx8Iv+YyMzvbINE++u/fm9f/oloeSVI0l8uyfl6/p6hQJpKSpqDv6SO8AmjGYWbFkdCZCzHj9adGkRRPaUTOtYkPl5312uX8sxzmdf9MLyVC9sbB1aS+BQf/9e67XVyBN1R0boLjwXlwn5EIe5pu9OwURBGYbih+2/fAYyFEnPmifo06GKvD+UqDarFYLZmTNDhrUuyHol9BxKg5M5JgdvomLAf3M3r+8NaArXTflqdmXpYa7sPZR9Z+4T0zRx0LVtAcBbb0rwqM9eMeznn2NdPRnYVSUUDzgfWs/FH3BWZ8Z",
          "messageId": "64db950d80b12c4c688b456c",
          "recipientHash": "b7448824376b04edec95e778c311d3a852f98ced8ff3c2ce9bd8fda1dc45f465",
          "version": 2
        }
      };
      */
      const pin = window.prompt('Please enter PIN?')
      const response = await fetch(`https://mu.com/api/retrieveUnregEmailV2`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailId: messageId,
          pin: ab2hex(await crypto.subtle.digest('sha-256', encode(ab2str(await encryptPin(pin)))))
        })
      })
      const data = await response.json()

      if(data.response !== 'success') {
        if (data.data === -1 || data.data >= parseInt(3)) {
          setIsNoLongerAvailable(true)
          return;
        } else {
          alert(`Incorrect PIN. ${3 - data.data} attempt(s) left.`)
          location.reload()
        }
      }

      /*
      for testing

      */

      const {
        email,
        recipientHash,
        version
      } = data.data
       // console.log(data);

      const message = JSON.parse(await decryptAes64(email, pin))
      message.meta.timeSent = new Date(message.meta.timeSent * 1000)
      message.meta.from = atob(message.meta.from)
      message.meta.to = message.meta.to.map((to) => atob(to))
      message.meta.subject = atob(message.meta.subject)
      message.meta.cc = message.meta.cc.map((cc) => atob(cc))
      message.body.text = atob(message.body.text)
      message.body.html = atob(message.body.html)
      message.version=data.data.version;
       // message.attachment = message.attachment.map((to) => atob(to))
      console.debug('message', message)
      setMessage(message)

      setReplyHtml(generateReplyHtml(message))
    }

    makeRequest()
  }, [])

  async function doReply() {
    setIsSending(true)
    try {
      let toEmail = getEmailsFromString(message.meta.from)
      let recipientFrom = message.meta.to[0]
      let now = new Date
      let subject = 'Re: ' + message.meta.subject

      let response = await fetch(`/api/retrievePublicKeyUnregV2`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'emailHash': ab2hex(await crypto.subtle.digest('sha-512', encode8(toEmail)))
        })
      })
      let pkData = await response.json()
      console.debug('retrievePublicKeyUnregV2>', pkData)
      if (pkData.response !== 'success') {
        // TODO
      }

      const pgpKey = await openpgp.readKey({ armoredKey: atob(pkData.data) })
      let publicKey = pgpKey.toPublic()

      let draft = {
          'body':{
              'text': to64str(stripHtml(replyHtml)),
              'html': to64str(filterXSSwhite(replyHtml))
          },
          'meta':{
              from: to64str(recipientFrom),
              to: [to64str(toEmail)],
              toCC: {},
              toBCC: {},
              fromExtra: 'via Mailum',
              attachment: 0,
              subject: to64str(stripHtml(subject).substring(0, 150)),
              body: to64str(stripHtml(replyHtml).substring(0, 50)),
              opened: false,
              pin: '',
              pinEnabled: false,
              status: 'normal',
              timeSent: Math.round(now.getTime() / 1000),
              timeCreated: Math.round(now.getTime() / 1000),
              signatureOn: false,
              type: 1,
              version: 2
          },
          attachment: {}
      }

      let key = await createEncryptionKey256()

      let modKey = await makeModKey()

      let meta={
          'attachment':   0,
          'to' :          draft.meta.to,
          'toCC':           [],
          'from' :        draft.meta.from,
          'subject' :     draft.meta.subject,
          'body' :        draft.meta.body,
          'en':           1, //encrypted

          'timeSent' :    draft.meta.timeSent,
          'pin' :         '',

          'modKey' :      modKey,
          'type' :        1, //received
          'status' :      '',
          'emailHash':    ab2hex(await crypto.subtle.digest('sha-512', encode(JSON.stringify(draft)))),
          'emailKey':     to64str(ab2str(await crypto.subtle.exportKey('raw', key)))
      };

      let pgpMessage = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: to64str(JSON.stringify(meta)) }), // input as Message object
        encryptionKeys: publicKey,
      });

      let post = {
          'emailData':JSON.stringify({
            toCCrcpt: {
                recipients: [to64str(toEmail)],
                email: await encryptAes64(key, JSON.stringify(draft)),
                meta: to64str(pgpMessage),
            },
            modKey: ab2hex(await crypto.subtle.digest('sha-512', encode(modKey))),

            toCCrcptV1:[],
            bccRcptV1:[],
            bccRcpt: {},
            attachments:{},
        }),
        'refId': messageId
      };
      response = await fetch(`/api/sendEmailUnregV2`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      })
      let data = await response.json()

      if (confirm('Email was successfully sent. Please click OK to delete email and go to main page or cancel to go back.')) {
        await doDelete(true)
      } else {
        setReplyHtml(generateReplyHtml(message))
        setIsReplying(false)
      }
    } finally {
      setIsSending(false)
    }
  }

  function downloadFile(event){
      var fileButton=(event.target);
      var email=message;
      var emailAttachments=email['attachments'];
      var fileBId=event.target.id;
      var modKey='none';
      var version=15;
      var key="";
      fileButton.innerHTML='Downloading..';

      if(email['version']===15){
      //    var fileName=app.transform.SHA512(emailAttachments[fileBId]['fileName']+app.user.get('userId'));
          // console.log(emailAttachments[fileBId]['filename']);
           modKey='none';
           version=15;
          //var key=app.transform.from64bin(emailAttachments[fileBId]['key']);

      }else if(email['version']===2){
          var fileName=emailAttachments[fileBId]['fileName'];
           modKey=emailAttachments[fileBId]['modKey'];
           key=atob(emailAttachments[fileBId]['key']);
           version=2;
      }else if(email['version']==undefined || email['version']===1){
       //   var fileName=app.transform.from64str(emailAttachments[fileBId]['filename']);
           version=1;
           modKey='none';

           key =this.props.emailPin;

      }
      //console.log();

      var type=atob(emailAttachments[fileBId]['type']);
      var size=atob(emailAttachments[fileBId]['size']);
      var name=atob(emailAttachments[fileBId]['name']);

      //fileButton.html('<i class="fa fa-spin fa-refresh"></i> Downloading');

     downloadFileUnreg(fileName,modKey,version,async function(result){

         var decryptedFile64 = await decryptAes64bin(result, key);
         var decryptedFile=atob(decryptedFile64);
         var arbuf=base64ToArrayBuffer(decryptedFile);
         createDownloadLink(arbuf,type, name);

         fileButton.innerHTML='Download';
      });

  }
    function createDownloadLink(str,type, fileName){

        if(window.navigator.msSaveOrOpenBlob) {

            var fileData = [str];
            var blobObject = new Blob(fileData);

            var a = document.createElement('a');
            a.id='clickme';
            a.innerHTML = "Click to download file";

            var mydiv = document.getElementById("infoModBody");
            mydiv.appendChild(a);

            $('#clickme').click(function(){
                window.navigator.msSaveOrOpenBlob(blobObject, fileName);
            });

            $('#infoModal').modal('show');

        } else {

            var oMyBlob = new Blob([str], {type: type});
            var a = document.createElement('a');

            a.href = window.URL.createObjectURL(oMyBlob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

        }
    }
  async function downloadFileUnreg(fileName, modKey,version,callback) {

     // fileButton.html('Download');
      //   case "downloadFileUnreg":
      //                     var url = "/downloadFileUnregV2";
      //                     //	console.log('savings5');
      //                     //var anchor=postData['modKey'];
      //                     //postData['modKey']=app.user.get('modKey');
      //                     delete postData["userToken"];
      //                     break;

      var post = {
          'fileName': fileName,
          'modKey': modKey,
          'version':version
      };

      let response = await fetch(`/api/downloadFileUnregV2`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
      })
      let data = await response.json()

      if (data['response'] == "success") {
                  callback(data['data'])
              } else if (data['response'] == "fail") {
                //  app.notifications.systemMessage('fileNotFound');
              } else {
                  //app.notifications.systemMessage('tryAgain');
              }

    //  console.log(data);

      // let data =  response.json()*/
        // app.serverCall.ajaxRequest('downloadFileUnreg', post, function (result) {
        //
        //     if (result['response'] == "success") {
        //         callback(result['data'])
        //
        //     } else if (result['response'] == "fail") {
        //         app.notifications.systemMessage('fileNotFound');
        //     } else {
        //         app.notifications.systemMessage('tryAgain');
        //     }
        //     //console.log(result);
        //
        // });

    }
  async function doDelete(confirmed = false) {
    if (!confirmed && !confirm('Are you sure?')) return
    let response = await fetch(`/api/deleteEmailUnregV2`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messageId: messageId,
        modKey: message.modKey
      })
    })
    let data = await response.json()
    if (data.response === 'success') {
      location.href = '/'
    }
    // if (result['response']==='success') {
    //   app.notifications.systemMessage('msgRemoved');
    //   app.restartApp();
    // } else {
    //   app.notifications.systemMessage('tryAgain');
    // }
  }
    function displayAttachments(){
            var attachments=[];
            var files=[];
           // var thisComp=that;
            console.log(message.attachments);

            if(Object.keys(message.attachments).length>0){

                var size=0;
                Object.keys(message.attachments).forEach(function(key) {
                   size+=parseInt(atob(message.attachments[key]['size']));

                    files.push(
                        <span className="clearfix" key={"a"+key}>
                    			<br/>
                    			<span className="attchments" key={"as"+key}>{atob(message.attachments[key]['name'])}</span>&nbsp;
                    			<button  key={"ab"+key} id={key} className="btn btn-sm btn-primary pull-right 12" onClick={downloadFile}>Download</button>
                    		</span>
                    );

                });


                // $.each(message.attachments, function( index, attData ) {
                //     size+=parseInt(atob(attData['size']));
                //
                //     files.push(
                //         <span className="clearfix" key={"a"+index}>
				// 			<br/>
				// 			<span className="attchments" key={"as"+index}>{atob(attData['name'])}</span>
				// 			<button  key={"ab"+index} id={index} className="btn btn-sm btn-primary pull-right" onClick={thisComp.handleClick.bind(thisComp, 'downloadFile')}>Download</button>
				// 		</span>
                //     );
                // });

                size=(size > 1000000) ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';


                attachments.push(
                    <div className="panel-footer" key='1'>
                        <h5>Attchments ({Object.keys(message.attachments).length} file(s), {size})</h5>
                        <div className="alert alert-warning text-left"  key='2'>Please use <b>EXTREME</b> caution when downloading files. We strongly recommend scanning them for viruses/malware after downloading.</div><div className="inbox-download"></div>


                        {files}
                    </div>

                );

            }


            return attachments;

    }

  return (
    <div className={styles.page}>
      <header className={classNames(styles.header, 'bg-body')}>
        <nav className="navbar navbar-expand">
          <div className='container'>
            <a href="/" className="text-reset navbar-brand">
              <MailumSVG className={styles.brand} />
            </a>

            <ul className={classNames(styles.buttons, 'navbar-nav')}>
              <li className='nav-item fw-medium d-none d-md-block'>
                <a href="/" className={classNames(styles.premium, 'btn btn-primary')}>
                  <CrownIconSVG />
                  Premium Plans
                </a>
              </li>
              <li className='nav-item fw-medium'>
                <a href='/mailbox/#login' className='btn btn-outline-primary'>Sign In</a>
              </li>
              <li className='nav-item fw-medium'>
                <a href='/mailbox/#signup' className='btn btn-primary'>Sign Up</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main className={classNames(styles.content, 'container')}>
        { message ?
          <div className='card'>
            <div className='card-header'>
              <strong className={styles.title}>{ message.meta.subject }</strong>
              <div className={classNames('text-muted', styles.timestamp)}>{ message.meta.timeSent.toLocaleString() }</div>
            </div>
            <div className='card-body'>
              <header>
                <div className={styles.meta}>
                  <div className={styles.avatar}>
                    <span>{message.meta.from.charAt(0)}</span>
                  </div>
                  <div className={styles.fromTo}>
                    <div className={styles.from}>{ message.meta.from }</div>
                    <div className={styles.to}>To: { getEmailsFromString(message.meta.to[0]) }</div>
                  </div>
                </div>
                <div className={styles.controls}>
                { isReplying &&
                  <>
                    {/* TODO sent state */}
                    <button disabled={isSending} className='btn btn-primary btn-sm' onClick={doReply}>
                      Send
                    </button>
                    <button disabled={isSending} className='btn btn-outline-primary btn-sm' onClick={() => setIsReplying(false)}>
                      Cancel
                    </button>
                  </>
                }

                {!isReplying &&
                  <>
                    <button className='btn btn-sm btn-link' onClick={() => setIsReplying(true)}>
                      <ReplyIconSVG />
                    </button>
                    <div className='btn-group btn-group-sm d-none d-md-block' role='group' ariaLabel='Small button group'>
                      <button onClick={() => setViewHtml(false)} type="button" className={classNames('btn', viewHtml ? 'btn-outline-primary' : 'btn-primary')}>Plain</button>
                      <button onClick={() => setViewHtml(true)} type="button" className={classNames('btn', viewHtml ? 'btn-primary' : 'btn-outline-primary')}>HTML</button>
                    </div>
                    <button className='btn btn-sm btn-link' onClick={() => doDelete()}>
                      <DeleteIconSVG />
                    </button>
                  </>
                }
                </div>
              </header>
              {!isReplying &&
                <div className={classNames(styles.plainViewMobile, 'text-muted d-md-none')}>
                  If there is any issues with your internet connection, try this.
                  <div className='btn-group btn-group-sm ' role='group' ariaLabel='Small button group'>
                    <button onClick={() => setViewHtml(false)} type="button" className={classNames('btn', viewHtml ? 'btn-outline-primary' : 'btn-primary')}>Plain</button>
                    <button onClick={() => setViewHtml(true)} type="button" className={classNames('btn', viewHtml ? 'btn-primary' : 'btn-outline-primary')}>HTML</button>
                  </div>
                </div>
              }
              <main>
            { !isReplying && (
                viewHtml ?
                <div dangerouslySetInnerHTML={{ __html: message.body.html }} /> :
                <pre>{stripHtml(message.body.html.split('<br>').join('\n'))}</pre>
            )}
            { isReplying &&
              <ReactQuill
                theme='snow'
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', 'blockquote', {'list': 'ordered'}, {'list': 'bullet'}, 'link', 'clean']
                  ]
                }}
                value={replyHtml}
                onChange={setReplyHtml}
              />
            }
                  {displayAttachments()}
              </main>
            </div>
          </div> :
          <div className={classNames(styles.loader, 'd-flex align-items-center justify-content-center')}>
          { isNoLongerAvailable ?
            <p className='text-muted'>This email is no longer available.</p> :
            <div className='spinner-border' role='status' >
              <span className='visually-hidden'>Loading...</span>
            </div>
          }
          </div>
        }
      </main>

      <footer>
        <div className='container'>
          <div className={styles.brandSection}>
            <MailumSVG className={styles.brand} />
            <div className={styles.copyright}>© 2020-{new Date().getFullYear()}, Cyberfear. All rights reserved.</div>
          </div>

          <ul className={styles.social}>
            <li>
              <a href="">
                <TwitterIconSVG />
              </a>
            </li>
            <li>
              <a href="">
                <FacebookIconSVG />
              </a>
            </li>
            <li>
              <a href="">
                <RedditIconSVG />
              </a>
            </li>
          </ul>

          <ul className={styles.links}>
            <li>
              <a href="">GitHub</a>
            </li>
            <li>
              <a href="">Blog</a>
            </li>
            <li>
              <a href="">Privacy Policy</a>
            </li>
            <li>
              <a href="">Terms & Conditions</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

Email.path = '/email/:messageId'

function stripHtml(html)
{
   let tmp = document.createElement('div')
   tmp.innerHTML = filterXSS(html)
   return tmp.textContent || tmp.innerText || ''
}

function IsEmail(email) {
  var regex =
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])\.?$/i;

  return regex.test(email);
}

function getEmailsFromString(input) {
  var ret = [];
  input = input.toLowerCase();
  //var email = /\<([^\>]+)\>/g;
  var email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

  var match;
  if (input.indexOf("<") != -1 || input.indexOf("&lt;") != -1) {
      while ((match = email.exec(input)))
          if (IsEmail(match[1])) {
              ret = match[1];
          } else {
              ret = input;
              //ret=input;
          }
      return ret;
  } else return input;
}

// async function sha256(str) {
//   const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
//   return toHexString(buf)
// }

// async function sha512(str) {
//   const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(str))
//   return toHexString(buf)
// }





// function toHexString(byteArray) {
//   return Array.from(new Uint8Array(byteArray), function(byte) {
//     return ('0' + (byte & 0xFF).toString(16)).slice(-2);
//   }).join('')
// }

function filterXSSwhite(html) {
  if (html != "") {
      var messageDisplayedBody = filterXSS(html, {
          whiteList: {
              a: ["target", "href", "title", "class", "style"],
              abbr: ["title"],
              address: [],
              article: ["class", "style"],
              aside: [],
              b: [],
              bdi: ["dir"],
              bdo: ["dir"],
              big: [],
              blockquote: ["cite"],
              br: [],
              body: ["class", "style"],
              caption: [],
              center: [],
              cite: [],
              code: [],
              col: ["align", "valign", "span", "width"],
              colgroup: ["align", "valign", "span", "width"],
              dd: [],
              del: ["datetime"],
              details: ["open"],
              div: ["class", "style"],
              dl: [],
              dt: [],
              em: [],
              font: ["color", "size", "face"],
              footer: ["class", "style"],
              h1: ["class", "style"],
              h2: ["class", "style"],
              h3: ["class", "style"],
              h4: ["class", "style"],
              h5: ["class", "style"],
              h6: ["class", "style"],
              header: ["class", "style"],
              hr: [],
              i: [],
              img: [
                  "src",
                  "alt",
                  "title",
                  "width",
                  "height",
                  "class",
                  "style",
              ],
              ins: ["datetime"],
              li: ["class", "style"],
              mark: [],
              nav: [],
              ol: [],
              p: ["class", "style"],
              pre: [],
              s: [],
              section: [],
              small: [],
              span: ["class", "style"],
              sub: [],
              sup: [],
              strong: [],
              style: [],
              table: ["width", "border", "align", "valign", "style"],
              tbody: ["align", "valign"],
              td: ["width", "colspan", "align", "valign", "style"],
              tfoot: ["align", "valign"],
              th: ["width", "colspan", "align", "valign"],
              thead: ["align", "valign"],
              tr: ["rowspan", "align", "valign", "style"],
              tt: [],
              u: [],
              ul: ["style"],
          },
      });

      return messageDisplayedBody;
  }
  return html;
}
