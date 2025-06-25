import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      this.setState({showErrorMsg: false, username: '', password: ''})
      const {history} = this.props
      history.replace('/')
    } else {
      const errMsg = await response.json()
      this.setState({errMsg: errMsg.error_msg, showErrorMsg: true})
    }
  }

  render() {
    const {username, password, showErrorMsg, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-card-bg">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <label htmlFor="usernameId" className="label-text-style">
              USERNAME
            </label>
            <input
              type="text"
              id="usernameId"
              className="input-style"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label htmlFor="passwordId" className="label-text-style">
              PASSWORD
            </label>
            <input
              type="password"
              id="passwordId"
              className="input-style"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="err-msg">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
