
Color.epsilon = 1e-12;
Color.isClassOf = function (obj) {
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
Color.limiters.circuit = function (v, max) {
  var r = v % max;
  if (r < 0) r += max;
  return r;
}
Color.limiters.linear = function (v, max) {
  return Math.max(0, Math.min(v, max));
}
Color.settings = {};
Color.settings.a = { max: 1, limiter: Color.limiters.linear, };
Color.settings.r = { max: 255, limiter: Color.limiters.linear };
Color.settings.g = { max: 255, limiter: Color.limiters.linear };
Color.settings.b = { max: 255, limiter: Color.limiters.linear, };
Color.settings.h = { max: 360, limiter: Color.limiters.circuit, };
Color.settings.s = { max: 100, limiter: Color.limiters.linear, };
Color.settings.x = { max: 100, limiter: Color.limiters.linear, };
Color.settings.c = { max: 100, limiter: Color.limiters.linear, };
Color.settings.m = { max: 100, limiter: Color.limiters.linear, };
Color.settings.y = { max: 100, limiter: Color.limiters.linear, };
Color.settings.k = { max: 100, limiter: Color.limiters.linear, };
Color.blends = {};
Color.blends.normal = function (m, i) {
  return m;
};
Color.blends.multiply = function (m, i) {
  return (m * i) / 255;
};
Color.blends.divide = function (m, i) {
  return (256 * i) / (m + 1);
};
Color.blends.screen = function (m, i) {
  return 255 - ((255 - m) * (255 - i)) / 255;
};
Color.blends.overlay = function (m, i) {
  return (i / 255) * (i + ((2 * m) / 255) * (255 - i));
};
Color.blends.dodge = function (m, i) {
  return (256 * i) / ((255 - m) + 1);
}
Color.blends.burn = function (m, i) {
  return 255 - (256 * (255 - i)) / (m + 1);
}
Color.blends.hardlight = function (m, i) {
  if (m > 128) return 255 - ((255 - 2 * (m - 128)) * (255 - i)) / 256;
  else return (2 * m * i) / 256;
}
Color.blends.softlight = function (m, i) {
  var r = Color.blends.screen(m, i);
  return ((255 - i) * m * r) / 255 * i;
}
Color.blends.difference = function (m, i) {
  return Math.abs(i - m);
}
Color.blends.add = function (m, i) {
  return m + i;
}
Color.blends.subtract = function (m, i) {
  return i - m;
}
Color.blends.darken = function (m, i) {
  return Math.min(m, i);
}
Color.blends.lighten = function (m, i) {
  return Math.max(m, i);
}
Color.rgb2hsl = function (rgb) {
  var r = Color.settings.r.limiter(rgb.r, Color.settings.r.max) / Color.settings.r.max;
  var g = Color.settings.g.limiter(rgb.g, Color.settings.g.max) / Color.settings.g.max;
  var b = Color.settings.b.limiter(rgb.b, Color.settings.b.max) / Color.settings.b.max;
  var M = Math.max(r, g, b);
  var m = Math.min(r, g, b);
  var c = M - m;
  var h;
  if (c == 0) h = 0;
  else if (M == r) h = (((g - b) / c) % 6) / 6;
  else if (M == g) h = (b - r) / (c * 6) + 1 / 3;
  else h = (r - g) / (c * 6) + 2 / 3
  var l = (M + m) / 2;
  var s = c == 0 ? 0 : (M + m >= 1 ? c / (2 - M - m) : c / (M + m));
  return {
    h: Color.settings.h.limiter(h * Color.settings.h.max, Color.settings.h.max),
    s: Color.settings.s.limiter(s * Color.settings.s.max, Color.settings.s.max),
    l: Color.settings.x.limiter(l * Color.settings.x.max, Color.settings.s.max),
  };
}
Color.hsl2rgb = function (hsl) {
  var h = Color.settings.h.limiter(hsl.h, Color.settings.h.max) / Color.settings.h.max;
  var s = Color.settings.s.limiter(hsl.s, Color.settings.s.max) / Color.settings.s.max;
  var l = Color.settings.x.limiter(hsl.l, Color.settings.x.max) / Color.settings.x.max;
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var h2 = h * 6;
  var x = c * (1 - Math.abs(h2 % 2 - 1));
  var m = l - 0.5 * c;
  var rgb1 = [m, m, m];
  var rgb2 = null;
  if (0 <= h2 && h2 < 1) rgb2 = [c, x, 0];
  else if (1 <= h2 && h2 < 2) rgb2 = [x, c, 0];
  else if (2 <= h2 && h2 < 3) rgb2 = [0, c, x];
  else if (3 <= h2 && h2 < 4) rgb2 = [0, x, c];
  else if (4 <= h2 && h2 < 5) rgb2 = [x, 0, c];
  else rgb2 = [c, 0, x];
  return {
    r: Color.settings.r.limiter((rgb1[0] + rgb2[0]) * Color.settings.r.max, Color.settings.r.max),
    g: Color.settings.g.limiter((rgb1[1] + rgb2[1]) * Color.settings.g.max, Color.settings.g.max),
    b: Color.settings.b.limiter((rgb1[2] + rgb2[2]) * Color.settings.b.max, Color.settings.b.max),
  };
}
Color.rgb2hsv = function (rgb) {
  var r = Color.settings.r.limiter(rgb.r, Color.settings.r.max) / Color.settings.r.max;
  var g = Color.settings.g.limiter(rgb.g, Color.settings.g.max) / Color.settings.g.max;
  var b = Color.settings.b.limiter(rgb.b, Color.settings.b.max) / Color.settings.b.max;
  var M = Math.max(r, g, b);
  var m = Math.min(r, g, b);
  var c = M - m;
  var h;
  if (c == 0) h = 0;
  else if (M == r) h = (((g - b) / c) % 6) / 6;
  else if (M == g) h = (b - r) / (c * 6) + 1 / 3;
  else h = (r - g) / (c * 6) + 2 / 3
  var v = M;
  var s = v == 0 ? 0 : c / v;
  return {
    h: Color.settings.h.limiter(h * Color.settings.h.max, Color.settings.h.max),
    s: Color.settings.s.limiter(s * Color.settings.s.max, Color.settings.s.max),
    v: Color.settings.x.limiter(v * Color.settings.x.max, Color.settings.x.max),
  };
}
Color.hsv2rgb = function (hsv) {
  var h = Color.settings.h.limiter(hsv.h, Color.settings.h.max) / Color.settings.h.max;
  var s = Color.settings.s.limiter(hsv.s, Color.settings.s.max) / Color.settings.s.max;
  var v = Color.settings.x.limiter(hsv.v, Color.settings.x.max) / Color.settings.x.max;
  var c = v * s;
  var h2 = 6 * h;
  var x = c * (1 - Math.abs(h2 % 2 - 1));
  var m = v - c;
  var rgb1 = [m, m, m];
  var rgb2;
  if (0 <= h2 && h2 < 1) rgb2 = [c, x, 0];
  else if (1 <= h2 && h2 < 2) rgb2 = [x, c, 0];
  else if (2 <= h2 && h2 < 3) rgb2 = [0, c, x];
  else if (3 <= h2 && h2 < 4) rgb2 = [0, x, c];
  else if (4 <= h2 && h2 < 5) rgb2 = [x, 0, c];
  else rgb2 = [c, 0, x];
  return {
    r: Color.settings.r.limiter((rgb1[0] + rgb2[0]) * Color.settings.r.max, Color.settings.r.max),
    g: Color.settings.g.limiter((rgb1[1] + rgb2[1]) * Color.settings.g.max, Color.settings.g.max),
    b: Color.settings.b.limiter((rgb1[2] + rgb2[2]) * Color.settings.b.max, Color.settings.b.max),
  };
}
Color.rgb2cmyk = function (rgb) {
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
Color.cmyk2rgb = function (cmyk) {
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
Color.str2format = function (str, fallback) {
  if (str != null) {
    str = str.toLowerCase();
    for (var f in Color.formats)
      if (f == str)
        return Color.formats[f];
  }
  if (fallback !== undefined) return fallback;
  throw new Error(['"', str, '" is invalid argument'].join(''));
}
Color.str2blend = function (str, fallback) {
  if (str != null) {
    str = str.toLowerCase();
    for (var b in Color.blends)
      if (b == str)
        return Color.blends[b];
  }
  if (fallback !== undefined) return fallback;
  throw new Error(['"', str, '" is invalid argument'].join(''));
}
Color.name = function () {
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
    nameColors[index + 1] = value;
  else if (index != -1)
    nameColors.splice(index, 2);
  else if (value != null)
    nameColors.push(name, value);
}
Color.prototype.hsl = function () {
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
Color.prototype.hsv = function () {
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
Color.prototype.cmyk = function () {
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
Color.prototype.rgb = function () {
  var args = arguments;
  if (args.length == 0)
    return [this.r, this.g, this.b, this.a];
  var array = args.length == 1 ? (args[0] instanceof Array ? args[0] :
    [args[0].r, args[0].g, args[0].b, args[0].a]) : args;;
  this.r = array[0];
  this.g = array[1];
  this.b = array[2];
  this.a = array[3] !== undefined ? array[3] : this.a;
  return this;
}
Color.prototype.offset = function (prop, value) {
  this[prop] += value;
  return this;
}
Color.prototype.o = Color.prototype.offset;
Color.prototype.clone = function () {
  var c = new Color(this);
  c.useHsv = this.useHsv;
  return c;
}
Color.prototype.css = function () {
  var arg = arguments[0];
  if (Color.isClassOf(arg)) {
    switch (arg.model) {
      case Color.models.cmyk: this.cmyk(arg); break;
      case Color.models.hsx: this.useHsv ? this.hsv(arg) : this.hsx(arg); break;
      default: this.rgb(arg); break;
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
    nums.forEach(function (itm, idx) { nums[idx] = m[itm] ? parseFloat(m[itm]) : 1.0; });
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
  }
  else {
    var value = this;
    var format = arg;
    if (format && (format === Color.formats.hsla || format === Color.formats.hsl) && this.useHsv) {
      value = this.clone();
      value.useHsv = false;
    }
    var safeone = function (one) {
      return Math.min(1.0, Math.max(0, one));
    }
    var safeint = function (one, muliplier) {
      return Math.round(safeone(one) * muliplier);
    }
    var r, g, b, h, s, l;
    var a = safeone(value.a).toFixed(1);
    var computergb = function () {
      r = safeint(value.r / Color.settings.r.max, 255);
      g = safeint(value.g / Color.settings.g.max, 255);
      b = safeint(value.b / Color.settings.b.max, 255);
    }
    var computehsl = function () {
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
        hex.forEach(function (v, i) {
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
Color.prototype.blend = function (color, blend) {
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
Color.prototype.equals = function (color, epsilon) {
  if (typeof (color) == 'string')
    color = new Color(color);
  if (!Color.isClassOf(color))
    return false;
  var left, right;
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
Color.prototype.toString = function (format) {
  return this.css(Color.str2format(format, Color.formats.rgba));
}
