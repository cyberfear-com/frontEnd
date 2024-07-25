var _self = this;
var _useHsv = Color.isClassOf(arguments[0]) ? arguments[0].useHsv : Color.useHsv;
var _model = Color.models.rgb;
var _invalid = [false, false, false];
var _updating = false;
function update(curmodel, reqmodel) {
  if (_updating) return;
  if (curmodel === reqmodel) return;
  if (!_invalid[reqmodel]) return;
  try {
    _updating = true;
    var rgb = null;
    switch (curmodel) {
      case Color.models.hsx:
        if (_useHsv)
          rgb = Color.hsv2rgb(_self);
        else
          rgb = Color.hsl2rgb(_self);
        break;
      case Color.models.cmyk:
        rgb = Color.cmyk2rgb(_self);
        break;
      case Color.models.rgb:
        rgb = _self;
        break;
    }
    switch (reqmodel) {
      case Color.models.hsx:
        if (_useHsv) {
          var hsv = Color.rgb2hsv(rgb);
          _self.hsv(hsv.h, hsv.s, hsv.v);
        }
        else {
          var hsl = Color.rgb2hsl(rgb);
          _self.hsl(hsl.h, hsl.s, hsl.l);
        }
        break;
      case Color.models.cmyk:
        var cmyk = Color.rgb2cmyk(rgb);
        _self.cmyk(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
        break;
      case Color.models.rgb:
        _self.rgb(rgb.r, rgb.g, rgb.b);
        break;
    }
    _invalid[reqmodel] = false;
    if (!_invalid[Color.models.rgb]) {
      _self.rgb(rgb.r, rgb.g, rgb.b);
      _invalid[Color.models.rgb] = false;
    }
  }
  finally {
    _updating = false;
  }
}
function prop(name, value, model, settings) {
  var field = settings.limiter(value, settings.max);
  var locked = false;
  Object.defineProperty(_self, name, {
    configurable: true,
    get: function () {
      if (locked)
        throw new Error(['"', name, '" is inaccessible'].join(''));
      if (model != null)
        update(_model, model);
      return field;
    },
    set: function (value) {
      if (locked)
        throw new Error(['"', name, '" is inaccessible'].join(''));
      if (model != null)
        update(_model, model);
      field = settings.limiter(value, settings.max);
      if (model == null || _updating) return;
      for (var c = 0; c < _invalid.length; c++)
        _invalid[c] = c != model;
      _model = model;
    }
  });
  return {
    get: function () { return field },
    set: function (value) { field = value; },
    lock: function () { locked = true; },
    unlock: function () { locked = false; }
  }
}
var _r = prop('r', 0, Color.models.rgb, Color.settings.r);
var _g = prop('g', 0, Color.models.rgb, Color.settings.g);
var _b = prop('b', 0, Color.models.rgb, Color.settings.b);
var _h = prop('h', 0, Color.models.hsx, Color.settings.h);
var _s = prop('s', 0, Color.models.hsx, Color.settings.s);
var _v = prop('v', 0, Color.models.hsx, Color.settings.x);
var _l = prop('l', 0, Color.models.hsx, Color.settings.x);
var _c = prop('c', 0, Color.models.cmyk, Color.settings.c);
var _m = prop('m', 0, Color.models.cmyk, Color.settings.m);
var _y = prop('y', 0, Color.models.cmyk, Color.settings.y);
var _k = prop('k', 0, Color.models.cmyk, Color.settings.k);
var _a = prop('a', 1.0, null, Color.settings.a);
Object.defineProperty(_self, 'clsid', {
  get: function () { return CLSID_COLOR; },
});
Object.defineProperty(_self, 'model', {
  get: function () { return _model; },
});
Object.defineProperty(_self, 'useHsv', {
  get: function () {
    return _useHsv;
  },
  set: function (value) {
    if ((_useHsv && value) || (!_useHsv && !value)) return;
    if (_model != Color.models.hsx) {
      _invalid[Color.models.hsx] = true;
      if (value) {
        _v.unlock();
        _l.lock();
      }
      else {
        _l.unlock();
        _v.lock();
      }
    }
    else {
      if (value) {
        var hsv = Color.rgb2hsv(this);
        this.h = hsv.h;
        this.s = hsv.s;
        _v.unlock();
        this.v = hsv.v;
        _l.lock();
      }
      else {
        var hsl = Color.rgb2hsl(this);
        this.h = hsl.h;
        this.s = hsl.s;
        _l.unlock();
        this.l = hsl.l;
        _v.lock();
      }
    }

    _useHsv = value;
  }
});
if (_useHsv) _l.lock();
else _v.lock();
if (arguments[0] !== undefined) {
  if (typeof(arguments[0]) == 'string'
    && Color.str2format(arguments[0], null) != null)
    throw Error('"', arguments[0], '" is invalid argument');
  this.css(arguments[0]);
}
this.dump = function () {
  var dp = function (prop) { return prop.get().toFixed(2) }
  var rgb = [dp(_r), dp(_g), dp(_b)];
  var cmyk = [dp(_c), dp(_m), dp(_y), dp(_k)];
  var hsx = this.useHsv ? [dp(_h), dp(_s), dp(_v)] : [dp(_h), dp(_s), dp(_l)];
  var eq = ' == '; var neq = ' != ';
  var rgbeq = _invalid[Color.models.rgb] ? neq : eq;
  var cmykeq = _invalid[Color.models.cmyk] ? neq : eq;
  var hsxeq = _invalid[Color.models.hsx] ? neq : eq;
  var hsxlbl = this.useHsv ? 'HSV' : 'HSL';
  return ['ALPHA', eq, dp(_a), '\n',
    'RGB', rgbeq, rgb.join(', '), '\n',
    'CMYK', cmykeq, cmyk.join(', '), '\n',
    hsxlbl, hsxeq, hsx.join(', ')].join('');
}

