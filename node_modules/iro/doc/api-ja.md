# iro.Color.js API

# 目次
* [コンストラクタ](#コンストラクタ)
* [メソッド](#メソッド)
	* [css メソッド](#css-メソッド)
		* [引数になにも指定しないか書式を指定した場合（文字列化）](#引数になにも指定しないか書式を指定した場合（文字列化）)
		* [引数にCSSでの色表現や色名を指定した場合（文字列からの色の設定）](#引数にcssでの色表現や色名を指定した場合（文字列からの色の設定）)
		* [引数にColorインスタンスを指定した場合 (値のコピー)](#引数にcolorインスタンスを指定した場合-値のコピー)
	* [toString メソッド](#tostring-メソッド)
	* [rgb, hsv, hsl, cmyk メソッド](#rgb-hsv-hsl-cmyk-メソッド)
	* [blend メソッド](#blend-メソッド)
	* [equals メソッド](#equals-メソッド)
	* [offset メソッド](#offset-メソッド)
	* [clone メソッド](#clone-メソッド)
* [プロパティ](#プロパティ)
	* [a, r, g, b, h, s, v, l, c, m, y, k プロパティ](#a-r-g-b-h-s-v-l-c-m-y-k-プロパティ)
	* [useHsv プロパティ](#usehsv-プロパティ)
	* [model プロパティ](#model-プロパティ)
* [静的メソッド](#静的メソッド)
	* [name メソッド](#name-メソッド)
		* [2つの引数に指定した場合](#2つの引数に指定した場合)
		* [1つの引数を指定した場合](#1つの引数を指定した場合)
		* [引数になにも指定しない場合](#引数になにも指定しない場合)
* [TIPS](#tips)
	* [iro.の記述を省略する](#iroの記述を省略する)

# コンストラクタ

コンストラクタの第一引数には、iro.Colorインスタンス、rgb, rgba, hsl, hsla, hex形式などの文字列、色名などを指定し、初期化できます。

```javascript
new iro.Color(new iro.Color());
new iro.Color("#fff");
new iro.Color("#ffffff");
new iro.Color("rgb(255, 255, 255)");
new iro.Color("hsla(240, 50%, 50%, 0.5)");
new iro.Color("rebeccapurple");
```

コンストラクタは内部的にcssメソッドに第一引数を引き渡すことで実行しており、ほとんど同じ動作を行います。詳しくは[css メソッド](#css-メソッド)を参照ください。

本ライブラリにはrebeccapurpleを含むCSS4までのすべての色名が用意されていますが、実行中に追加・変更や新しい参照チェーンを作ることも可能です。詳しくは[name メソッド](#name-メソッド)を参照ください。

# メソッド

## css メソッド

このメソッドは文字列化・文字列からの色の設定を行います。目的に応じてとても柔軟な動作を行います。

### 引数になにも指定しないか書式を指定した場合（文字列化）

引数に何も指定せずに呼び出すことでrgbaかhslaのどちらか最適な形式が選択され文字列が返ります。（文字列化した場合に情報が失われにくい形式が選択されます）

```javascript
new iro.Color().css(); //rgba(0,0,0,1.0)
new iro.Color('hsl(0,0,0)').css(); //hsla(0,0,0,1.0)
```

もしくは、引数に以下のいずれかの定数か文字列を指定することで書式を指定できます。

* `iro.Color.formats.rgba` または `'rgba'`
* `iro.Color.formats.rgb` または `'rgb'`
* `iro.Color.formats.hsla` または `'hsla'`
* `iro.Color.formats.hsl` または `'hsl'`
* `iro.Color.formats.hex` または `'hex'`

例えば次のようにすることでhex形式での出力が可能です

```javascript
new Color('rgb(255,255,255)').css('hex'); // #ffffff
```

rgb、hsl、hex で出力する場合はアルファ値（aプロパティ）の情報が文字列化の過程で失われますのでご注意ください。また、そうでない場合も、文字列化の過程で数値の小数は丸められられるため、`color.css(color.css())`を実行すると色にわずかな誤差が生まれることがあります。

この場合の動作はtoStringと同じで、toStringの第一引数にも同じように書式を受け渡すことができます。

### 引数にCSSでの色表現や色名を指定した場合（文字列からの色の設定）

cssの第一引数にはrgb, hsl, rgba, hsla, hex形式のそれぞれの色表現はもちろん、CSSで定義されている色名ならびに[name プロパティ](#name-プロパティ)で定義した色名を受け渡すことで、色を設定することができます。

```javascript
var color1 = new iro.Color();
color.css('rgb(255, 255, 255)');
color.css('rgba'); // rgb(255,255,255,1.0)
color.css('rebeccapurple');
color.css('hex'); // #663399
```

この場合の動作はコンストラクタと同じように振る舞います。たとえば、コンストラクタで初期化しても、cssで初期化しても`color1`と`color2`は同じ色になります。

```javascript
var color1 = new iro.Color('red');
var color2 = new iro.Color().css('red');
color1.equals(color2); // true
```
iro.Color.jsにはrebeccapurpleを含むCSS4までのすべての名前付きの色をプリセットとして格納していますが、独自にカスタマイズしたり、より複雑な参照・動的な名前参照のチェーンを作ることも可能です。詳しくは[name メソッド](#name-メソッド)をご確認ください。

### 引数にColorインスタンスを指定した場合 (値のコピー)

cssというメソッド名にインスタンスを受け渡せるというのはメソッドの名前と動作に不一致を感じますが、もともとこの動作は、色名の名前解決時の再帰呼び出しのために用意された副産物的な機能です。

これを利用することで他のインスタンスから値をコピーすることができます。

```javascript
var color1 = new iro.Color('red');
var color2 = new iro.Color();
color2.css(color1);
color2.css('hex'); // #ff0000
```

## toString メソッド
テキストにCSSで使用できる文字列に変換します。内部的にcss メソッド呼び出しており、文字列化する上ではcss メソッドと全く同じ動作を行います。たとえば次の2つのコードは同じ結果になります。

```javascript
	console.log(new iro.Color().toString('rgb'));
	console.log(new iro.Color().css('rgb'));
```

ただし、cssのように色を設定することはできません。対応しない引数が受け渡された場合は例外がスローされます。
```javascript
	new iro.Color().css('red') // okay!
	new iro.Color().toString('red') // throws Error
```

詳しくは [css メソッド](#css-メソッド) もご覧ください。

## rgb, hsv, hsl, cmyk メソッド

r,g,b,aのように色要素受け渡す、もしくは[r,g,b,a]のように配列として渡す、aを省略する。もしくはなにも受け渡さないといった以下の通り5通りの使い方ができます。

```javascript
	new iro.Color().rgb(255, 255, 255);
	new iro.Color().rgb(255, 255, 255, 1.0);
	new iro.Color().rgb([255, 255, 255]);
	new iro.Color().rgb([255, 255, 255, 1.0]);
	new iro.Color().rgb(); //returns 0, 0, 0, 1.0
```

引数を受け渡した場合それぞれ指定した通りの色を設定し、呼び出し元のColorインスタンスを返します。なお、aを省略した場合はa値は現在のインスタンスの値が引き継がれます。

何も引数を受け渡さない場合には、色を[0, 0, 0, 1.0]のような配列で返します。

上記の例はrgbですが、hsv, hsl, cmyk も同様です。ただし、決定的な違いとして、hsvとhslはuseHsvの値を以下の通り変更する場合がある点にご注意ください。

* useHsvがfalseのときにhsvを使って色を設定するとuseHsvはtrueになります
* useHsvがtrueのときにhslを使って色を設定するとuseHsvはtrueになります
* hsv, hslに何も引数を渡さずに呼び出し、数値を取得する目的で使用した場合は、useHsvに変更は起きません

## blend メソッド

**このメソッドはまだほとんどテストしていません**

blendメソッドを使用することでペイントソフトなどで使用されている色の合成が可能です。

たとえば、`color1`に対して`color2`をスクリ―ンで合成したい場合は

```javascript
var color1 = new iro.Color('rgb(255, 0, 0)');
var color2 = new iro.Color('rgba(0, 0, 255, 0.5)');
color1.blend(color2, 'screen');
```

とします。blendメソッドは呼び出し元のColorインスタンスの値を変更するため注意してください。もし、上記の例で`color1`の値を変更したくない場合は途中でcloneを呼び出して、
```javascript
var color3 = color1.clone().blend(color2, 'screen');
```
とすることもできます。以下の定数または文字列を使用し、合成方法を指定できます。

* `iro.Color.blends.normal` または `'normal'`
* `iro.Color.blends.multiply` または `'multiply'`
* `iro.Color.blends.divide` または `'divide'`
* `iro.Color.blends.screen` または `'screen'`
* `iro.Color.blends.overlay` または `'overlay'`
* `iro.Color.blends.dodge` または `'dodge'`
* `iro.Color.blends.burn` または `'burn'`
* `iro.Color.blends.hardlight` または `'hardlight'`
* `iro.Color.blends.softlight` または `'softlight'`
* `iro.Color.blends.difference` または `'difference'`
* `iro.Color.blends.add` または `'add'`
* `iro.Color.blends.subtract` または `'subtract'`
* `iro.Color.blends.darken` または `'darken'`
* `iro.Color.blends.lighten` または `'lighten'`

## equals メソッド
他の色と一致しているかを返します。このクラスはある程度の誤差を許容します。 誤差の規定値は `1e-12` です。

誤差を変更したい場合は 2番目の引数に許容誤差を指定するか、`iro.Color.epsilon`を変更してください。

許容の誤差に0を指定すると完全な一致でのみtrueを返します。

なお、equalsはあくまでも計算上の相対誤差を許容するだけであり、trueを返したからといって、丸めにより実際の色要素には通常±1の誤差が生じる場合があります。

丸めた後の完全な一致を確認したい場合は[css メソッド](#css-メソッド)を使い文字列化して比較してください。

rgbとしての一致を確認したい場合は、

```javascript
color1.css('rgb') == color2.css('rgb')
```

cmykとしての一致を確認したい場合は、

```javascript
color1.css('cmyk') == color2.css('cmyk')
```

## offset メソッド

指定した色要素の値をオフセットします。たとえば、

```javascript
color.offset('h', 5);
```

と

```javascript
color.h += 5;
```

は同義です。offsetはColorクラスをそのまま返すため、jQueryのように連記できる点で優れています。

```javascript
color.offset('r', 5).offset('g', 5).css();
```

`offset` は `o` と記述することもできます。

```javascript
color.o('r', 5).o('g', 5).css();
```

もともとこの連記用に作られたメソッドで、このメソッドでなければならない特に重要な意味はありません。


## clone メソッド

一般的なクローンメソッドです。現在と同じ色を持つ別のインスタンスを複製します。useHsvなどの状態もコピーされます。

```javascript
var color2 = color1.clone();
```

# プロパティ

## a, r, g, b, h, s, v, l, c, m, y, k プロパティ

これらのプロパティはそれぞれアルファ値, RGB, HSV, HSL, CMYK におけるそれぞれの色要素を表しています。

aは0から1の範囲、rgbは0から255の範囲、cmykは0から100の範囲、hは0から360の範囲、sv, slは0から100の範囲を取ります。それぞれの値には小数が現れることがあります。

それぞれのプロパティにはリミッターが搭載されており、上記範囲を超える値を設定しようとしてもその範囲内に収まるよう最も近い数値に丸められます。例外的に h に関しては 360度を超えるとまた0度から始まるというような時計のようなリミット処理を行います。

```
color.r = -50; // 0
color.r = 300; // 255
color.h = -90; // 270 = 360 - 90
color.h = 450; // 90 = 450 - 360
```


なお、hsvとhsvは、h, sの接頭文字が重複していることや、HSLとHSVは同時に使用する必要のある場面は少ないことから、実行中にHSVとHSLのどちらを利用したいか選ぶという記述性を優先した仕様になっております。 **デフォルトではh, sはHSLの数値を表しています。** 詳しくは [useHsv プロパティ](#usehsv-プロパティ) および [hsv メソッド](#rgb-hsv-hsl-cmyk-メソッド)、 [hsl メソッド](#rgb-hsv-hsl-cmyk-メソッドド) をご覧ください。

## useHsv プロパティ

HSLとHSVは同時に使用しなければいけない場面は少ないことから記述性を優先し、どちらを利用するかを選ぶという仕様になっています。

* useHsvプロパティを false に設定すると、h, s, v はそれぞれHSLの値を表し、vプロパティにはアクセスできない状態になります。読み書きしようとすると例外が発生します。 **これがデフォルトの動作です。**
* useHsvプロパティを true に設定すると h, s, v はそれぞれHSVの値を表し、lプロパティはアクセスできない状態になります。読み書きしようとすると例外が発生します。

次のように直接useHsvプロパティをtrueに設定するか、

```javascript
var color = new iro.Color();
color.useHsv = true;
```
[hsv メソッド](#rgb-hsv-hsl-cmyk-メソッド)を使って色を設定することでuseHsvをtrueに設定することができます。

```javascript
var color = new iro.Color().hsv(0, 0, 0)
```

あるいは次のように iro.Color.useHsv の値をtrueに設定することで、それ以降に作成されるインスタンスのuseHsvをデフォルトでtrueに変更することができます。

```javascript
iro.Color.useHsv = true;
console.log(new iro.Color().useHsv); // true
```

なお、useHsvがtrueの状態でも、そのままcssやtoStringメソッドでHSL形式の文字列を出力することは可能で、これらのメソッドによってuseHsvに変化は起きません。


## model プロパティ

ライブラリの内部で使用され、通常は外部から使用しません。変換のベースとなるカラーモデルをiro.Color.modelsのいずれかの値で示しています。このプロパティは読み取り専用です。変更しようとしても例外は起きませんが、値は変わりません。

# 静的メソッド

## name メソッド

名前付きの色を新しく定義したり、既存の色を取得したり、名前付きの色に関する機能を提供します。nameには最大で2つの引数を指定できます。

### 2つの引数に指定した場合

新しく名前付き色を定義、あるいは現在の登録済みの色を変更できます。

```javascript
iro.Color.name('controlColor1', 'rgba(248, 248, 248, 1.0)');
iro.Color.name('controlColor2', 'white');
```

このようにし定義した色は、iro.Colorのコンストラクタに渡したり、CSSメソッドに受け渡すことができるようになります。

```javascript
var ctrlColor1 = new iro.Color('controlColor1');
var ctrlColor2 = new iro.Color().css('controlColor1');
```

* 色名の大文字小文字は区別しません
* 色名に hex, rgb, rgba, hsl, hsla のいずれかの文字列は使用できません。（例外がスローされます）
* 2つ目の引数にはhex, rgb, rgba, hsl, hslaのいずれかの形式か、他の色名を指定できます。指定する文字列が正しくない色形式であるかどうかは検証しないため、誤った書式を登録した場合コンストラクタやcssメソッド使用時に例外が発生します。
* Colorのコンストラクタやcssメソッドは、2つ目に引き渡された文字列が色名である場合、**名前解決できるまで参照を繰り返すため、参照が循環している場合スタックオーバーフローになる場合があります。** たとえば次のような参照循環にならないように注意してください。（blackがwhiteを参照し、whiteがblackを参照しており循環しています）

  ```javascript
  iro.Color.name('black', 'white');
  iro.Color.name('white', 'black');
  var black = new iro.Color('black'); // stackoverflow !!
  ```
* 2つ目には文字列ではなくiro.Colorインスタンスも引き渡すことができます。この場合、名前解決字にインスタンスから逐次色を取得するようなり、登録した名前はインスタンスの現在時点での色を示すことになり便利です。

  ```javascript
  var color1 = new iro.Color('blue');
  var color2 = new iro.Color('red';

  iro.Color.name('color1', color1);
  color1.css('red');
  color2.css('color1'); // color2 is red
  ```


### 1つの引数を指定した場合

その色に登録されている文字列を返します。そのまま登録されている文字列もしくはColorインスタンスが返ります。cssメソッドと違い名前解決は行いません。

```javascript
console.log(iro.Color.name('black')); // #000000
iro.Color.name('black', 'white');
console.log(iro.Color.name('black')); // white

var colorInstance = new iro.Color();
iro.Color.name('instance', colorInstance);
console.log(iro.Color.name('instance') === colorInstance); // true
```

### 引数になにも指定しない場合

引数になにも指定しない場合は現在登録されている名前を配列ですべて返します。

```javascript
iro.Color.name().forEach(function(name) {
	console.log(name);
});
```
# TIPS

## iro.の記述を省略する

将来的な機能拡張で、標準のColorクラスが追加されたり、他のライブラリと衝突しないように、iroという名前空間に格納されていますが、衝突する心配のない場合は、`var Color = iro.Color;` とすることでiroを省くことができます。

```javascript
var Color = iro.Color;
console.log(new Color('rgb(23,23,23)').css(Color.formats.hex));
```
