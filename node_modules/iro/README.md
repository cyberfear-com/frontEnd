# iro

```javascript
new iro.Color('hsla(228,80,32,1.0)')
  .o('r',60).o('h',20).o('k',-10).css('hex');
```

The above example does:

- Create object from HSLA string
- Increase red by 60
- Rorate hue by 20
- Decrease black by 10
- Format as HTML HEX format

API documentation: [English](doc/api.md)/[Japanese](doc/api-ja.md)

# For Node.js (npm)

Install via npm.

```
npm install iro --save
```

```javascript
const iro = require('iro');
var c = new iro.Color("...");
```

# For Webpages 

Download `iro.js` OR `iro.min.js`, and add script tag into your HTML.

```HTML
<script type="text/javascript" src="iro.min.js"></script>
```

# The MIT License (MIT)

This package is provided under the MIT License.

Copyright &copy; 2016 Retorillo
