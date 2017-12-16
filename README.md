# サンプル

Reactの基本的なルールを覚えつつ簡単なアプリケーションを作ってみましょう。  
クリックしたらカウントアップするボックスのコンポーネントを作ってみます。  
まずボックスのコンポーネントを作ります。(Rect.js)

```Rect.js
import React from 'react'

export default class Rect extends React.Component {

  constructor (props) {
    super(props)
    // ステートオブジェクト
    this.state = { number : this.props.num }    
  }

  componentWillMount () {
    // propsに属性値が渡ってくる
    const { num, bgcolor } = this.props

    // CSS スタイルはキャメルケースでプロパティを書く
    this.rectStyle = {
      background: bgcolor,
      display: 'table-cell',
      border: '1px #000 solid',
      fontSize: 20,
      width: 30,
      height: 30,
      textAlign: 'center',
      verticalAlign: 'center',
    }

  }

  // カウントアップ
  countUp (num) {
    // ステートオブジェクトのパラメータを更新→renderメソッドが呼ばれ、再描画される
    this.setState({ number : num + 1 })
  }

  render () {

    // 複数行になる場合は()で囲む
    // 返却する最上位のDOMは１つのみ
    return (
      <div style={ this.rectStyle } onClick={(e)=> this.countUp(this.state.number)}>
        <span style={{ color : '#eeeeee' }}>{this.state.number}</span>
      </div>
    )
  }
}
```

App.jsではRectコンポーネントを読み込んで表示します。   

```
import React from 'react'
import Rect from './Rect'

export default class App extends React.Component {

  render () {
    return (
      <div>
        <Rect num={1} bgcolor='#e02020' />
        <Rect num={2} bgcolor='#20e020' />
        <Rect num={3} bgcolor='#2020e0' />
      </div>
    )
  }
}
```

# Reactコンポーネントのライフサイクルについて

全体図は良い図があったのでそちらを参考にしてください。  
[React component ライフサイクル図](https://qiita.com/kawachi/items/092bfc281f88e3a6e456)
各種メソッドの説明はこちら  
[React Componentのライフサイクルのまとめと利用用途](https://qiita.com/yukika/items/1859743921a10d7e3e6b)
  
初期化時と属性値変更時に呼ばれるcomponentWillMountメソッドと  
描画時に呼ばれるrenderメソッドはよく使うのでまず抑えておいてください  
通信処理後のpropsの変更をみて、さらに何か処理したい場合には  
componentWillReceivePropsメソッドを使ったり、  
どうしても直接DOM操作をしたいときにcomponentDidMountメソッドにDOMのイベントを追加して  
componentWillUnmountメソッドでDOMイベントを削除したりします。  

# 属性値について

新規に作成したRectコンポーネントには通常のDOMと
同様に属性値を定義することができます。

```App.js
<Rect num={1} bgcolor='#e02020' />
```

独自に定義したプロパティはpropsオブジェクト内に格納されてRectコンポーネントに渡ってきます。

```Rect.js
componentWillMount () {
    // propsに属性値が渡ってくる
    const { num, bgcolor } = this.props
```

# CSS Styleについて

JSX内でスタイルを渡すにはキャメルケースで書く必要があります。  
babelでCSSに変換してもらいます。  
例えば、font-sizeを適応したい場合はfontSizeと記述する必要があります。  

```Rect.js
    // CSS スタイルはキャメルケースでプロパティを書く
    this.rectStyle = {
      background: bgcolor,
      display: 'table-cell',
      border: '1px #000 solid',
      fontSize: 20,
      width: 30,
      height: 30,
      textAlign: 'center',
      verticalAlign: 'center',
    }
```

JSX内で{}した箇所にはJSを書くことができます。  
今回はJSのスタイルオブジェクトを渡しています。  

```Rect.js
   <div style={ this.rectStyle } >
```

# コンポーネントのstateについて

コンポーネント内部で状態を保持したい場合は  
stateオブジェクトという特殊なオブジェクトを定義します。  
中身のパラメータに関しては自由に入れて構いません。  
今回はクリックしたときに数字をカウントアップしたいため  
numberパラメータを保持するようにしました。  

```Rect.js
  // ステートオブジェクト
  this.state = { number : this.props.num }
```

イベントハンドリングとnumberオブジェクトの更新に関して記述した箇所が次の箇所になります。  
Reactにはstateオブジェクトのパラメータを更新させるために  
setStateメソッドが用意されています。  
クリックされてsetStateメソッドが呼び出されるとstateオブジェクトのパラメータを更新し  
renderメソッドを呼び出します（再描画される）。  

```Rect.js

  // カウントアップ
  countUp (num) {
    // ステートオブジェクトのパラメータを更新→renderメソッドが呼ばれ、再描画される
    this.setState({ number : num + 1 })
  }

  render () {
     return (
      {/* クリックイベントバインディング */}
      <div onClick={(e)=> this.countUp(this.state.number)}>
     )
  }
```

renderメソッド内でsetStateメソッドを直接呼び出してはいけません。  
render→setState→renderと無限ループになるからです。  

クラスメソッドのイベントバインディングには何種類か方法があります。  
詳しくは[Reactをes6で使う場合のbindの問題](https://qiita.com/cubdesign/items/ee8bff7073ebe1979936)を参照

# コンポーネント(DOM)のループ(map)
liタグなどのような同じコンポーネント(DOM)が並んでいて  
属性値が違う場合はユニークなkey指定でmapを回すことで連続描画できます。  

```App.js
render () {

  const rects = [
    {key: 'rect_1', num: 1, bgcolor: '#e02020'},
    {key: 'rect_2', num: 2, bgcolor: '#20e020'},
    {key: 'rect_3', num: 3, bgcolor: '#2020e0'},
  ]

  return (
    <div>
      { rects.map((r) => <Rect key={r.key} num={r.num} bgcolor={r.bgcolor} />) }
    </div>
  )
}
```

keyを1,2,3のような単純なindexにしてはいけないのは、  
動的なDOM操作をする時、Reactの挙動がおかしくなるからです。  
下記のサンプルの挙動がわかりやすいです  

参考：[Index as a key is an anti-pattern](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)


# 配列でのDOM返し(ReactJS v16)
ReactJS v16から配列形式のrender DOM返却ができるようになりました。  
参考：[Arrays in React 16 and the necessity of keys](https://medium.com/reactnative/arrays-in-react-16-and-the-necessity-of-keys-c62e7adb4206)
  
これにより、renderの最上位DOMが必ず１つであるという制約がなくなります。  
ただし、この場合、keyが必須です。  

```App.js
render () {

  return [
    <Rect key='rect_1' num={1} bgcolor='#e02020' />,
    <Rect key='rect_2' num={2} bgcolor='#20e020' />,
    <Rect key='rect_3' num={3} bgcolor='#2020e0' />,
  ]
}
```

さらに短く書く場合は次のように書けます。

```App.js
render () {

  const rects = [
    {key: 'rect_1', num: 1, bgcolor: '#e02020'},
    {key: 'rect_2', num: 2, bgcolor: '#20e020'},
    {key: 'rect_3', num: 3, bgcolor: '#2020e0'},
  ]

  return rects.map((r) => <Rect key={r.key} num={r.num} bgcolor={r.bgcolor} />)
}
```