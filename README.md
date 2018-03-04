# HOC(High Order Component)について
Higher Order Componentとは、他のコンポーネントをWrapするReactコンポーネントのことです。  
Wrapすることで外部からパラメータを付与したりします。  
[ReactのHigher Order Components詳解 : 実装の2つのパターンと、親Componentとの比較](http://postd.cc/react-higher-order-components-in-depth/)  

今回は可読性の良さを重視して、decoratorsを使って実装します。  
webpackにdecoratorsプラグインを追加します。  

```
$ yarn add --dev babel-plugin-transform-decorators-legacy
```

.babelrcのpluginsにtransform-decorators-legacyプラグインを追加します。  

```
{
  "presets": ["env", "react"],
  "plugins": ["transform-class-properties", "transform-decorators-legacy"]
}
```

Logger.jsを次のように実装します。

```
import React from 'react'

// 引数
export default (inject, message) => {
  // WrapするReact Component引数
  return (WrappedComponent) => {
    // 処理をフックする
    return class extends React.Component {

      render (){
        console.log(message)
        // propsにinject属性追加
        return  <WrappedComponent {...this.props} inject={inject} />
      }
    }
  }
}
```

App.jsを次のように実装します。

```
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
```

以下でビルド

```
$ webpack --watch
```

実行時にはAppコンポーネントのpropsにはinjectは存在しないのに  
Logger経由でpropsに追加されています。  
このように、HOCを使うことで元のコンポーネントに手を加えることなく、  
propsを追加したり、処理を追加したりできます。  

# 補足１(decoratorsを使わない場合)
decoratorsを使わない場合はApp.jsは次のようにもかけます。  
ただし、見づらいのでdecoratorsを使ったほうがすっきりかけます。  

```
import React from 'react'
import Logger from './Logger'

// ※decoratorsを使わない場合は以下のように書ける
class App extends React.Component {

  render () {
    return (
      <div>{this.props.inject}</div>
    )
  }
}

export default Logger('Hello World!', 'render log')(App)
```

# 補足２(Stateless Functional ComponentのHOC)
今回のようにrender部分しかHOCしていない場合はStateless Functional ComponentでHOCを書けます。  

```
import React from 'react'

// 今回はrenderしかないのでStateless Functional Componentでも書ける
export default (inject, message) => {
  return (WrappedComponent) => {
    // Stateless Functinal Component
    return (props) => {
      console.log(message)
      return  <WrappedComponent {...props} inject={inject} />
    }
  }
}
```