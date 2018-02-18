# refs
何らかの事情でDOMのイベントを別のDOMに反映させたい場合があります。  
この場合、refsを使うことで対応できます。  
refsはReactのライフサイクルを無視して直接DOMを操作するため、必要な場面以外は極力使わないようにしましょう。  
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
    <div>
      <input type="text" ref={(input) => { this.input = input }} onChange={this.changeInput} />
      <TextInput inputRef={el => this.textInput = el} />
    </div>
  }
}
```

以前はcomponentDidMountでも参照できていましたがReact16からは非推奨になりました。  
参照する際はイベントコールバック内のみに留めるようにしましょう。  
