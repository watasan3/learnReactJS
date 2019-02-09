import React from 'react'

const Timer = () => {
  const [state, setState] = React.useState({count: 0})

  // レンダリングされた後に第１引数の関数がコールバックされる。パラメータが変更され、再レンダリングされた後でも呼ばれる
  // ライフサイクルメソッドのcomponentDidMount, componentDidUpdateに相当する
  // 第２引数は配列の値が前回と変わったときのみ第１引数の関数をコールバックされる
  // 省略した場合はレンダリングの度に第１引数の関数がコールバックされる
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      // 関数形式でパラメータの更新をすることもできる（推奨）
      // 関数形式の場合はTimerがレンダリングされた回数に合わせて更新がされる
      setState(state => ({count: state.count + 1}))
      // Timerコンポーネントが連続でレンダリングが走った場合にレンダリングの回数に合わせて、正しくインクリメントされない可能性あり
      //setState({count: state.count + 1})
    }, 1000)

    // 戻り値にはクリーンアップ関数を指定（省略可）
    // 指定すると次回のコールバックが呼ばれる前にクリーンアップ関数が呼ばれます
    // また、コンポーネントがUnmountされる前にもクリーンアップ関数が呼ばれます
    return () => clearTimeout(timerId)
  }, [state])

  return (
    <h1>カウント：{state.count}</h1>
  )
}

export default Timer