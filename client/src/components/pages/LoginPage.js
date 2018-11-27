import React from 'react'
import { connect } from 'react-redux'
import { show } from 'reducer/auth'
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
  { show }
)
export default class LoginPage extends React.Component {

  submit = (values) => {
    this.props.show(values)
      .then(() => this.props.history.push('/'))
  }

  render () {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit(this.submit)}>
        <Field name='email' component={renderTextField} />
        <Field name='password' type='password' component={renderTextField} />
        <Button type='submit' size='medium' variant='contained' color='primary' >ログイン</Button>
      </form>
    )
  }
}