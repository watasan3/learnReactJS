import React from 'react'
import { connect } from 'react-redux'
import { create } from 'reducer/auth'
import { reduxForm, Field } from 'redux-form'
import renderTextField from 'components/forms/renderTextField'
import Button from '@material-ui/core/Button'

@reduxForm({
  form: 'regist',
  validate: values => {
    const errors = {}
    if (!values.email) {
      errors.email = '必須項目です'
    }
    if (!values.password) {
      errors.password = '必須項目です'
    }
    if (!values.password) {
      errors.password = '6文字以上必要です'
    }
    return errors
  },
})
@connect(
  state => ({
    user: state.auth.user,
  }),
  { create }
)
export default class RegistPage extends React.Component {

  submit = (values) => {
    this.props.create(values)
      .then(() => this.props.history.push('/'))
  }

  render () {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit(this.submit)} style={{display: 'flex', flexDirection: 'column', maxWidth: 300}}>
        <Field name='email' label='Eメール' component={renderTextField} />
        <Field name='password' label='パスワード' type='password' component={renderTextField} />
        <Button type='submit' size='medium' variant='contained' color='primary' >ユーザ登録</Button>
      </form>
    )
  }
}