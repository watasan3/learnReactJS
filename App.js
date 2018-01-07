import React from 'react'
import Logger from './Logger'

// decoratorsでHOCでAppコンポーネントをWrapする
@Logger('Hello World!', 'render log')
class App extends React.Component {

  render () {
    // Loggerでpropsにinjectが追加される
    return (
      <div>{this.props.inject}</div>
    )
  }
}

export default App

// ※decoratorsを使わない場合は以下のように書ける

/*
class App extends React.Component {

  render () {
    return (
      <div>{this.props.inject}</div>
    )
  }
}

export default Logger('Hello World!', 'render log')(App)
*/