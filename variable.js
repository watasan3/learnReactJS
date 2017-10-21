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