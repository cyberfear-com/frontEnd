/*! iro.color.js / The MIT Lisense / (c) 2015-2016 Retorillo */
var iro = iro || {
  version: 'beta1'
};
iro.Color = function(undefined) {
  var CLSID_COLOR = {};
  function Color() {
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
            } else {
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
      } finally {
        _updating = false;
      }
    }
    function prop(name, value, model, settings) {
      var field = settings.limiter(value, settings.max);
      var locked = false;
      Object.defineProperty(_self, name, {
        configurable: true,
        get: function() {
          if (locked)
            throw new Error(['"', name, '" is inaccessible'].join(''));
          if (model != null)
            update(_model, model);
          return field;
        },
        set: function(value) {
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
        get: function() {
          return field
        },
        set: function(value) {
          field = value;
        },
        lock: function() {
          locked = true;
        },
        unlock: function() {
          locked = false;
        }
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
      get: function() {
        return CLSID_COLOR;
      },
    });
    Object.defineProperty(_self, 'model', {
      get: function() {
        return _model;
      },
    });
    Object.defineProperty(_self, 'useHsv', {
      get: function() {
        return _useHsv;
      },
      set: function(value) {
        if ((_useHsv && value) || (!_useHsv && !value)) return;
        if (_model != Color.models.hsx) {
          _invalid[Color.models.hsx] = true;
          if (value) {
            _v.unlock();
            _l.lock();
          } else {
            _l.unlock();
            _v.lock();
          }
        } else {
          if (value) {
            var hsv = Color.rgb2hsv(this);
            this.h = hsv.h;
            this.s = hsv.s;
            _v.unlock();
            this.v = hsv.v;
            _l.lock();
          } else {
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
      if (typeof (arguments[0]) == 'string'
        && Color.str2format(arguments[0], null) != null)
        throw Error('"', arguments[0], '" is invalid argument');
      this.css(arguments[0]);
    }
    this.dump = function() {
      var dp = function(prop) {
        return prop.get().toFixed(2)
      }
      var rgb = [dp(_r), dp(_g), dp(_b)];
      var cmyk = [dp(_c), dp(_m), dp(_y), dp(_k)];
      var hsx = this.useHsv ? [dp(_h), dp(_s), dp(_v)] : [dp(_h), dp(_s), dp(_l)];
      var eq = ' == ';
      var neq = ' != ';
      var rgbeq = _invalid[Color.models.rgb] ? neq : eq;
      var cmykeq = _invalid[Color.models.cmyk] ? neq : eq;
      var hsxeq = _invalid[Color.models.hsx] ? neq : eq;
      var hsxlbl = this.useHsv ? 'HSV' : 'HSL';
      return ['ALPHA', eq, dp(_a), '\n',
        'RGB', rgbeq, rgb.join(', '), '\n',
        'CMYK', cmykeq, cmyk.join(', '), '\n',
        hsxlbl, hsxeq, hsx.join(', ')].join('');
    }


  }

  Color.epsilon = 1e-12;
  Color.isClassOf = function(obj) {
    return obj != null && obj.clsid === CLSID_COLOR;
  }
  Color.useHsv = false;
  Color.formats = {};
  Color.formats.rgba = 0;
  Color.formats.hsla = 1;
  Color.formats.rgb = 2;
  Color.formats.hsl = 3;
  Color.formats.hex = 4;
  Color.models = {};
  Color.models.rgb = 0;
  Color.models.hsx = 1;
  Color.models.cmyk = 2;
  Color.limiters = {};
  Color.limiters.circuit = function(v, max) {
    var r = v % max;
    if (r < 0)
      r += max;
    return r;
  }
  Color.limiters.linear = function(v, max) {
    return Math.max(0, Math.min(v, max));
  }
  Color.settings = {};
  Color.settings.a = {
    max: 1,
    limiter: Color.limiters.linear,
  };
  Color.settings.r = {
    max: 255,
    limiter: Color.limiters.linear
  };
  Color.settings.g = {
    max: 255,
    limiter: Color.limiters.linear
  };
  Color.settings.b = {
    max: 255,
    limiter: Color.limiters.linear,
  };
  Color.settings.h = {
    max: 360,
    limiter: Color.limiters.circuit,
  };
  Color.settings.s = {
    max: 100,
    limiter: Color.limiters.linear,
  };
  Color.settings.x = {
    max: 100,
    limiter: Color.limiters.linear,
  };
  Color.settings.c = {
    max: 100,
    limiter: Color.limiters.linear,
  };
  Color.settings.m = {
    max: 100,
    limiter: Color.limiters.linear,
  };
  Color.settings.y = {
    max: 100,
    limiter: Color.limiters.linear,
  };
  Color.settings.k = {
    max: 100,
    limiter: Color.limiters.linear,
  };
  Color.blends = {};
  Color.blends.normal = function(m, i) {
    return m;
  };
  Color.blends.multiply = function(m, i) {
    return (m * i) / 255;
  };
  Color.blends.divide = function(m, i) {
    return (256 * i) / (m + 1);
  };
  Color.blends.screen = function(m, i) {
    return 255 - ((255 - m) * (255 - i)) / 255;
  };
  Color.blends.overlay = function(m, i) {
    return (i / 255) * (i + ((2 * m) / 255) * (255 - i));
  };
  Color.blends.dodge = function(m, i) {
    return (256 * i) / ((255 - m) + 1);
  }
  Color.blends.burn = function(m, i) {
    return 255 - (256 * (255 - i)) / (m + 1);
  }
  Color.blends.hardlight = function(m, i) {
    if (m > 128) return 255 - ((255 - 2 * (m - 128)) * (255 - i)) / 256;
    else return (2 * m * i) / 256;
  }
  Color.blends.softlight = function(m, i) {
    var r = Color.blends.screen(m, i);
    return ((255 - i) * m * r) / 255 * i;
  }
  Color.blends.difference = function(m, i) {
    return Math.abs(i - m);
  }
  Color.blends.add = function(m, i) {
    return m + i;
  }
  Color.blends.subtract = function(m, i) {
    return i - m;
  }
  Color.blends.darken = function(m, i) {
    return Math.min(m, i);
  }
  Color.blends.lighten = function(m, i) {
    return Math.max(m, i);
  }
  Color.rgb2hsl = function(rgb) {
    var r = Color.settings.r.limiter(rgb.r, Color.settings.r.max) / Color.settings.r.max;
    var g = Color.settings.g.limiter(rgb.g, Color.settings.g.max) / Color.settings.g.max;
    var b = Color.settings.b.limiter(rgb.b, Color.settings.b.max) / Color.settings.b.max;
    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var c = M - m;
    var h;
    if (c == 0)
      h = 0;else if (M == r)
      h = (((g - b) / c) % 6) / 6;else if (M == g)
      h = (b - r) / (c * 6) + 1 / 3;
    else
      h = (r - g) / (c * 6) + 2 / 3
    var l = (M + m) / 2;
    var s = c == 0 ? 0 : (M + m >= 1 ? c / (2 - M - m) : c / (M + m));
    return {
      h: Color.settings.h.limiter(h * Color.settings.h.max, Color.settings.h.max),
      s: Color.settings.s.limiter(s * Color.settings.s.max, Color.settings.s.max),
      l: Color.settings.x.limiter(l * Color.settings.x.max, Color.settings.s.max),
    };
  }
  Color.hsl2rgb = function(hsl) {
    var h = Color.settings.h.limiter(hsl.h, Color.settings.h.max) / Color.settings.h.max;
    var s = Color.settings.s.limiter(hsl.s, Color.settings.s.max) / Color.settings.s.max;
    var l = Color.settings.x.limiter(hsl.l, Color.settings.x.max) / Color.settings.x.max;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var h2 = h * 6;
    var x = c * (1 - Math.abs(h2 % 2 - 1));
    var m = l - 0.5 * c;
    var rgb1 = [m, m, m];
    var rgb2 = null;
    if (0 <= h2 && h2 < 1)
      rgb2 = [c, x, 0];else if (1 <= h2 && h2 < 2)
      rgb2 = [x, c, 0];else if (2 <= h2 && h2 < 3)
      rgb2 = [0, c, x];else if (3 <= h2 && h2 < 4)
      rgb2 = [0, x, c];else if (4 <= h2 && h2 < 5)
      rgb2 = [x, 0, c];
    else
      rgb2 = [c, 0, x];
    return {
      r: Color.settings.r.limiter((rgb1[0] + rgb2[0]) * Color.settings.r.max, Color.settings.r.max),
      g: Color.settings.g.limiter((rgb1[1] + rgb2[1]) * Color.settings.g.max, Color.settings.g.max),
      b: Color.settings.b.limiter((rgb1[2] + rgb2[2]) * Color.settings.b.max, Color.settings.b.max),
    };
  }
  Color.rgb2hsv = function(rgb) {
    var r = Color.settings.r.limiter(rgb.r, Color.settings.r.max) / Color.settings.r.max;
    var g = Color.settings.g.limiter(rgb.g, Color.settings.g.max) / Color.settings.g.max;
    var b = Color.settings.b.limiter(rgb.b, Color.settings.b.max) / Color.settings.b.max;
    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var c = M - m;
    var h;
    if (c == 0)
      h = 0;else if (M == r)
      h = (((g - b) / c) % 6) / 6;else if (M == g)
      h = (b - r) / (c * 6) + 1 / 3;
    else
      h = (r - g) / (c * 6) + 2 / 3
    var v = M;
    var s = v == 0 ? 0 : c / v;
    return {
      h: Color.settings.h.limiter(h * Color.settings.h.max, Color.settings.h.max),
      s: Color.settings.s.limiter(s * Color.settings.s.max, Color.settings.s.max),
      v: Color.settings.x.limiter(v * Color.settings.x.max, Color.settings.x.max),
    };
  }
  Color.hsv2rgb = function(hsv) {
    var h = Color.settings.h.limiter(hsv.h, Color.settings.h.max) / Color.settings.h.max;
    var s = Color.settings.s.limiter(hsv.s, Color.settings.s.max) / Color.settings.s.max;
    var v = Color.settings.x.limiter(hsv.v, Color.settings.x.max) / Color.settings.x.max;
    var c = v * s;
    var h2 = 6 * h;
    var x = c * (1 - Math.abs(h2 % 2 - 1));
    var m = v - c;
    var rgb1 = [m, m, m];
    var rgb2;
    if (0 <= h2 && h2 < 1)
      rgb2 = [c, x, 0];else if (1 <= h2 && h2 < 2)
      rgb2 = [x, c, 0];else if (2 <= h2 && h2 < 3)
      rgb2 = [0, c, x];else if (3 <= h2 && h2 < 4)
      rgb2 = [0, x, c];else if (4 <= h2 && h2 < 5)
      rgb2 = [x, 0, c];
    else
      rgb2 = [c, 0, x];
    return {
      r: Color.settings.r.limiter((rgb1[0] + rgb2[0]) * Color.settings.r.max, Color.settings.r.max),
      g: Color.settings.g.limiter((rgb1[1] + rgb2[1]) * Color.settings.g.max, Color.settings.g.max),
      b: Color.settings.b.limiter((rgb1[2] + rgb2[2]) * Color.settings.b.max, Color.settings.b.max),
    };
  }
  Color.rgb2cmyk = function(rgb) {
    var r = Color.settings.r.limiter(rgb.r, Color.settings.r.max) / Color.settings.r.max;
    var g = Color.settings.g.limiter(rgb.g, Color.settings.g.max) / Color.settings.g.max;
    var b = Color.settings.b.limiter(rgb.b, Color.settings.b.max) / Color.settings.b.max;
    var k = 1 - Math.max(r, g, b);
    var c = k == 1 ? 0 : ((1 - r - k) / (1 - k));
    var m = k == 1 ? 0 : ((1 - g - k) / (1 - k));
    var y = k == 1 ? 0 : ((1 - b - k) / (1 - k));
    return {
      c: Color.settings.c.limiter(c * Color.settings.c.max, Color.settings.c.max),
      m: Color.settings.m.limiter(m * Color.settings.m.max, Color.settings.m.max),
      y: Color.settings.y.limiter(y * Color.settings.y.max, Color.settings.y.max),
      k: Color.settings.k.limiter(k * Color.settings.k.max, Color.settings.k.max),
    };
  }
  Color.cmyk2rgb = function(cmyk) {
    var c = Color.settings.c.limiter(cmyk.c, Color.settings.c.max) / Color.settings.c.max;
    var m = Color.settings.m.limiter(cmyk.m, Color.settings.m.max) / Color.settings.m.max;
    var y = Color.settings.y.limiter(cmyk.y, Color.settings.y.max) / Color.settings.y.max;
    var k = Color.settings.k.limiter(cmyk.k, Color.settings.k.max) / Color.settings.k.max;
    var r = (1 - c) * (1 - k);
    var g = (1 - m) * (1 - k);
    var b = (1 - y) * (1 - k);
    return {
      r: Color.settings.r.limiter(r * Color.settings.r.max, Color.settings.r.max),
      g: Color.settings.g.limiter(g * Color.settings.g.max, Color.settings.g.max),
      b: Color.settings.b.limiter(b * Color.settings.b.max, Color.settings.b.max),
    };
  }
  Color.str2format = function(str, fallback) {
    if (str != null) {
      str = str.toLowerCase();
      for (var f in Color.formats)
        if (f == str)
          return Color.formats[f];
    }
    if (fallback !== undefined) return fallback;
    throw new Error(['"', str, '" is invalid argument'].join(''));
  }
  Color.str2blend = function(str, fallback) {
    if (str != null) {
      str = str.toLowerCase();
      for (var b in Color.blends)
        if (b == str)
          return Color.blends[b];
    }
    if (fallback !== undefined) return fallback;
    throw new Error(['"', str, '" is invalid argument'].join(''));
  }
  Color.name = function() {
    if (arguments.length == 0) {
      var namelist = [];
      for (var c = 0; c < nameColors.length; c += 2)
        namelist.push(nameColors[c]);
      return namelist;
    }

    var name = arguments[0];
    name = name.toLowerCase();

    if (arguments.length == 1) {
      for (var c = 0; c < nameColors.length; c += 2)
        if (nameColors[c] == name)
          return nameColors[c + 1];
      throw new Error(['"', name, '" is invalid color name'].join(''));
    }

    if (Color.str2format(name, null) != null)
      throw new Error(['"', name, '" cannnot be used for color name.'].join(''));

    var value = arguments[1];
    var index = -1;
    for (var c = 0; c < nameColors.length; c += 2)
      if (nameColors[c] == name) {
        index = c;
        break;
    }
    if (index != -1 && value != null)
      nameColors[index + 1] = value;else if (index != -1)
      nameColors.splice(index, 2);else if (value != null)
      nameColors.push(name, value);
  }
  Color.prototype.hsl = function() {
    var args = arguments;
    if (args.length == 0) {
      if (this.useHsv) {
        var c = this.clone();
        c.useHsv = false;
        return c.hsl();
      }
      return [this.h, this.s, this.l, this.a];
    }
    this.useHsv = false;
    var args = arguments;
    if (args.length == 0)
      return [this.h, this.s, this.l, this.a];
    var array = args.length == 1 ? (args[0] instanceof Array ? args[0] :
      [args[0].h, args[0].s, args[0].l, args[0].a]) : args;
    this.h = array[0];
    this.s = array[1];
    this.l = array[2];
    this.a = array[3] !== undefined ? array[3] : this.a;
    return this;
  }
  Color.prototype.hsv = function() {
    var args = arguments;
    if (args.length == 0) {
      if (!this.useHsv) {
        var c = this.clone();
        c.useHsv = true;
        return c.hsv();
      }
      return [this.h, this.s, this.v, this.a];
    }
    this.useHsv = true;
    var array = args.length == 1 ? (args[0] instanceof Array ? args[0] :
      [args[0].h, args[0].s, args[0].v, args[0].a]) : args;
    this.h = array[0];
    this.s = array[1];
    this.v = array[2];
    this.a = array[3] !== undefined ? array[3] : this.a;
    return this;
  }
  Color.prototype.cmyk = function() {
    var args = arguments;
    if (args.length == 0)
      return [this.c, this.m, this.y, this.k, this.a];
    var array = args.length == 1 ? (args[0] instanceof Array ? args[0] :
      [args[0].c, args[0].m, args[0].y, args[0].k, args[0].a]) : args;
    this.c = array[0];
    this.m = array[1];
    this.y = array[2];
    this.k = array[3];
    this.a = array[4] !== undefined ? array[4] : this.a;
    return this;
  }
  Color.prototype.rgb = function() {
    var args = arguments;
    if (args.length == 0)
      return [this.r, this.g, this.b, this.a];
    var array = args.length == 1 ? (args[0] instanceof Array ? args[0] :
      [args[0].r, args[0].g, args[0].b, args[0].a]) : args;
    ;
    this.r = array[0];
    this.g = array[1];
    this.b = array[2];
    this.a = array[3] !== undefined ? array[3] : this.a;
    return this;
  }
  Color.prototype.offset = function(prop, value) {
    this[prop] += value;
    return this;
  }
  Color.prototype.o = Color.prototype.offset;
  Color.prototype.clone = function() {
    var c = new Color(this);
    c.useHsv = this.useHsv;
    return c;
  }
  Color.prototype.css = function() {
    var arg = arguments[0];
    if (Color.isClassOf(arg)) {
      switch (arg.model) {
        case Color.models.cmyk:
          this.cmyk(arg);
          break;
        case Color.models.hsx:
          this.useHsv ? this.hsv(arg) : this.hsx(arg);
          break;
        default:
          this.rgb(arg);
          break;
      }
      return this;
    }
    if (typeof (arg) == 'string')
      arg = Color.str2format(arg, arg);
    if (typeof (arg) == 'string') {
      var m = /^(rgb|rgba|hsl|hsla)\((\d+),(\d+)%?,(\d+)%?(?:,(\d+(?:\.\d+)?))?\)$|^#?([\da-f]{6}|[\da-f]{3})$/i
        .exec(arg.replace(/\s+/g, ''));
      if (m == null)
        return this.css(Color.name(arg));
      var g = 1;
      var type = (m[g++] || '').toLowerCase();
      var nums = [g++, g++, g++, g++];
      nums.forEach(function(itm, idx) {
        nums[idx] = m[itm] ? parseFloat(m[itm]) : 1.0;
      });
      var hex = m[g++];
      var hex3 = hex != null && hex.length == 3;
      switch (type) {
        case 'hsl':
        case 'hsla':
          this.hsl(nums[0] / 360 * Color.settings.h.max,
            nums[1] / 100 * Color.settings.s.max,
            nums[2] / 100 * Color.settings.x.max,
            nums[3]);
          break;
        default:
          this.rgb((hex ? parseInt(hex3 ? hex[0] + hex[0] : hex.substr(0, 2), 16) : nums[0]) / 255 * Color.settings.r.max,
            (hex ? parseInt(hex3 ? hex[1] + hex[1] : hex.substr(2, 2), 16) : nums[1]) / 255 * Color.settings.g.max,
            (hex ? parseInt(hex3 ? hex[2] + hex[2] : hex.substr(4, 2), 16) : nums[2]) / 255 * Color.settings.b.max,
            nums[3]);
          break;
      }
      return this;
    } else {
      var value = this;
      var format = arg;
      if (format && (format === Color.formats.hsla || format === Color.formats.hsl) && this.useHsv) {
        value = this.clone();
        value.useHsv = false;
      }
      var safeone = function(one) {
        return Math.min(1.0, Math.max(0, one));
      }
      var safeint = function(one, muliplier) {
        return Math.round(safeone(one) * muliplier);
      }
      var r,
        g,
        b,
        h,
        s,
        l;
      var a = safeone(value.a).toFixed(1);
      var computergb = function() {
        r = safeint(value.r / Color.settings.r.max, 255);
        g = safeint(value.g / Color.settings.g.max, 255);
        b = safeint(value.b / Color.settings.b.max, 255);
      }
      var computehsl = function() {
        h = safeint(value.h / Color.settings.h.max, 360);
        s = safeint(value.s / Color.settings.s.max, 100);
        l = safeint(value.l / Color.settings.x.max, 100);
      }
      if (arg === undefined && !this.useHsv && this.model == Color.models.hsx)
        arg = Color.formats.hsla;
      switch (arg) {
        case Color.formats.hex:
          computergb();
          var hex = [r, g, b];
          hex.forEach(function(v, i) {
            var v = v.toString(16);
            hex[i] = v.length == 1 ? 0 + v : v;
          });
          hex.splice(0, 0, '#');
          return hex.join('');
        case Color.formats.hsl:
          compuehsl();
          return ['hsl(', [h, s + '%', l + '%'].join(', '), ')'].join('');
        case Color.formats.hsla:
          computehsl();
          return ['hsla(', [h, s + '%', l + '%', a].join(', '), ')'].join('');
        case Color.formats.rgb:
          computergb();
          return ['rgb(', [r, g, b].join(', '), ')'].join('');
        default:
          computergb();
          return ['rgba(', [r, g, b, a].join(', '), ')'].join('');
      }
    }
  }
  Color.prototype.blend = function(color, blend) {
    if (typeof (color) == 'string')
      color = new Color(color);
    if (blend == null)
      blend = Color.blends.normal;
    if (typeof (blend) == 'string')
      blend = Color.str2blend(blend);
    var mr = color.r / Color.settings.r.max;
    var mg = color.g / Color.settings.g.max;
    var mb = color.b / Color.settings.b.max;
    var ma = color.a;
    var ir = this.r / Color.settings.r.max;
    var ig = this.g / Color.settings.g.max;
    var ib = this.b / Color.settings.b.max;
    var br = blend(mr * 255, ir * 255) / 255;
    var bg = blend(mg * 255, ig * 255) / 255;
    var bb = blend(mb * 255, ib * 255) / 255;
    var or = Math.max(Math.min(br, 1.0), 0.0) * ma + ir * (1 - ma);
    var og = Math.max(Math.min(bg, 1.0), 0.0) * ma + ig * (1 - ma);
    var ob = Math.max(Math.min(bb, 1.0), 0.0) * ma + ib * (1 - ma);
    this.r = Math.max(Math.min(or, 1.0), 0.0) * Color.settings.r.max;
    this.g = Math.max(Math.min(og, 1.0), 0.0) * Color.settings.g.max;
    this.b = Math.max(Math.min(ob, 1.0), 0.0) * Color.settings.b.max;
    return this;
  }
  Color.prototype.equals = function(color, epsilon) {
    if (typeof (color) == 'string')
      color = new Color(color);
    if (!Color.isClassOf(color))
      return false;
    var left,
      right;
    switch (this.model) {
      case Color.models.cmyk:
        left = this.cmyk();
        right = color.cmyk();
        break;
      case Color.models.hsx:
        left = this.useHsv ? this.hsv() : this.hsl();
        right = this.useHsv ? color.hsv() : color.hsl();
        break;
      default:
        left = this.rgb();
        right = color.rgb();
        break;
    }
    if (epsilon === undefined)
      epsilon = Color.epsilon;
    for (var c = 0; c < left.length; c++)
      if (Math.abs(left[c] - right[c]) > epsilon)
        return false;
    return true;
  }
  Color.prototype.toString = function(format) {
    return this.css(Color.str2format(format, Color.formats.rgba));
  }

  var nameColors = ['black', '#000000', 'silver', '#c0c0c0', 'gray', '#808080', 'white', '#ffffff',
    'maroon', '#800000', 'red', '#ff0000', 'purple', '#800080', 'fuchsia', '#ff00ff',
    'green', '#008000', 'lime', '#00ff00', 'olive', '#808000', 'yellow', '#ffff00',
    'navy', '#000080', 'blue', '#0000ff', 'teal', '#008080', 'aqua', '#00ffff',
    'orange', '#ffa500', 'aliceblue', '#f0f8ff', 'antiquewhite', '#faebd7', 'aquamarine', '#7fffd4',
    'azure', '#f0ffff', 'beige', '#f5f5dc', 'bisque', '#ffe4c4', 'blanchedalmond', '#ffe4c4',
    'blueviolet', '#8a2be2', 'brown', '#a52a2a', 'burlywood', '#deb887', 'cadetblue', '#5f9ea0',
    'chartreuse', '#7fff00', 'chocolate', '#d2691e', 'coral', '#ff7f50', 'cornflowerblue', '#6495ed',
    'cornsilk', '#fff8dc', 'crimson', '#dc143c', 'darkblue', '#00008b', 'darkcyan', '#008b8b',
    'darkgoldenrod', '#b8860b', 'darkgray', '#a9a9a9', 'darkgreen', '#006400', 'darkgrey', '#a9a9a9',
    'darkkhaki', '#bdb76b', 'darkmagenta', '#8b008b', 'darkolivegreen', '#556b2f', 'darkorange', '#ff8c00',
    'darkorchid', '#9932cc', 'darkred', '#8b0000', 'darksalmon', '#e9967a', 'darkseagreen', '#8fbc8f',
    'darkslateblue', '#483d8b', 'darkslategray', '#2f4f4f', 'darkslategrey', '#2f4f4f', 'darkturquoise', '#00ced1',
    'darkviolet', '#9400d3', 'deeppink', '#ff1493', 'deepskyblue', '#00bfff', 'dimgray', '#696969',
    'dimgrey', '#696969', 'dodgerblue', '#1e90ff', 'firebrick', '#b22222', 'floralwhite', '#fffaf0',
    'forestgreen', '#228b22', 'gainsboro', '#dcdcdc', 'ghostwhite', '#f8f8ff', 'gold', '#ffd700',
    'goldenrod', '#daa520', 'greenyellow', '#adff2f', 'grey', '#808080', 'honeydew', '#f0fff0',
    'hotpink', '#ff69b4', 'indianred', '#cd5c5c', 'indigo', '#4b0082', 'ivory', '#fffff0',
    'khaki', '#f0e68c', 'lavender', '#e6e6fa', 'lavenderblush', '#fff0f5', 'lawngreen', '#7cfc00',
    'lemonchiffon', '#fffacd', 'lightblue', '#add8e6', 'lightcoral', '#f08080', 'lightcyan', '#e0ffff',
    'lightgoldenrodyellow', '#fafad2', 'lightgray', '#d3d3d3', 'lightgreen', '#90ee90', 'lightgrey', '#d3d3d3',
    'lightpink', '#ffb6c1', 'lightsalmon', '#ffa07a', 'lightseagreen', '#20b2aa', 'lightskyblue', '#87cefa',
    'lightslategray', '#778899', 'lightslategrey', '#778899', 'lightsteelblue', '#b0c4de', 'lightyellow', '#ffffe0',
    'limegreen', '#32cd32', 'linen', '#faf0e6', 'mediumaquamarine', '#66cdaa', 'mediumblue', '#0000cd',
    'mediumorchid', '#ba55d3', 'mediumpurple', '#9370db', 'mediumseagreen', '#3cb371', 'mediumslateblue', '#7b68ee',
    'mediumspringgreen', '#00fa9a', 'mediumturquoise', '#48d1cc', 'mediumvioletred', '#c71585', 'midnightblue', '#191970',
    'mintcream', '#f5fffa', 'mistyrose', '#ffe4e1', 'moccasin', '#ffe4b5', 'navajowhite', '#ffdead',
    'oldlace', '#fdf5e6', 'olivedrab', '#6b8e23', 'orangered', '#ff4500', 'orchid', '#da70d6',
    'palegoldenrod', '#eee8aa', 'palegreen', '#98fb98', 'paleturquoise', '#afeeee', 'palevioletred', '#db7093',
    'papayawhip', '#ffefd5', 'peachpuff', '#ffdab9', 'peru', '#cd853f', 'pink', '#ffc0cb',
    'plum', '#dda0dd', 'powderblue', '#b0e0e6', 'rosybrown', '#bc8f8f', 'royalblue', '#4169e1',
    'saddlebrown', '#8b4513', 'salmon', '#fa8072', 'sandybrown', '#f4a460', 'seagreen', '#2e8b57',
    'seashell', '#fff5ee', 'sienna', '#a0522d', 'skyblue', '#87ceeb', 'slateblue', '#6a5acd',
    'slategray', '#708090', 'slategrey', '#708090', 'snow', '#fffafa', 'springgreen', '#00ff7f',
    'steelblue', '#4682b4', 'tan', '#d2b48c', 'thistle', '#d8bfd8', 'tomato', '#ff6347',
    'turquoise', '#40e0d0', 'violet', '#ee82ee', 'wheat', '#f5deb3', 'whitesmoke', '#f5f5f5',
    'yellowgreen', '#9acd32', 'rebeccapurple', '#663399', 'transparent', 'rgba(0,0,0,0)'];

  return Color;
}();
if (module && module.exports) {
  module.exports = {
    Color: iro.Color,
  }
}
