import React from 'react'
import { connect } from 'react-redux';
import { load, add } from 'reducer/user'

import { withStyles } from 'material-ui/styles'
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, TextField } from 'material-ui'
import Typography from 'material-ui/Typography'
import { Email } from 'material-ui-icons'
import { Field, reduxForm } from 'redux-form'

import Intro from 'Intro'
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
@reduxForm({
  form: 'syncValidation',
  validate: values => {
    
    const errors = {}
    if (!values.username) {
      errors.username = '必須項目です'
    } 
    if (!values.email) {
      errors.email = '必須項目です'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'メールアドレスとして認識できません'
    }
    if (!values.age) {
      errors.age = '必須項目です'
    } else if (isNaN(Number(values.age))) {
      errors.age = '数字でありません'
    } else if (Number(values.age) < 18) {
      errors.age = '１８歳以上限定です'
    }
    return errors
  }
})
export default class TodoPage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
  }

  handlePageMove(path) {
    this.props.history.push(path)
  }
  

  submit(values) {
    // print the form values to the console
    console.log(values)
  }

  render () {
    const { handleSubmit, submitting } = this.props

    const renderField = ({
      id,
      input,
      label,
      type,
      meta: { touched, error, warning }
    }) => {
      const isError = !!(touched && error)
      return (
        <div>
          <div>
            <TextField id={id} style={{marginTop:5,marginBottom:5}} error={isError} label={label} helperText={isError ? error : ''} {...input} type={type} />
          </div>
        </div>
      )
    }
    
    // 初回はnullが返ってくる（initialState）、処理完了後に再度結果が返ってくる
    // console.log(users)
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography type="title" color="inherit">
              TODOページ
            </Typography>
            <Button style={{color:'#fff',position:'absolute',top:15,right:0}} onClick={()=> this.handlePageMove('/')}>ユーザページへ</Button>
          </Toolbar>
        </AppBar>
        <Card style={{padding:10}}>
          <form onSubmit={handleSubmit(this.submit)}>
            <Field id='item1' name="username" type="text" component={renderField} label="ユーザ名" />
            <Field id='item2' name="email" type="email" component={renderField} label="メールアドレス" />
            <Field name="age" type="number" component={renderField} label="年齢" />
            <Button style={{marginTop:10}} raised type="submit" disabled={submitting}>送信</Button>
          </form>
        </Card>
      </div>
    )
  }
}