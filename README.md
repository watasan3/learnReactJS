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

