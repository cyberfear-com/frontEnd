/**
 * Node.js module for Forge.
 *
 * @author Dave Longley
 *
 * Copyright 2011-2014 Digital Bazaar, Inc.
 */
(function() {
var name = 'forge';
if(typeof define !== 'function') {
  // NodeJS -> AMD
  if(typeof module === 'object' && module.exports) {
    var nodeJS = true;
    define = function(ids, factory) {
      factory(require, module);
    };
  } else {
    // <script>
    if(typeof forge === 'undefined') {
      // set to true to disable native code if even it's available
      forge = {disableNativeCode: false};
    }
    return;
  }
}
// AMD
var deps;
var defineFunc = function(require, module) {
  module.exports = function(forge) {
    var mods = deps.map(function(dep) {
      return require(dep);
    });
    // handle circular dependencies
    forge = forge || {};
    forge.defined = forge.defined || {};
    if(forge.defined[name]) {
      return forge[name];
    }
    forge.defined[name] = true;
    for(var i = 0; i < mods.length; ++i) {
      mods[i](forge);
    }
    return forge;
  };
  // set to true to disable native code if even it's available
  module.exports.disableNativeCode = false;
  module.exports(module.exports);
};
var tmpDefine = define;
define = function(ids, factory) {
  deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
  if(nodeJS) {
    delete define;
    return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
  }
  define = tmpDefine;
  return define.apply(null, Array.prototype.slice.call(arguments, 0));
};
define([
  'require',
  'module',
  '/js/main/forge/aes.js',
//  '/js/main/forge/aesCipherSuites.js',
//  '/js/main/forge/asn1.js',
//  '/js/main/forge/cipher.js',
//  '/js/main/forge/cipherModes.js',
//  '/js/main/forge/debug.js',
//  '/js/main/forge/des.js',
//  '/js/main/forge/hmac.js',
//  '/js/main/forge/kem.js',
//  '/js/main/forge/log.js',
//  '/js/main/forge/md.js',
//  '/js/main/forge/mgf1.js',
   '/js/main/forge/sha512.js',
  '/js/main/forge/pbkdf2.js',
//  '/js/main/forge/pem.js',
	// '/js/main/forge/pkcs7.js',
	// '/js/main/forge/pkcs1.js',
	// '/js/main/forge/pkcs12.js',
	'/js/main/forge/pki.js',
	// '/js/main/forge/prime.js',
	// '/js/main/forge/prng.js',
	// '/js/main/forge/pss.js',
	'/js/main/forge/random.js',
	// '/js/main/forge/rc2.js',
	'/js/main/forge/ssh.js',
	// '/js/main/forge/task.js',
	// '/js/main/forge/tls.js',
//  '/js/main/forge/util.js'
], function() {
  defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
});
})();
