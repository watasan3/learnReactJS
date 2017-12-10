# decoratorsについて
decoratorsを使うことでクラスやクラスのメソッドを外部から上書きすることができます。  
decoratorsを使うことでクラスの内部実装を変更することなく、decoratorsのパラメータを流し込んだり、クラスメソッドをフックしたりできます。  
これはJavaなどでいうDI(Dependency Injection)に該当します。  
[babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy)を使うことでdecoratorsを変換してくれます。  

下記コマンドでbabel-plugin-transform-decorators-legacyをインストールします。  

```
$ yarn init -y
$ yarn add --dev babel-plugin-transform-decorators-legacy
```

decoratorsのサンプルは以下となります。

```decorators.js
// クラスデコレーター
// @isTestable
@isTestable(true)
class MyClass { 
  
  @log('メソッドコール1')
  test1() {
    console.log('test1')
  }

  @log('メソッドコール2')
  test2(val1, val2) {
    console.log('test2',val1, val2)
  }
}

// クラスデコレーター定義
function isTestable(value) {
  return (target) => {
    return class extends target {
      constructor() {
        super()
        // 変数拡張
        this.isTestable = value
      }
      // メソッド拡張
      method() {
        console.log('テスト')
      }
    }
  }
}

// クラスメソッドデコレーター定義
function log(value){
  return (target, property, descriptor) => {
    const origin = descriptor.value
    descriptor.value = (...arg) => {
      console.log(value)
      origin(...arg)
    }
  }
}

const myclass = new MyClass()
// MyClassを直接操作せずにクラスデコレータから変数値を挿入する。
console.log(myclass.isTestable)
// MyClassを直接操作せずにクラスデコレータからメソッドを定義する。
myclass.method()
// MyClassを直接操作せずにクラスメソッドデコレータからメソッドをフックする。
myclass.test1()
// MyClassを直接操作せずにクラスメソッドデコレータからメソッドをフックする（引数付）
myclass.test2('a','b')
```

今回はCLIからトランスパイルするので.babelrcを作成します。

```.babelrc
{
 "plugins": ["transform-decorators-legacy"]
}
```

下記のコマンドでトランスパイルします。

```
babel --plugins transform-decorators-legacy decorator.js > compile.js
```

トランスパイル後のコードを実行すると、  
MyClassのほうの実装を変更することなく、  
decoratorsにより、クラスの拡張およびメソッドのフックがされていることが確認できます。  

```
$ node compile.js 
true
テスト
メソッドコール1
test1
メソッドコール2
test2 a b
```