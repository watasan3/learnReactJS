# リリースビルド
基本的にライブラリはBabelするためdevDependenciesでインストールします。  
リリースビルド用に下記のパッケージを追加でインストールしてあります。

```
$ yarn add --dev npm-run-all autoprefixer precss html-webpack-plugin copy-webpack-plugin
```

package.jsonは次のようになります。  

```package.json
{
  "name": "learnreactjs",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/teradonburi/learnReactJS.git",
  "author": "teradonburi <daikiterai@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "lint": "eslint .",
    "rm": "rm -rf dist/*",
    "build-webpack": "NODE_ENV=production webpack -p --config webpack.build.js",
    "build": "run-s rm build-webpack"
  },
  "devDependencies": {
    "@babel/core": "^7.1.0",
    "@babel/plugin-proposal-class-properties": "^7.1.0",
    "@babel/plugin-proposal-decorators": "^7.1.0",
    "@babel/polyfill": "^7.0.0",
    "@babel/preset-env": "^7.1.0",
    "@babel/preset-react": "^7.0.0",
    "@material-ui/core": "^3.1.1",
    "@material-ui/icons": "^3.0.1",
    "autoprefixer": "^9.1.5",
    "axios": "^0.18.0",
    "babel-eslint": "^9.0.0",
    "babel-loader": "^8.0.2",
    "connected-react-router": "^4.5.0",
    "copy-webpack-plugin": "^4.5.2",
    "eslint": "^5.6.0",
    "eslint-loader": "^2.1.1",
    "eslint-plugin-react": "^7.11.1",
    "history": "^4.7.2",
    "html-webpack-plugin": "^3.2.0",
    "npm-run-all": "^4.1.3",
    "precss": "^3.1.2",
    "react": "^16.5.2",
    "react-dom": "^16.5.2",
    "react-hot-loader": "^4.3.11",
    "react-redux": "^5.0.7",
    "react-router-dom": "^4.3.1",
    "redux": "^4.0.0",
    "redux-devtools": "^3.4.1",
    "redux-form": "^7.4.2",
    "redux-thunk": "^2.3.0",
    "webpack": "^4.19.1",
    "webpack-cli": "^3.1.1",
    "webpack-dev-server": "^3.1.9"
  }
}
```

webpack.config.jsです。  
HtmlWebpackPluginとautoprefixerのプラグインを追加しました。  
HtmlWebpackPluginはindex.htmlのbundle.js埋め込みを動的に行ってくれます。  
autoprefixerはcss3のベンダープレフィックスをBabelビルド時に付与してくれます。  
presetsにstage-0文法をサポートするプラグインを追加しています。  
targetsで最新ブラウザの2個前およびシェア１％以上のブラウザまでをビルド対象としています。  
modulesは特定のES6文法に最適化しません。  
useBuiltInsはpolyfillを有効化します。  


```webpack.config.js
/*globals module: false require: false __dirname: false */
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 開発モード
  devtool: 'cheap-module-source-map', // ソースマップファイル出力
  entry: [
    '@babel/polyfill', // babelのpolyfill設定
    'react-hot-loader/patch',
    path.join(__dirname, '/index'), // エントリポイントのjsxファイル
  ],
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: path.join(__dirname, '/static'), // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す場合にindex.htmlに飛ばす
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 7070, // 起動ポート,
  },
  output: {
    publicPath: '/', // 公開パスの指定
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 出力ファイル名
      template: 'static/index.html', // template対象のindex.htmlのパス
    }),
    new webpack.HotModuleReplacementPlugin(), // HMR(Hot Module Reload)プラグイン利用
    // autoprefixerプラグイン利用、cssのベンダープレフィックスを自動的につける
    new webpack.LoaderOptionsPlugin({options: {
      postcss: [precss, autoprefixer({browsers: ['last 2 versions']})],
    }}),
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: [/node_modules/, /dist/ ], // node_modules, distフォルダ配下は除外
      include: __dirname, // 直下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
                'targets': {
                  'browsers': ['last 2 versions', '> 1%'],
                },
                'modules': false,
                'useBuiltIns': 'usage',
              }],
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // decorator用
              ['@babel/plugin-proposal-class-properties', { loose: true }], // クラスのdefaultProps、アローファンクション用
              'react-hot-loader/babel', // react-hot-loader用
            ],
          },
        },
      },
    }],
  },
}
```

