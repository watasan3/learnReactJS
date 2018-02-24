# SSR(サーバサイドレンダリング)について
今まではクライアントサイドのみでReactを動かしてきました。  
今回はサーバ側でReact Componentのビルドを行い。  
初回のHTML生成をサーバ側で行います。  
ただし、アプリケーションの複雑性が増すため、以下のケースを除いて安易に導入するべきではありません。  

* OGP用metaタグの切り替え（Twitter、Facebook用）
* 初回の描画が早くなる（特にComponentの量が増えてきた時）
* AMP対応

デメリットとしては、

* アプリケーションの複雑度が増す
* サーバ側のDOMとクライアントサイド側のDOMの一致（初期化時）を強いられる
* 公開ページのルーティングが一致していないといけない（APIアクセス→SSR→CSRでかつ初回以外のルーティングはクライアント側のReact Routerとなるため）

# 追加のパッケージをインストール

* express: サーバ用(NodeJS)
* babel-plugin-direct-import: ES6 import変換プラグイン

```
$ yarn add express jsdom babel-plugin-direct-import
```

package.jsonは次のようになります。  

```
{
  "name": "learnreactjs",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/teradonburi/learnReactJS.git",
  "author": "teradonburi <daikiterai@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "run-p dev:*",
    "dev:server-build": "NODE_ENV=dev node-dev --inspect server/server.js",
    "dev:server": "webpack --config webpack.server.js --watch",
    "dev:client": "webpack-dev-server",
    "lint": "eslint .",
    "rm": "rm -rf dist/*",
    "build-webpack": "NODE_ENV=production parallel-webpack -p --config webpack.build.js",
    "build": "run-s rm build-webpack"
  },
  "devDependencies": {
    "autoprefixer": "^7.1.6",
    "axios": "^0.17.1",
    "babel-core": "^6.26.0",
    "babel-eslint": "^8.2.1",
    "babel-loader": "^7.1.2",
    "babel-plugin-direct-import": "^0.5.0",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "copy-webpack-plugin": "^4.2.3",
    "eslint": "^4.15.0",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-react": "^7.5.1",
    "history": "^4.7.2",
    "html-webpack-plugin": "^2.30.1",
    "material-ui": "^1.0.0-beta.34",
    "material-ui-icons": "^1.0.0-beta.17",
    "npm-run-all": "^4.1.2",
    "parallel-webpack": "^2.2.0",
    "precss": "^2.0.0",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-hot-loader": "^3.1.3",
    "react-redux": "^5.0.6",
    "react-router-dom": "4.2.2",
    "react-router-redux": "^5.0.0-alpha.8",
    "redux": "^3.7.2",
    "redux-devtools": "^3.4.1",
    "redux-form": "^7.2.0",
    "redux-thunk": "^2.2.0",
    "webpack": "^3.9.1",
    "webpack-dev-server": "^2.9.5"
  },
  "dependencies": {
    "express": "^4.16.2"
  }
}
```



# ESLintの設定追加

.eslintrcにNodeJS用のlint設定を追加します。

```
  'env': {
    'browser': true, // ブラウザ
    'es6': true, // ES6
    'node': true, // NodeJS
  },
```


# webpackの設定追加・修正

SSRはサーバ側でReactのComponentをビルドしてレンダリングするため、  
サーバサイドでビルド用のwebpack設定を記述します。  
webpack.server.jsの設定は次のようになります。  
targetにnodeを指定、libraryTargetにCommonJS形式を指定するようにしていることに注意してください。  
今回はssr.jsをビルドして作成したssr.build.jsファイルを読み込むようにします。  

```
/*globals module: false require: false __dirname: false */
const path = require('path')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル出力
  watch: true,  // 修正時に再ビルドする
  target: 'node', // NodeJS用ビルド
  entry: {
    ssr: [
      'babel-polyfill',
      path.join(__dirname, '/server/ssr.js'), // エントリポイントのjsxファイル
    ],
  },
  name: 'ssr', // [name]に入る名前
  output: {
    path: path.join(__dirname, '/server'), // serverフォルダに出力する
    filename: '[name].build.js', // 変換後のファイル名
    libraryTarget: 'commonjs2', // CommonJS形式で出力
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: __dirname, // 直下のJSファイルが対象
        exclude: [/node_modules/, /dist/ ], // node_modules, distフォルダ配下は除外
        use: {
          loader: 'babel-loader',
          query: {
            cacheDirectory: true, // キャッシュディレクトリを使用する
            presets: [
              [
                'env', {
                  targets: {
                    node: '8.6', // NodeJS バージョン8.6
                  },
                  modules: false,
                  useBuiltIns: true, // ビルトイン有効
                },
              ],
              'stage-0', // stage-0のプラグイン
              'react',
            ],
            plugins: [
              ['direct-import', [
                'material-ui', // material-ui
                'redux-form',  // redux-form
              ]],
              'babel-plugin-transform-decorators-legacy', // decorator用
            ],
          },
        },
      },
    ],
  },
}
```

webpack.config.jsのwebpack-dev-serverにproxyの設定を追加します。  
これにより、webpack-dev-serverにアクセス時でもサーバ経由のシミュレーションができます。（サーバは8000ポートで起動している想定です）  

```
  devServer: {
    proxy: {
      '/': {
        target: 'http://0.0.0.0:8000',
        secure: false,
        changeOrigin: true,
      },
    },
  },
```

webpack.build.jsにwebpack.server.jsを含めるようにします。  
リリースビルド時にssr.build.jsも生成するようにします。  

```
const webpackServer = require('./webpack.server.js')
 
// SSR用webpackビルド設定追加
function createServerConfig() {
  const config = Object.assign({}, webpackServer)
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]
  return config
}

const configs = [
  createConfig(),
  createServerConfig(),
]
```