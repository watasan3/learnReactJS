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

  // 並列実行待ち
  const rets = await Promise.all([
    asyncFuncPromise('d'),
    asyncFuncPromise('e'),
    asyncFuncPromise('f')
  ])
  console.log(rets)

}
testAwait()