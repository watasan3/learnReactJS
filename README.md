# JavaScript Standard Style 

[JavaScript Standard Style ](https://standardjs.com/)

* インデント2つのスペース 
* ストリングはシングルクォーテーションで囲む – エスケープを避けるため
* 使わない変数は消す – バグの温床となる
* セミコロンは書かない
* if(condition){...}内の単語の後ろにはスペースを入れる
* function name (arg){...}でfunctionの名前の後ろにはスペースを入れる
* 常に==ではなく===を使う – ただしobj ==nullはnull||undefinedをチェックするために使っても良い

...etc

ESLintというツールでコーディングをチェックしてくれます。

# ES6のおさらい

変数

```variable.js
var a = 'グローバル変数'

// 関数
function test() {
  let b = '局所変数'
  const c = '定数'

  //c = '代入エラー'

  console.log(a)
  console.log(b)
  console.log(c)
}
// 関数呼び出し
test()
```

NodeJSで実行

```
$ node variable.js
```

HTML上での実行

```variable.html
<!DOCTYPE html>
<html>
  <head>
  <meta charset="UTF-8">
    <title>HTML5サンプル</title>
  </head>
  <body>
    <script type="text/javascript">
var a = 'グローバル変数'

// 関数
function test() {
  let b = '局所変数'
  const c = '定数'

  //c = '代入エラー'

  console.log(a)
  console.log(b)
  console.log(c)
}
// 関数呼び出し
test()      
    </script>
  </body>
</html>
```

関数

```
// ES5
var testES5 = function (param) {
  console.log(param)
};
testES5('ES5');

// ES6はアロー関数でも記述できる
let testES6 = (param) => {
  console.log(param)
}
testES6('ES6')
```

クラス

```
// ES5のクラス（prototype）
function classES5(){
  this.name = 'ES5';
}

classES5.prototype.method = function(){
  console.log(this.name);
}

var clsES5 = new classES5();
clsES5.method();


// ES6のクラス
class classES6 {
  
  constructor () {
    this.name = 'ES6'
  }

  method () {
    console.log(this.name)
  }

}

let clsES6 = new classES6()
clsES6.method()

// 継承
class childClass extends classES6 {
  
  method () {
    // 親のクラスのメソッドはsuper経由で呼ぶ
    super.method()
    console.log('ES6 child')
  }

}
clsES6 = new childClass()
clsES6.method()
```