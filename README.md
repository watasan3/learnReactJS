# getDerivedStateFromPropsでreplaceする
componentWillMountとcomponentWillReceivePropsは非推奨になるのでgetDerivedStateFromPropsでreplaceします。  


```UserPage.js
@connect(
  // propsに受け取るreducerのstate
  state => ({
    user: state.user.user
  }),
  // propsに付与するactions
  { load }
)
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

  render() {
    const { user } = this.props

    return (
      <Button variant='raised' color='secondary' onClick={() => this.handleClickOpen(user)}><Email style={{marginRight: 5, color: orange[200]}}/>メールする</Button>
      <div>
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
```