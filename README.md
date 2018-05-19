# SSR(サーバサイドレンダリング)について
今まではクライアントサイドのみでReactを動かしてきました。(CSR)  
今回はサーバ側でReact Componentのビルドを行い、初回のHTML生成をサーバ側で行います。  
ただし、アプリケーションの複雑性が増すため、以下のケースを除いて安易に導入するべきではありません。  

* OGP用metaタグの切り替え（Twitter、Facebook用）
* 初回の描画が早くなる（特にComponentの量が増えてきた時）
* AMP対応

デメリットとしては、

* アプリケーションの複雑度が増す
* サーバ側のDOMとクライアントサイド側のDOMの一致（初期化時）を強いられる
* 公開ページのルーティングが一致していないといけない（APIアクセス→SSR→CSR(初回以外のルーティングはクライアント側のReact Routerとなるため))

一般にデメリットの方が大きいです。  

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
    "dev:server-build": "webpack --config webpack.server.js --watch",
    "dev:server": "NODE_ENV=dev node-dev --inspect server/server.js",
    "dev:client": "webpack-dev-server --mode development",
    "lint": "eslint .",
    "rm": "rm -rf dist/*",
    "build-webpack": "NODE_ENV=production webpack -p --config webpack.build.js",
    "build": "run-s rm build-webpack",
    "prod": "NODE_ENV=production node server/server.js"
  },
  "devDependencies": {
    "autoprefixer": "^7.1.6",
    "axios": "^0.17.1",
    "babel-core": "^6.26.0",
    "babel-eslint": "^8.2.1",
    "babel-loader": "^7.1.3",
    "babel-plugin-direct-import": "^0.5.0",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "copy-webpack-plugin": "^4.5.0",
    "eslint": "^4.15.0",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-react": "^7.5.1",
    "history": "^4.7.2",
    "html-webpack-plugin": "^3.0.4",
    "material-ui": "^1.0.0-beta.34",
    "material-ui-icons": "^1.0.0-beta.17",
    "npm-run-all": "^4.1.2",
    "precss": "^2.0.0",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-hot-loader": "^4.1.2",
    "react-redux": "^5.0.6",
    "react-router-dom": "4.2.2",
    "react-router-redux": "^5.0.0-alpha.8",
    "redux": "^3.7.2",
    "redux-devtools": "^3.4.1",
    "redux-form": "^7.2.0",
    "redux-thunk": "^2.2.0",
    "webpack": "^4.1.0",
    "webpack-cli": "^2.0.10",
    "webpack-dev-server": "^3.1.0"
  },
  "dependencies": {
    "express": "^4.16.2",
    "jsdom": "^11.6.2"
  }
}
```


```
# 開発版実行
$ yarn dev:server-build
$ yarn dev
# リリース版実行
$ yarn build
$ yarn prod
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
  mode: 'development', // 開発モード
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
これにより、webpack-dev-serverにアクセス時でもサーバ経由のシミュレーションができます。（サーバは7000ポートで起動している想定です）  
index.htmlだとルートパス(/)が正しくルーティングされない問題が発生するのでtemplate.htmlにリネームします。(static/template.html)  
HtmlWebpackPluginの読み込みhtmlをtemplate.htmlにリネームします。

```
  devServer: {
    publicPath: '/',
    proxy: {
      '**': {
        target: 'http://0.0.0.0:7000',
        secure: false,
        logLevel: 'debug',
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'template.html', // 出力ファイル名
      template: 'static/template.html', // template対象のtemplate.htmlのパス
    }),
  ],
```

webpack.build.jsにwebpack.server.jsを含めるようにします。  
リリースビルド時にssr.build.jsも生成するようにします。  
HtmlWebpackPlugin、CopyWebpackPluginもindex.htmlからtemplate.htmlに修正します。  

```
const webpackServer = require('./webpack.server.js')

function createConfig() {

  config.plugins = [
    // HTMLテンプレートに生成したJSを埋め込む
    new HtmlWebpackPlugin({
      filename: 'template.html',  // 出力ファイル名
      template: 'static/template.html', // template対象のtemplate.htmlのパス
    }),
  ]

  // staticフォルダのリソースをコピーする（CSS、画像ファイルなど）
  config.plugins.push(
    new CopyWebpackPlugin([{ from: 'static', ignore: 'template.html' }]),
  )
}


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

module.exports = configs
```

# クライアント側の修正

Material-UIのテーマはSSRでも使うため、theme.jsに分離します。  

