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