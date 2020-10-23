Host CyberFear web interface on your own computer.

If you are not a tech savy user, we recommend using our main website - cyberfear.com.

There are many advantages of hosting it yourself:

- no risk of malicious code modification by hackers/cyberfear staff/authorities.

Logging in through the main websites comes with several risks.
Someone could modify the scripts to steal your password.
Someone could modify the scripts to perform unwanted operations in your browser.
You have to trust that there has been no breach of any kind.
When you host the frontend yourself, you can verify that the code does not contain anything malicious.

- Custom "hashToken" (part of the salt)

You can modify app/models/variable/defaultSettings.js file to set a custom salt word.
If you set a custom hashToken and register your account, then even if someone steals your password, then goes to cyberfear.com and tries to login - he will fail.
You will only be able to login using the locally hosted frontend with custom hashToken. 
If you choose to modify the hashToken, make sure you do not lose it because you will lose access to your account.

- Speed

Locally hosted frontend will load faster.




Usage Guide:

1. Install node.js
2. Install git
3. Run command: git clone git@github.com:cyberfear-com/frontEnd.git [localfolder]
4. Inside the new folder, run command: git checkout localCode
5. Open the following directory: app/models/variable/ and copy defaultSettings_default.js to defaultSettings.js
6. In base folder run command: ./watch.sh
7. Run command: node server.js
8. Visit: localhost:3128 in your favorite browser

Enjoy!