```
import { createMuiTheme } from '@material-ui/core/styles'

// Material-UIテーマを作成
export default createMuiTheme({
  // カラーパレット
  palette: {
    type: 'light',
    // メインカラー
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
    // アクセントカラー
    secondary: {
      50: '#fce4ec',
      100: '#f8bbd0',
      200: '#f48fb1',
      300: '#f06292',
      400: '#ec407a',
      500: '#e91e63',
      600: '#d81b60',
      700: '#c2185b',
      800: '#ad1457',
      900: '#880e4f',
      A100: '#ff80ab',
      A200: '#ff4081',
      A400: '#f50057',
      A700: '#c51162',
      contrastDefaultColor: 'light', // 対象色のデフォルト色をlightテーマにする
    },
  },
  // レスポンシブレイアウト用の指定
  'breakpoints': {
    'keys': [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    'values': {
      'xs': 360, // スマホ用
      'sm': 768, // タブレット用
      'md': 992, // PC用
      'lg': 1000000000,
      'xl': 1000000000,
    },
  },
  // Material-UIコンポーネントのclassのstyleを上書きする
  overrides: {
    MuiButton: {
      root: {
        // ボタン内アルファベット文字を大文字変換しない
        textTransform: 'none',
      },
    },
  },
})
```

index.jsを修正します。  
レンダリングにはReact.renderではなくReact.hydrateを使用します。  
React.hydrateはCSRとSSRで生成されたDOMとが一致する必要があります。  
initial-dataはSSR側からのRedux Storeの初期状態を取得し、  
CSRのレンダリング時にRedux Storeを引き継ぎするためのものです。  
createStore生成時にinitialDataとして付与しています。  
SSR側でのパラメータの渡し方は後述します。  

```
import theme from './theme'

const render = Component => {
  const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'))

  // ブラウザ履歴保存用のストレージを作成
  const history = createHistory()
  // axiosをthunkの追加引数に加える
  const thunkWithClient = thunk.withExtraArgument(client)
  // redux-thunkをミドルウェアに適用、historyをミドルウェアに追加
  const store = createStore(reducer, initialData, composeEnhancers(applyMiddleware(routerMiddleware(history), thunkWithClient)))

  ReactDOM.hydrate(
    <AppContainer>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Component history={history} />
        </Provider>
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

```

template.htmlです。  
Redux Store初期パラメータ渡し用のscriptタグを追加してあります。  
data-jsonパラメータ経由で取得します。  

```
<html>
<head>
  <meta charset="utf-8" />
  <title>learnReactJS</title>
</head>
<body>
  <div id="root"></div>
  <script id="initial-data" type="text/plain" data-json="{}"></script>
</body>
</html>
```

