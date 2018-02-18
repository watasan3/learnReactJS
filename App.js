import React from 'react'

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
        {/* ref属性値指定でrefsに登録される */}
        <input type='file' ref='upload' style={{display: 'none'}} onChange={this.handleUpload} />
        {/* 別のDOMからrefs参照でクリックイベント処理をキックする */}
        <button onClick={() => this.refs.upload.click()}>アップロード</button>
        <div ref='done' style={{display: 'none'}}>アップロード完了</div>
      </div>
    )
  }
}