index.htmlからはbundle.jsの埋め込みを削除します。  
(HtmlWebpackPluginが動的に埋め込みを行ってくれます)  

```index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>learnReactJS</title>
</head>
<body>
  <div id="root"></div>
  <!-- <script src='./dist/bundle.js'></script>-->
</body>
</html>
```

webpack.build.jsです。  
リリースビルド時はwebpack.config.jsの設定を上書きしてビルドします。  
プラグインでソースコードの圧縮、環境変数の埋め込みを行います。  

```webpack.build.js
/*globals module: false require: false __dirname: false process: false */
const webpack = require('webpack')
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim()

function createConfig() {

  const config = Object.assign({}, webpackConfig)

  // ソースマップファイルをファイル出力
  config.mode = 'production'
  // ソースマップファイルをファイル出力
  config.devtool = 'source-map'
  // React Hot loaderは外す
  config.entry = {
    'bundle': [
      'babel-polyfill',
      path.join(__dirname, '/index'), // エントリポイントのjsxファイル
    ],
  }
  // 出力ファイル
  config.output = {
    path: `${__dirname}/dist`,
    filename: 'js-[hash:8]/[name].js',
    chunkFilename: 'js-[hash:8]/[name].js',
    publicPath: '/',
  }

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /react/,
          name: 'react',
          chunks: 'all',
        },
        core: {
          test: /redux|core-js|jss|history|matarial-ui|lodash|moment|rollbar|radium|prefixer|\.io|platform|axios/,
          name: 'core',
          chunks: 'all',
        },
      },
    },
  }

  config.plugins = [
    // 環境変数をエクスポート
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'GIT_REVISION': JSON.stringify(revision),
      },
    }),
    // HTMLテンプレートに生成したJSを埋め込む
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'static/index.html',
    }),
  ]

  // staticフォルダのリソースをコピーする（CSS、画像ファイルなど）
  config.plugins.push(
    new CopyWebpackPlugin([{ from: 'static', ignore: 'index.html' }]),
  )

  return config
}

const configs = [
  createConfig(),
]

module.exports = configs
```

index.jsのredux-devtoolを本番時はデバッグできないように修正します。  
process.env.NODE_ENVはリリースビルド時の環境変数を参照しています。  

```
/*globals module: false process: false */

...(略)

// redux-devtoolの設定
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// 本番時はredux-devtoolを無効化する
if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose
}
```

npm-run-allパッケージを使うとrun-s（順次）、run-p（並列）で複数のnpmコマンドを実行できます。
`run-s rm build-webpack`
次のコマンドでリリースビルドを行います。  

```
$ yarn run build
```

成功するとdistフォルダにリリースビルド完了後のソースファイルが出力されるのでこのフォルダをS3や本番サーバの公開フォルダにデプロイします。  
(このとき出力されるソースマップファイル(.map)は元ソースコードがバレてしまうのでデプロイには含めないようにします)  
今回は簡易的にサーバを立てて確認します。  
serveパッケージを使うと簡単にサーバをローカル上に立てれます。  

```
$ yarn global add serve
$ cd dist
$ serve .
   ┌───────────────────────────────────────────────────┐
   │                                                   │
   │   Serving!                                        │
   │                                                   │
   │   - Local:            http://localhost:5000       │
   │   - On Your Network:  http://192.168.2.101:5000   │
   │                                                   │
   │   Copied local address to clipboard!              │
   │                                                   │
   └───────────────────────────────────────────────────┘
```

express + Nginx + EC2でサーバを立てる場合は下記を参考にしてください  
[ReactJSで作る今時のSPA入門（リリース編）](https://qiita.com/teradonburi/items/212fab958b896e6ee85a#%E3%82%B5%E3%83%BC%E3%83%90%E8%B5%B7%E5%8B%95%E3%81%AE%E6%B0%B8%E7%B6%9A%E5%8C%96)  

バックエンドをServerlessフレームワークにする場合は下記を参考にしてください  
[Serverless+SPAで超低費用な個人サービス構築のススメ](https://qiita.com/teradonburi/items/aa31fa91d618dd6955a1)  