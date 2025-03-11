# iro.Color.js API

# Contens
* [iro.Color.js API](#irocolorjs-api)
* [Constructor](#constructor)
* [Methods](#methods)
	* [css Method](#css-method)
		* [Without argument or Specify CSS formats (Serialization)](#without-argument-or-specify-css-formats-serialization)
		* [Specify CSS string or Color names (Deserialization)](#specify-css-string-or-color-names-deserialization)
		* [Specify Color instance (Copy value)](#specify-color-instance-copy-value)
	* [toString Method](#tostring-method)
	* [rgb, hsv, hsl, cmyk Methods](#rgb-hsv-hsl-cmyk-methods)
	* [blend Method](#blend-method)
	* [equals Methods](#equals-methods)
	* [offset Method](#offset-method)
	* [clone Method](#clone-method)
* [Properties](#properties)
	* [a, r, g, b, h, s, v, l, c, m, y, k Properties](#a-r-g-b-h-s-v-l-c-m-y-k-properties)
	* [useHsv Property](#usehsv-property)
	* [model Property](#model-property)
* [Static Methods](#static-methods)
	* [name Method](#name-method)
		* [Specified 2 arguments](#specified-2-arguments)
		* [Specify 1 argument](#specify-1-argument)
		* [No arguments](#no-arguments)
* [TIPS](#tips)
	* [For shorthand, dispense iro](#for-shorthand-dispense-iro)

# Constructor

Constructor can accept Color instance or CSS string formats (HEX, RGB, RGBA, HSL, HSLA).

```javascript
new iro.Color(new iro.Color());
new iro.Color("#fff");
new iro.Color("#ffffff");
new iro.Color("rgb(255, 255, 255)");
new iro.Color("hsla(240, 50%, 50%, 0.5)");
new iro.Color("rebeccapurple");
```

Constructor calls css method internally, please see [css method](#css-method) to learn more.

All CSS color names including `rebeccapurple` are preinstalled into this library.
Moreover you can add new color names and reference chain. See [name method](#name-method).

# Methods

## css Method

This method provide serialization and deserialization feature.

### Without argument or Specify CSS formats (Serialization)

This is the same behavior as `toString` method.

When you did not specify any arguments, this library choose optimal format, then serialize into CSS string.

```javascript
new iro.Color().css(); // rgba(0,0,0,1.0)
new iro.Color('hsl(0,0,0)').css(); // hsla(0,0,0,1.0)
```

Or you can specify CSS formats:

* `iro.Color.formats.rgba` or `'rgba'`
* `iro.Color.formats.rgb` or `'rgb'`
* `iro.Color.formats.hsla` or `'hsla'`
* `iro.Color.formats.hsl` or `'hsl'`
* `iro.Color.formats.hex` or `'hex'`

For example, use 'hex' to serialize into HEX CSS string.

```javascript
new Color('rgb(255,255,255)').css('hex'); // #ffffff
```

**Note:**
* When you choose RGB, HSL, or HEX formats, alpha value of `a` property will be lost.
* Floating number will be round, therefore this serialization is IRREVERSIBLE. `color.css(color.css())` will be change its value.


### Specify CSS string or Color names (Deserialization)

By first argument, you can specify CSS formats (rgb, hsl, rgba, hsla or hex), CSS defined color names, or custom color names defined by [name property](#name-property).

```javascript
var color1 = new iro.Color();
color.css('rgb(255, 255, 255)');
color.css('rgba'); // rgb(255,255,255,1.0)
color.css('rebeccapurple');
color.css('hex'); // #663399
```

This is the same behavior as constructor.
The following `color1` and `color2` will be a same value.

```javascript
var color1 = new iro.Color('red');
var color2 = new iro.Color().css('red');
color1.equals(color2); // true
```

All CSS color names including `rebeccapurple` are preinstalled into this library.
Moreover you can add new color names and reference chain. See [name method](#name-method).

### Specify Color instance (Copy value)

When you specify Color instance, css method will copy value from it.

```javascript
var color1 = new iro.Color('red');
var color2 = new iro.Color();
color2.css(color1);
color2.css('hex'); // #ff0000
```

## toString Method

Serialize into CSS string. This method calls css method internally.
Therefore the following 2 lines are same result.

```javascript
console.log(new iro.Color().toString('rgb'));
console.log(new iro.Color().css('rgb'));
```

toString method only accepts CSS formats(rgb, rgba, hsl, hla, or hex) in contrast with css method. When you specify irregular value for first argument of toString, exception will be thrown.

```javascript
new iro.Color().css('red') // okay!
new iro.Color().toString('red') // throws Error
```

Please see [css Method](#css-method) to learn more.

## rgb, hsv, hsl, cmyk Methods

This methods sets value by multiple-arguments or single-array, or returns value as single-array as follow:

```javascript
new iro.Color().rgb(255, 255, 255);
new iro.Color().rgb(255, 255, 255, 1.0);
new iro.Color().rgb([255, 255, 255]);
new iro.Color().rgb([255, 255, 255, 1.0]);
new iro.Color().rgb(); //returns 0, 0, 0, 1.0
```

When you omit `a` value, current instance value will be inherited.
When no argument is specified, returns color elements as a single-array.

The above example is `rgb`, but the other methods are the same.

Note: `hsv` and `hsl` method will change `useHsv` property as follow:

* When you set value by hsv method if useHsv is false, useHsv becomes true.
* When you set value by hsl method if useHsv is true, useHsv becomes false.
* In other cases, useHsv never be changed.

## blend Method

**This is experimental feature that needs more testing**

blend method can be color-blending like painting software.

For example, you want to blend `color1` and `color2` by `screen`:

```javascript
var color1 = new iro.Color('rgb(255, 0, 0)');
var color2 = new iro.Color('rgba(0, 0, 255, 0.5)');
color1.blend(color2, 'screen');
```

`blend` method will change callee instance.
When you want to prevent change color, call `clone` before `blend`:

```javascript
var color3 = color1.clone().blend(color2, 'screen');
```

All blend methods are as follows:

* `iro.Color.blends.normal` or `'normal'`
* `iro.Color.blends.multiply` or `'multiply'`
* `iro.Color.blends.divide` or `'divide'`
* `iro.Color.blends.screen` or `'screen'`
* `iro.Color.blends.overlay` or `'overlay'`
* `iro.Color.blends.dodge` or `'dodge'`
* `iro.Color.blends.burn` or `'burn'`
* `iro.Color.blends.hardlight` or `'hardlight'`
* `iro.Color.blends.softlight` or `'softlight'`
* `iro.Color.blends.difference` or `'difference'`
* `iro.Color.blends.add` or `'add'`
* `iro.Color.blends.subtract` or `'subtract'`
* `iro.Color.blends.darken` or `'darken'`
* `iro.Color.blends.lighten` or `'lighten'`

## equals Methods

Returns whether its value equals with other instance value.

This method allows a tolerance: `1e-12`

If you change this tolerance, specify by second argument or change `iro.Color.epsilon`

Note: equals method only check approximation, therefore this method never guarantee that the two colors are a same CSS string value.
Use [css method](#css-method) to check this as follows:

```javascript
color1.css('rgb') == color2.css('rgb');
color1.css('cmyk') == color2.css('cmyk');
```

## offset Method

This method offsets specified property by specified difference.

```javascript
color.offset('h', 5);
```
The above and beyond codes are the same result.

```javascript
color.h += 5;
```

offset method returns Color instance, therefore you can write as jQuery shorthand.

```javascript
color.offset('r', 5).offset('g', 5).css();
```

offset method can be written by `o` for shorthand.

```javascript
color.o('r', 5).o('g', 5).css();
```

## clone Method

Simple clone method. This method returns a new instance that has same values of current instance.

```javascript
var color2 = color1.clone();
```

# Properties

## a, r, g, b, h, s, v, l, c, m, y, k Properties

These properties represent ALPHA value and values of RGB, HSV, HSL and CMYK.

* Range of `a` is 0-1
* Range of `r`, `g`, and `b` are 0-255
* Range of `c`, `m`, `y`, and `k` are 0-100
* Range of `s`, `v`, and `l` are 0-100
* Range of `h` is 0-360
* These properties may be floating value.

The all properties has built-in limiter, when you set out-of-range value, it rounds its value.

Note: Limiter of `h` is special and follows the rule of Hue definition.

```
color.r = -50; // 0
color.r = 300; // 255
color.h = -90; // 270 = -90 + 360
color.h = 450; // 90 = 450 % 360
```

Note: HSL and HSV conflits its `h` and `s`, therefore `h` and `s` represent values of HSL.
You must change useHsv property to use HSV value. See [useHsv property](#usehsv-property) to learn more.

## useHsv Property

HSL and HSV conflits its `h` and `s`, therefore `h` and `s` represent values of HSL.
You must change useHsv property to use HSV value.

* When useHsv property is false, `h`, `s` and `l` represent values of HSL. `v` property cannot be access and throws exception when use it. This is default.
* When useHsv property is true, `h`, `s` and `v` represent values of HSV. `l` property cannnot be access and throws exception when use it.

When you want to change useHsv property, set useHsv directly:

```javascript
var color = new iro.Color();
color.useHsv = true;
```

Or, use [hsv method](#rgb-hsv-hsl-cmyk-methods) that can change useHsv property automatically.

```javascript
var color = new iro.Color().hsv(0, 0, 0)
```

Or, change `iro.Color.useHsv`property that affects all new Color instances.

```javascript
iro.Color.useHsv = true;
console.log(new iro.Color().useHsv); // true
```

By the way, useHsv property never affect serialization(css and toString methods).
You can serialize into HSL formats when its useHsv is true.
And toString and css method never change useHsv value when serialization.

## model Property

This readonly property is used internally.

# Static Methods

## name Method

This method provide features about named color.

### Specified 2 arguments

Declare new named color, or modify value of color existed.

```javascript
iro.Color.name('controlColor1', 'rgba(248, 248, 248, 1.0)');
iro.Color.name('controlColor2', 'white');
```

Once declared, new color names can be use for constructor or css methods as follows:

```javascript
var ctrlColor1 = new iro.Color('controlColor1');
var ctrlColor2 = new iro.Color().css('controlColor1');
```

* Color names are case insensitive. `COLor` and `coloR` is the same name.
* Cannnot use `hex`, `rgb`, `rgba`, `hsl`, `hsla` for name of color. (throws exception when use)
* This method never check value is correct. When you set irregular value, constructor or css method will throws error rather than this method.
* Constructor and css method try to reference specified name until resolved, therefore loop-reference causes stackoverflow. (In the following example, `black` refers `white`, and `white` refers `black`)

  ```javascript
  iro.Color.name('black', 'white');
  iro.Color.name('white', 'black');
  var black = new iro.Color('black'); // stackoverflow!!
  ```
* When you specified iro.Color instance for seconds argument of `name` method. In this case, constructor and css method use value of its instance when name-resolving,

  ```javascript
  var color1 = new iro.Color('blue');
  var color2 = new iro.Color('red';

  iro.Color.name('color1', color1);
  color1.css('red');
  color2.css('color1'); // color2 is red
  ```


### Specify 1 argument

Returns registred value (string or Color instance).
This method never resolve its name in contrast with constructor and `css` method. returns value directly.

```javascript
console.log(iro.Color.name('black')); // #000000
iro.Color.name('black', 'white');
console.log(iro.Color.name('black')); // white

var colorInstance = new iro.Color();
iro.Color.name('instance', colorInstance);
console.log(iro.Color.name('instance') === colorInstance); // true
```

### No arguments

Returns all registred names as array.

```javascript
iro.Color.name().forEach(function(name) {
	console.log(name);
});
```
# TIPS

## For shorthand, dispense iro

You can dispense `iro.` as follows:

```javascript
var Color = iro.Color;
console.log(new Color('rgb(23,23,23)').css(Color.formats.hex));
```
