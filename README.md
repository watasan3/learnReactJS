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
  // ES6
  let b = '局所変数'
  // ES6
  const c = '定数'

  //c = '代入エラー'

  console.log(a)
  console.log(b)
  console.log(c)
}
// 関数呼び出し
test()

// ES6だと変数を文字列に展開できる
const param = {obj:'param'}
const data = `${param.obj}を展開`
console.log(data)
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

```function.js
// ES5
var testES5 = function (param) {
  console.log(param)
};
testES5('ES5');

// ES6はアロー関数でも記述できる
const testES6 = (param) => {
  console.log(param)
}
testES6('ES6')

// ES6では関数にデフォルト引数を持たせられる
const init = {obj:'obj'}
const testES6Def = (arg = init) => {
  console.log(arg)
}
testES6Def()
```

クラス

```class.js
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

loop処理

```loop.js
const arr = ['a','b','c']

for (s of arr) {
  console.log(s)
}

arr.map((s) => { console.log(s)} )
```

非同期処理

```asyncawait.js
// 非同期処理だと実行順番が前後する
function asyncFunc(param) {
  // 非同期処理
  setTimeout(() => {
    console.log(param)
  },100)    
}

// 順番が前後する例
function test() {
  console.log('1')
  // 非同期処理
  asyncFunc('2')
  console.log('3')
}
test()


// async awaitで同期待ちをする例(ES7)
function asyncFuncPromise(param) {
  return new Promise((resolve,reject) =>{
    setTimeout(() => {
      resolve(param)
    },100)    
  })
}

// awaitを使う関数はasync関数にする(ES7)
async function testAwait() {
  // 非同期処理をawaitで処理待ちする
  const ret1 = await asyncFuncPromise('a')
  console.log(ret1)
  const ret2 = await asyncFuncPromise('b')
  console.log(ret2)
  const ret3 = await asyncFuncPromise('c')
  console.log(ret3)
}
testAwait()
```