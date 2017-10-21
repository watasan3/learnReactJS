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
  
初期化時と属性値変更時に呼ばれるcomponentWillMountメソッドと  
描画時に呼ばれるrenderメソッドはよく使うのでまず抑えておいてください  

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
      <div onClick={(e)=> this.countUp(this.state.number)}>
     )
  }
```

renderメソッド内でsetStateメソッドを直接呼び出してはいけません。  
render→setState→renderと無限ループになるからです。  