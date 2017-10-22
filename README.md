# Material-UIでモダンな画面を作る
マテリアルデザインはGoogleが提唱するデザインフォーマットです。  
フラットデザインに現実の物理要素（影やフィードバック）を持たせたようなデザインです。  
Androidアプリでの全面的な利用など最近のアプリケーションのデザインは大体マテリアルデザインでできています。  
[Material Design](https://material.io/guidelines/)  
  
ReactJSではマテリアルデザインを踏襲したMaterial-UIというライブラリがあります。    
Material-UIのパッケージをインストールします。  

```
$ npm install -D material-ui@next material-ui-icons
```

package.jsonは次のようになります。

```package.json
{
  "name": "meetdep",
  "version": "1.0.0",
  "description": "",
  "main": "test.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "axios": "^0.16.2",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "material-ui": "^1.0.0-beta.16",
    "material-ui-icons": "^1.0.0-beta.15",
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "react-redux": "^5.0.6",
    "react-router-dom": "^4.2.2",
    "react-router-redux": "^4.0.8",
    "redux": "^3.7.2",
    "redux-devtools": "^3.4.0",
    "redux-thunk": "^2.2.0",
    "webpack": "^3.6.0"
  },
  "dependencies": {}
}
```

ユーザを取得したApp.jsをmaterial-uiで書き直します。

```App.js
import React from 'react'
import { connect } from 'react-redux'
import { load } from './user'

import { withStyles } from 'material-ui/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from 'material-ui'
import Typography from 'material-ui/Typography'
import { Email } from 'material-ui-icons'

@connect(
  state => ({
    users: state.user.users
  }),
  { load }
)
export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      open:false,
      user:null,
    }
  }

  componentWillMount () {
    this.props.load()
  }

  handleClickOpen (user) {
    this.setState({
      open: true,
      user: user,
    })
  }

  handleRequestClose () {
    this.setState({ open: false })
  };

  render () {
    const { users } = this.props
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              タイトル
            </Typography>
          </Toolbar>
        </AppBar>
          {/* 配列形式で返却されるためmapで展開する */}
          {users && users.map((user) => {
            return (
                // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
                <Card key={user.email} style={{marginTop:'10px'}}>
                  <CardContent style={{color:'#408040'}}>
                    <Avatar src={user.picture.thumbnail} />
                    <p style={{margin:10}}>{'名前:' + user.name.first + ' ' + user.name.last} </p>
                    <p style={{margin:10}}>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</p>
                    <div style={{textAlign: 'right'}} >
                      <Button onClick={() => this.handleClickOpen(user)}><Email/>メールする</Button>                    
                    </div>
                  </CardContent>
                </Card>                
            )
          })}        
          {
            this.state.open &&
            <Dialog open={this.state.open} onRequestClose={() => this.handleRequestClose()}>
              <DialogTitle>メールアドレス</DialogTitle>
              <DialogContent>{this.state.user.email}</DialogContent>
            </Dialog>
          }  
      </div>
    )
  }
}
```

Material-UIの各コンポーネントに関しては  
公式：Material-UIのComponents Demoに各種コンポーネントのデモを見たほうが理解できると思います。  
  
Material UIのアイコンに関しては下記アイコンが使えます。  
[Material icons](material.io/icons/)
  
今回はメールのアイコンを使っています。  
emailというアイコン名になっているので、  
次のように先頭大文字でメールアイコンを読み込みできます。  

```App.js
import { Email } from 'material-ui-icons'
```