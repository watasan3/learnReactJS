# refs
何らかの事情でDOMのイベントを別のDOMに反映させたい場合があります。  
この場合、refsを使うことで対応できます。  
refsはReactのライフサイクルを無視して直接DOMを操作するため、必要な場面以外は極力使わないようにしましょう。  
以前はcomponentDidMountでも参照できていましたがReact16からは非推奨になりました。  
参照する際はイベントコールバック内のみに留めるようにしましょう。  
refsから参照する方法と変数に保存する方法と二通りあります。  

refsプロパティから参照する方法はref属性に属性値を指定します。  
this.refs経由でDOM([HTMLElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement))オブジェクトが参照できます。  

```
export default class App extends React.Component {

  // アップロードされたファイルの処理
  handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = e => {
      alert(e.target.result)
    }
    e.target.value = null

    // refs経由で生のHTMLElementを操作できる
    this.refs.done.style.display = ''
  }

  render () {
    return (
      <div>
        <input type='file' ref='upload' style={{display: 'none'}} onChange={this.handleUpload} />
        <button onClick={() => this.refs.upload.click()}>アップロード</button>
        <div ref='done' style={{display: 'none'}}>アップロード完了</div>
      </div>
    )
  }
}
```

refにコールバックを指定して変数値として持つことも可能です。  
次の例はrefs属性を経由しないで変数経由で別のDOMを操作する例です。  

```
export default class App extends React.Component {

  // フォーカス
  focusInput = () => {
    this.input.focus()
  }

  render () {
    return (
      <div>
        <div>
          <input type="text" ref={(input) => { this.input = input }} />
          <button onClick={this.focusInput}>入力フォーカス</button>
        </div>
      </div>
    )
  }
}
```

refsを使えば、子コンポーネントの参照を親コンポーネントに渡すことも可能です。  
今回の例では、子コンポーネントの入力欄をref参照して、入力連動させています。  

```
const TextInput = (props) => {
  return <input ref={props.inputRef} />
}

export default class App extends React.Component {

  // 入力連動
  changeInput = () => {
    this.textInput.value = this.input.value
  }

  render() {
    return (
      <div>
        <input type="text" ref={(input) => { this.input = input }} onChange={this.changeInput} />
        <TextInput inputRef={el => this.textInput = el} />
      </div>
    )
  }
}
```

# 親コンポーネントのメソッドを呼び出す例
props経由で親コンポーネントのメソッドを渡せば、子コンポーネントから親コンポーネントのメソッドを呼び出しできます。  

```
const MyButton = (props) => {
  return <button onClick={() => props.handleClick('call from child')} >親呼び出し</button>
}

export default class App extends React.Component {
  render () {
    return <MyButton handleClick={this.handleClick} />
  }
}
```


# 子コンポーネントのメソッドを呼び出す例
次のようにprops経由で参照すれば  
子コンポーネントのメソッドを親コンポーネントから呼び出すことも可能になります。  
componentDidMountで子コンポーネントの参照を親に渡しています。  

```
import React from 'react'

export default class Child extends React.Component {

  // onRef propsをデフォルト定義しておく
  static defaultProps = {
    onRef: () => {},
  }

  // DOMレンダリング完了後のコールバック
  componentDidMount() {
    this.props.onRef(this)
  }

  // コンポーネントが破棄される直前のコールバック
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  message = (text) => {
    alert(text)
  }

  render() {
    // 何もレンダリングしない場合はnullを返す
    return null
  }
}
```

呼び出し側ではonRef props経由で子コンポーネントの参照を取得します。  

```
export default class App extends React.Component {
  render () {
    return (
      <div>
        <button onClick={() => this.child && this.child.message('call from parent')}>子呼び出し</button>
        <Child onRef={(ref) => this.child = ref} />
      </div>
    )
  }
}
```