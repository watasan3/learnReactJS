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

const def = { test: 'default' }
const obj = {}

// ３項演算子
console.log(def.test === 'default' ? 'default' : 'defaultじゃない')
// && 演算子(undefined, nullチェック)
obj.test && console.log('obj.testはundefinedなので実行されない')
// || 演算子(初期値代入)
obj.test = test || def.test
console.log(obj.test) // testがundefinedなのでdef.testが代入

// ES6だと変数をバッククォートで文字列に展開できる
const param = {obj:'param'}
const data = `${param.obj}を展開`
console.log(data)