import React from 'react'
import { connect } from 'react-redux';
import { load } from '../reducer/user'

import { withTheme, withStyles } from 'material-ui/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from 'material-ui'
import { Email } from 'material-ui-icons'
import withWidth from 'material-ui/utils/withWidth'
import { orange } from 'material-ui/colors'


import Intro from '../Intro'
@Intro([
  {
    title: 'タイトル1',
    text: '本文1',
    selector: '#item1',
    position: 'top',
    type: 'hover'
  },
  {
    title: 'タイトル2',
    text: '本文2',
    selector: '#item2',
    position: 'top',
    type: 'hover'
  }
])
// connectのdecorator
@connect(
  // propsに受け取るreducerのstate
  state => ({
    users: state.user.users
  }),
  // propsに付与するactions
  { load }
)
@withWidth()
@withTheme()
@withStyles({
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
  }
})
export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      open:false,
      user:null,
    }
  }

  componentWillMount() {
    // user取得APIコールのactionをキックする
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
  }

  handlePageMove(path) {
    this.props.history.push(path)
  }

  render () {
    const { users, theme, classes, width } = this.props
    const { primary, secondary } = theme.palette

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}} >
            タイトル({ width === 'xs' ? 'スマホ' : 'PC'})
            <Button id='item2' style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/todo')}>TODOページへ</Button>
          </Toolbar>
        </AppBar>
        {/* 配列形式で返却されるためmapで展開する */}
        {users && users.map((user) => {
          return (
              // ループで展開する要素には一意なkeyをつける（ReactJSの決まり事）
              <Card key={user.email} style={{marginTop:'10px'}}>
                <CardContent style={{color:'#408040'}}>
                  <Avatar src={user.picture.thumbnail} />
                  <p style={{margin:10, color:primary[500]}}>{'名前:' + user.name.first + ' ' + user.name.last} </p>
                  <p style={{margin:10, color:secondary[500]}}>{'性別:' + (user.gender == 'male' ? '男性' : '女性')}</p>
                  <div style={{textAlign: 'right'}} >
                    <Button id='item1' raised color='accent' onClick={() => this.handleClickOpen(user)}><Email style={{marginRight: 5, color: orange[200]}}/>Email</Button>
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