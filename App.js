import React from 'react'

// 子コンポーネント
const TextInput = (props) => {
  return <input ref={props.inputRef} />
}

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

  // フォーカス
  focusInput = () => {
    this.input.focus()
  }

  // 入力連動
  changeInput = () => {
    this.textInput.value = this.input.value
  }

  render () {
    return (
      <div>
        <p>別のDOMからrefs参照でクリックイベント処理をキックする例:</p>
        <input type='file' ref='upload' style={{display: 'none'}} onChange={this.handleUpload} />
        <button onClick={() => this.refs.upload.click()}>アップロード</button>
        <div ref='done' style={{display: 'none'}}>アップロード完了</div>
        <div>
          <p>refsを仲介しないで変数に格納する例:</p>
          <input type="text" ref={(input) => { this.input = input }} onChange={this.changeInput} />
          <button onClick={this.focusInput}>入力フォーカス</button>
        </div>
        <p>子コンポーネントのref参照を取得し、入力連動させる例:</p>
        <TextInput inputRef={el => this.textInput = el} />
      </div>
    )
  }
}