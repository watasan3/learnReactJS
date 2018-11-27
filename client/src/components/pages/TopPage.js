import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

@connect(
  state => ({
    user: state.auth.user,
  })
)
export default class TopPage extends React.Component {

  render () {
    const { user } = this.props

    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
          トップページ
          </Toolbar>
        </AppBar>
        <Card style={{width: '100%'}}>
          <CardContent>
            {user ?
              <Button size='medium' variant='contained' color='primary' onClick={() => {}}>ログアウト</Button>
              :
              <ul style={{listStyle: 'none'}}>
                <li><Link to='/regist'>ユーザ登録</Link></li>
                <li><Link to='/login'>ログイン</Link></li>
              </ul>
            }
          </CardContent>
        </Card>
      </div>
    )
  }
}