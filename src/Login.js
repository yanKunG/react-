/*
  登录组件
*/
import React from 'react';
import './Login.css';
import { withRouter } from 'react-router-dom';
import { Icon, Form, Divider } from 'semantic-ui-react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  handleLogin = () => {
    // 控制登录
    // console.log(this.state.username)
    // console.log(this.state.password)
    axios.post('users/login', {
      uname: this.state.username,
      pwd: this.state.password
    }).then(res=>{
      // 登录成功后应该跳转到主页面
      if(res.meta.status === 200) {
        // 保存token到本地缓存中
        sessionStorage.setItem('mytoken', res.data.token);
        // 跳转到主页面
        let { history } = this.props;
        history.push('/home');
      }
    })
  }
  handleUsername = (e) => {
    this.setState({
      username: e.target.value
    });
  }
  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    });
  }
  render() {
    return (
      <div className="login-container">
        {/*顶部的Logo*/}
        <div className="login-logo">
          <Icon size='huge' name='home'/>
        </div>
        {/*表单*/}
        <div className="login-form">
          <Form>
            <Form.Input
              icon='user' 
              required 
              size='big' 
              iconPosition='left' 
              name='username'
              value={this.state.username}
              onChange={this.handleUsername}
              placeholder='请输入用户名...' 
            />
            <Form.Input
              icon='lock' 
              required 
              size='big' 
              iconPosition='left' 
              name='password'
              value={this.state.password}
              onChange={this.handlePassword}
              placeholder='请输入密码...' 
            />
            <Form.Button fluid primary onClick={this.handleLogin}>登录</Form.Button>
          </Form>
        </div>
        <Divider horizontal>---</Divider>
        <div className="login-third">
          <Icon size='big' name='qq' color='blue'/>
          <Icon size='big' name='weixin' color='green'/>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
