import React from 'react';
import { Icon, Button, TextArea, Form } from 'semantic-ui-react';
import './ChatWindow.css';
import axios from 'axios';

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      fromUser: '',
      toUser: '',
      list: []
    }
  }
  render() {
    let listInfo = this.state.list.map(item=>{
      return (
        <li key={item.id}>
          <img src={'http://47.96.21.88:8086/' + item.avatar} alt=""/>
          <span>{item.chat_msg}</span>
        </li>
      );
    })
    return (
      <div className="chat-window">
        <div className="chat-window-title">
           <Icon name='angle left' className='chat-ret-btn' size='large'/>
           <span>{this.state.uname}</span>
        </div>
        <div className="chat-window-content">
          <ul>
            {listInfo}
          </ul>
        </div>
        <div className="chat-window-input">
          <Form>
            <TextArea placeholder='请输入内容...' />
            <Button >关闭</Button>
            <Button primary >发送</Button>
          </Form>
        </div>
      </div>
    );
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
  }
}

export default ChatWindow;
