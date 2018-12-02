import React from 'react'
import TextField from '@material-ui/core/TextField'

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  type='text',
  required = false,
  rootClass = '',
  ...custom
}) => (
  <TextField type={type} required={required} classes={{root: rootClass}} error={!!(touched && error)} label={label} variant='outlined' helperText={touched && error} {...input} {...custom} />
)

export default renderTextField