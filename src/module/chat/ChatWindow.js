import React from 'react';
import { Icon, Button, TextArea, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import './ChatWindow.css';
import axios from 'axios';
import handleSocket, { IMEvent } from './wsclient.js';

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      fromUser: '',
      toUser: '',
      list: [],
      // 用来聊天
      client: null
    }
  }
  goBack = () => {
    // 控制页面的回退
    this.props.history.goBack();
  }
  handleMsg = (e) => {
    this.setState({
      msg: e.target.value
    });
  }
  render() {
    let listInfo = this.state.list.map(item=>{
      // 获取当前用户的ID
      let uid = parseInt(sessionStorage.getItem('uid'));
      // 当前用户的消息位于右侧，对方消息位于左侧
      let cname = uid === item.from_user?'chat-info-right': 'chat-info-left';
      return (
        <li className={cname} key={item.id}>
          <img src={'http://47.96.21.88:8086/' + item.avatar} alt=""/>
          <span>{item.chat_msg}</span>
        </li>
      );
    })
    return (
      <div className="chat-window">
        <div className="chat-window-title">
           <Icon onClick={this.goBack} name='angle left' className='chat-ret-btn' size='large'/>
           <span>{this.state.uname}</span>
        </div>
        <div className="chat-window-content">
          <ul>
            {listInfo}
          </ul>
        </div>
        <div className="chat-window-input">
          <Form>
            <TextArea value={this.state.msg} onChange={this.handleMsg} placeholder='请输入内容...' />
            <Button onClick={this.goBack}>关闭</Button>
            <Button onClick={this.sendMsg} primary >发送</Button>
          </Form>
        </div>
      </div>
    );
  }

  // 接收并处理服务器返回的消息
  receiveMsg = (data) => {
    // 解析并显示对方发送的数据
    if(data.content === '对方不在线') {
      // 对方没在线
      return ;
    }
    // 接收到对方数据之后直接放到list即可
    let list = [...this.state.list];
    list.push(JSON.parse(data.content));
    this.setState({
      list: list
    });
  }
  // 发送消息
  sendMsg = () => {
    // 发送消息之前，先准备好数据包
    let { fromUser, toUser, msg, client } = this.state;
    let pdata = {
      // id保证唯一即可，用于显示的时候给key使用
      id: Math.random() + '',
      // 当前用户
      from_user: fromUser,
      // 对方用户
      to_user: toUser,
      // 头像的路径
      avatar: '/public/icon.png',
      // 实际发送的内容
      chat_msg: msg
    }
    // 进行消息发送
    client.emitEvent(IMEvent.MSG_TEXT_SEND, JSON.stringify(pdata));
    // 更新本地聊天信息
    let list = [...this.state.list];
    list.push(pdata);
    this.setState({
      list: list
    });
  }

  componentDidMount() {
    // 获取路由参数
    let state = this.props.location.state;
    this.setState({
      uname: state.uname,
      fromUser: state.fromUser,
      toUser: state.toUser
    });
    // 调用后台接口，获取聊天列表数据
    axios.post('chats/info', {
      from_user: state.fromUser,
      to_user: state.toUser
    }).then(res=>{
      this.setState({
        list: res.data.list
      });
    })
    // 初始化聊天的链接并注册用户信息
    // 参数一表示当前登录的用户ID
    // 参数二表示接收服务器数据的回调函数
    let currentUserId = sessionStorage.getItem('uid');
    let client = handleSocket(currentUserId, (data) => {
      // data表示服务器返回的数据，需要进行解析并显示
      this.receiveMsg(data);
    });
    this.setState({
      client: client
    });
  }
}

export default withRouter(ChatWindow);
