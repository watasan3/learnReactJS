import React from 'react'
import qs from 'qs'
import { connect } from 'react-redux'
import { load } from '../reducer/user'

import { withTheme, withStyles } from '@material-ui/core/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { Email } from '@material-ui/icons'
import withWidth from '@material-ui/core/withWidth'
import { orange } from '@material-ui/core/colors'

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
export default class UserPage extends React.Component {

  constructor (props) {
    super(props)
    const state = this.props.location.state || qs.parse(this.props.location.search.slice(1))
    this.state = {
      open: !!(state && state.modal),
      email: state.email,
      location: {pathname: ''},
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.pathname !== prevState.location.pathname) {
      return { location: nextProps.location }
    }
    if (nextProps.location.search !== prevState.location.search) {
      const state = qs.parse(nextProps.location.search.slice(1))
      return {
        open: !!(state && state.modal),
        email: state.email,
        location: nextProps.location,
      }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.state.location.pathname) {
      this.setState({location: prevProps.location})
      this.props.wpUnload()
      this.props.load()
    }
  }

  componentDidMount() {
    this.props.load()
  }


  handleClickOpen (user) {
    this.props.history.replace(`${this.props.location.pathname}?modal=true&email=${user.email}`)
  }

  handleRequestClose () {
    this.setState({ open: false })
    this.props.history.replace(`${this.props.location.pathname}`)
  }

  handlePageMove(path) {
    this.props.history.push(path)
  }
  
  render () {
    const { users, theme, classes, width } = this.props
    const { primary, secondary } = theme.palette

    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}}>
            ユーザページ({ width === 'xs' ? 'スマホ' : 'PC'})
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/todo')}>TODOページへ</Button>
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
                  <Button variant='raised' color='secondary' onClick={() => this.handleClickOpen(user)}><Email style={{marginRight: 5, color: orange[200]}}/>メールする</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {
          this.state.open &&
          <Dialog open={this.state.open} onClose={() => this.handleRequestClose()}>
            <DialogTitle>メールアドレス</DialogTitle>
            <DialogContent>{this.state.email}</DialogContent>
          </Dialog>
        }
      </div>
    )
  }
}