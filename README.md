# リリースビルド
基本的にライブラリはBabelするためdevDependenciesでインストールします。  
リリースビルド用に下記のパッケージを追加でインストールしてあります。

```
$ yarn add --dev npm-run-all autoprefixer precss html-webpack-plugin copy-webpack-plugin babel-preset-env babel-preset-react babel-preset-stage-0 parallel-webpack 
```

package.jsonは次のようになります。  

```package.json
{
  "name": "learnReactJS",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/teradonburi/learnReactJS.git",
  "author": "teradonburi <daikiterai@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "webpack-dev-server",
    "lint": "eslint .",
    "rm": "rm -rf dist/*",
    "build-webpack": "parallel-webpack -p --config webpack.build.js",
    "build": "run-s rm build-webpack"
  },
  "devDependencies": {
    "autoprefixer": "^7.1.6",
    "axios": "^0.17.1",
    "babel-core": "^6.26.0",
    "babel-eslint": "^8.2.1",
    "babel-loader": "^7.1.2",
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
    "material-ui": "^1.0.0-beta.27",
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
  }
}
```

webpack.config.jsです。  
HtmlWebpackPluginとautoprefixerのプラグインを追加しました。  
HtmlWebpackPluginはindex.htmlのbundle.js埋め込みを動的に行ってくれます。  
autoprefixerはcss3のベンダープレフィックスをBabelビルド時に付与してくれます。  
presetsにenvオプションを追加しました。  
対象ブラウザは最新から２つ前までにビルド最適化します。  

```webpack.config.js
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    path.join(__dirname, '/index'), // エントリポイントのjsxファイル
  ],
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: path.join(__dirname, '/static'), // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す場合にindex.htmlに飛ばす
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 8080, // 起動ポート,
  },
  output: {
    publicPath: '/', // デフォルトルートにしないとHMRは有効にならない
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 出力ファイル名
      template: 'static/index.html', // template対象のindex.htmlのパス
    }),
    new webpack.HotModuleReplacementPlugin(), // HMR(Hot Module Reload)プラグイン利用
    // autoprefixerプラグイン利用、cssのベンダープレフィックスを自動的につける 
    new webpack.LoaderOptionsPlugin({options: {
      postcss: [precss, autoprefixer({browsers: ['last 2 versions']})]
    }})
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: [/node_modules/, /dist/ ], // node_modules, distフォルダ配下は除外
      include: __dirname, // 直下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          // babel build presets
          presets: [
            [
              'env', {
                targets: {
                  browsers: ['last 2 versions', '> 1%'] // ビルド最適化のブラウザターゲット
                },
                modules: false,
                useBuiltIns: true,  // ビルトイン有効
              }
            ],
            'stage-0', // stage-0のプラグイン
            'react', // reactのプラグインまとめ
          ],
          // babel トランスパイルプラグイン
          plugins: [
            'transform-class-properties', // classのプロパティ用
            'babel-plugin-transform-decorators-legacy', // decorator用
            'react-hot-loader/babel' // react-hot-loader用
          ] 
        }
      }
    }]
  }
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
  <!-- <script src='bundle.js'></script>-->
</body>
</html>
```

webpack.build.jsです。  
リリースビルド時はwebpack.config.jsの設定を上書きしてビルドします。  
プラグインでソースコードの圧縮、環境変数の埋め込みを行います。  

```webpack.build.js
const webpack = require('webpack')
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Gitのリビジョン取得（リビジョン別に生成されるjsファイルは別名）
const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim()


function createConfig() {
  
  const config = Object.assign({}, webpackConfig)

  // ソースマップファイルをファイル出力
  config.devtool = 'source-map'
  // React Hot loaderは外す
  config.entry = {
    'bundle': [
      'babel-polyfill',
      path.join(__dirname, '/index'), // エントリポイントのjsxファイル
    ]
  }
  // 出力ファイル
  config.output = {
    path: `${__dirname}/dist`,
    filename: 'js-[hash:8]/[name].js',
    chunkFilename: 'js-[hash:8]/[name].js',
    publicPath: '/',
  }

  config.plugins = [
    // Scope Hoisting
    // スコープの巻き上げによる呼び出し回数の削減と圧縮
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 共通モジュールをまとめる
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js-[hash:8]/vendor.js',
      minChunks: (module) => {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    // 環境変数をエクスポート
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'GIT_REVISION': JSON.stringify(revision),
      },
    }),
    // JSミニファイ
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        drop_debugger: true,
        drop_console: true,
        warnings: false
      }
    }),
    // HTMLテンプレートに生成したJSを埋め込む
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `static/index.html`,
    }),
  ]

  // staticフォルダのリソースをコピーする（CSS、画像ファイルなど）
  config.plugins.push(
    new CopyWebpackPlugin([{ from: 'static', ignore: 'index.html' }]),
  )

  return config
}

const configs = [
  createConfig()
]

module.exports = configs
```

npm-run-allパッケージを使うとrun-s（順次）、run-p（並列）で複数のnpmコマンドを実行できます。
`run-s rm build-webpack`
次のコマンドでリリースビルドを行います。  

```
$ yarn run build
```

成功するとdistフォルダにリリースビルド完了後のソースファイルが出力されるのでこのフォルダをS3や本番サーバの公開フォルダにデプロイします。  
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