UserPage.jsです。  
SSRでは、withWidthが使えないので代わりに[Hiddenコンポーネント](https://material-ui-next.com/layout/hidden/)を使っています。  
サーバ側から経由する際の初期化パラメータはinitialDataとしてRedux Storeから取得します。（@connectのパラメータ）  

```
import { Hidden } from 'material-ui'

// connectのdecorator
@connect(
  // propsに受け取るreducerのstate
  state => ({
    users: state.user.users,
  }),
  // propsに付与するactions
  { load }
)
@withTheme()
@withStyles({
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
  },
})
export default class UserPage extends React.Component {

  componentDidMount() {
    // user取得APIコールのactionをキックする
    this.props.load()
  }

  render () {
    const { users, theme, classes } = this.props
    const { primary, secondary } = theme.palette

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}}>
            <Hidden xsDown>
              ユーザページ(PC)
            </Hidden>
            <Hidden smUp>
              ユーザページ(スマホ)
            </Hidden>
            <Button style={{color: '#fff', position: 'absolute', top: 15, right: 0}} onClick={() => this.handlePageMove('/todo')}>TODOページへ</Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
```

# SSR

server.jsです。  
expressフレームワークによるサーバ実装をしています。  
React Componentを含むssr.jsをwebpackビルドしてssr.build.jsを読み込みます。  
開発時のwebpack-dev-serverで起動時はwebpack-dev-server側のbundle.jsを取得するようにします。本番時はビルド済みのdistフォルダをホスティングし、bundle.jsのパスをhtmlより取得しています。  
（パス取得にJSDOMというライブラリを使用しています）  
取得したパスをapp.allにて各ページ表示apiアクセス時にreqパラメータに付与しています。  

```
const express = require('express')
const app = express()

// webpackでbuild済みのSSRモジュールを読み込む
const ssr = require('./ssr.build').default

let bundles = []
if (process.env.NODE_ENV === 'dev') {
  // webpack-dev-serverのbundle.jsにredirect
  app.get('/bundle.js', (req, res) => res.redirect('http://localhost:7070/bundle.js'))
} else if (process.env.NODE_ENV === 'production') {
  const jsdom = require('jsdom')
  const { JSDOM } = jsdom
  // distフォルダをホスティング
  app.use(express.static('dist'))
  // distのtemplate.htmlのbundle.jsパスを取得
  JSDOM.fromFile(__dirname + '/../dist/template.html').then(dom => {
    const document = dom.window.document
    const scripts = document.querySelectorAll('script[type="text/javascript"]')
    for (let i = 0; i < scripts.length; i++) {
      const s = scripts[i]
      if (s.src.indexOf('bundle.js') !== -1 || s.src.indexOf('core.js') !== -1 || s.src.indexOf('react.js') !== -1) {
        bundles.push(s.src.replace('file:///', '/'))
      }
    }
    console.log(bundles)
  })
  app.all('*', (req, res, next) => {
    req.bundles = bundles
    next()
  })
}

app.get('/', (req, res) => {
  // redux storeに代入する初期パラメータ、各ページの初期ステートと同じ構造にする
  const initialData = {
    user: {
      users: null,
    },
  }
  ssr(req, res, initialData)
})

app.get('/todo', (req, res) => {
  const initialData = {}
  ssr(req, res, initialData)
})


app.listen(7000, function () {
  console.log('app listening on port 7000')
})

// 例外ハンドリング
process.on('uncaughtException', (err) => console.log('uncaughtException => ' + err))
process.on('unhandledRejection', (err) => console.log('unhandledRejection => ' + err))

```

ssr.jsです。ReactのComponentをレンダリングし、各ページの初期表示用のhtmlを返却します。  
SheetsRegistry、JssProvider、MuiThemeProvider、createGenerateClassNameでMaterial-UIのSSRを初期化します。  
createStoreでRedux Storeを作成します。  
各ページの初期状態をinitial-dataに埋め込みます。(クライアント側のRedux Storeに渡す)  
`<script id='initial-data' type='text/plain' data-json={JSON.stringify(props.initialData)}></script>`  
StaticRouter、Route、Switchで各apiパスでページのルーティングを割当します。(apiパスとReact Routerのルーティングが一致している必要があります)  
template.htmlとDOM構造が一致した各ページのルーティングに対応したmetaタグ要素を変更したhtmlを返却します。  

```
import React from 'react'
// SSR用ライブラリ
import ReactDOMServer from 'react-dom/server'
// Redux
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// Material-UI SSR
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles'
// React Router
import { StaticRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
// reducer
import reducer from '../reducer/reducer'
// material-ui theme
import theme from '../theme'

// クライアントサイドと同じComponentを使う
import UserPage from '../components/UserPage'
import TodoPage from '../components/TodoPage'


export default function ssr(req, res, initialData) {
  console.log('------------------ssr------------------')
  const context = {}
  // Material-UIの初期化
  const sheetsRegistry = new SheetsRegistry()
  const generateClassName = createGenerateClassName({productionPrefix: 'mm'})

  // Redux Storeの作成(initialDataには各Componentが参照するRedux Storeのstateを代入する)
  const store = createStore(reducer, initialData, applyMiddleware(thunk))

  const body = () => (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <Provider store={store}>
          {/* ここでurlに対応するReact RouterでComponentを取得 */}
          <StaticRouter location={req.url} context={context}>
            <Switch>
              <Route exact path="/" component={UserPage} />
              <Route path="/todo" component={TodoPage} />
            </Switch>
          </StaticRouter>
        </Provider>
      </MuiThemeProvider>
    </JssProvider>
  )

  // htmlを生成
  ReactDOMServer.renderToNodeStream(
    <HTML
      bundles={req.bundles}
      style={sheetsRegistry.toString()} // Material-UIのスタイルをstyleタグに埋め込む
      initialData={initialData}
    >
      {body}
    </HTML>
  ).pipe(res)

}

const HTML = (props) => {
  return (
    <html lang='ja'>
      <head>
        {/* ここでmetaタグの切り替えやAMP用のhtml出力の切り替えを行う、今回は具体例は省略 */}
        <meta charSet="utf-8" />
        <title>learnReactJS</title>
        <style>{props.style}</style>
      </head>
      <body>
        <div id='root'>{props.children}</div>
        <script id='initial-data' type='text/plain' data-json={JSON.stringify(props.initialData)}></script>
        {
          props.bundles ?
            props.bundles.map(bundle => <script key={bundle} type='text/javascript' src={bundle}></script>)
            :
            <script type='text/javascript' src='/bundle.js'></script>
        }
      </body>
    </html>
  )
}
```



