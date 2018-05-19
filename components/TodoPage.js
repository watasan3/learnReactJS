import React from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

@withStyles({
  root: {
    fontStyle: 'italic',
    fontSize: 21,
    minHeight: 64,
  }
})
export default class TodoPage extends React.Component {

  handlePageMove(path) {
    this.props.history.push(path)
  }

  render () {
    const { classes } = this.props
    
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar classes={{root: classes.root}}>
              TODOページ
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/')}>ユーザページへ</Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}