import React from 'react';
import './Index.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }
  toChat = (uname, fromUser, toUser) => {
    // 跳转到聊天窗口
    let { history } = this.props;
    history.push('/home/cwin', {
      uname: uname,
      fromUser: fromUser,
      toUser: toUser
    });
  }
  render() {
    let chatInfo = this.state.list.map(item=>{
      return (
        <li onClick={this.toChat.bind(this, item.username, item.from_user, item.to_user)} key={item.id}>
          <div className="avarter">
            <img src={'http://47.96.21.88:8086/' + item.avatar} alt="avarter"/>
            <span className="name">{item.username}</span>
            <span className="info">{item.chat_msg}</span>
            <span className="time">{item.ctime}</span>
          </div>
        </li>
      );
    })
    return (
      <div className="chat-container">  
        <div className="chat-title">微聊</div>
        <div className="chat-list">
          <ul>
            {chatInfo}
          </ul>
        </div>
      </div>
    );
  }
  componentDidMount () {
    // 初始化数据
    axios.post('chats/list')
      .then(res=>{
        this.setState({
          list: res.data.list
        });
      })
  }
}

export default withRouter(Home);