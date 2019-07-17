import React from 'react';
import axios from 'axios'; 
import Tloader from 'react-touch-loader';
import { Item, Icon, Button, Modal, TextArea } from 'semantic-ui-react';
import './LoadMore.css';

class FaqWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: ''
    }
  }
  handleInfo = (e) => {
    this.setState({
      info: e.target.value
    });
  }
  submitHandle = () => {
    // 控制表单提交
    axios.post('infos/question', {
      question: this.state.info
    }).then(res=>{
      if(res.meta.status === 200) {
        // 添加成功,隐藏窗口
        this.props.close();
      } else {
        // 服务器发生错误
        alert('服务器发生错误，请于管理员联系');
      }
    })
  }
  render() {
    return (
      <div>
        <Modal size='small' onClose={this.props.close} open={this.props.open}>
          <Modal.Header>发表评论</Modal.Header>
          <Modal.Content>
            <TextArea value={this.state.info} onChange={this.handleInfo} style={{width:'100%'}} placeholder='Tell us more' />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.props.close} negative>取消</Button>
            <Button positive onClick={this.submitHandle} icon='checkmark' labelPosition='right' content='发表' />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

class CommonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }
  showWindow = () => {
    // 显示弹窗
    this.setState({
      isOpen: true
    });
  }
  hideWindow = () => {
    // 隐藏弹窗
    this.setState({
      isOpen: false
    });
  }
  render() {
    let { type, list } = this.props;
    // 资讯列表和头条列表模板类似 type == 1 || type == 2
    let listTpl = null;
    if(type === 1 || type === 2) {
      // 资讯列表或者头条列表模板
      let listInfo = list.map(item=>{
        return (
          <Item key={item.id}>
            <Item.Image size='small' src='http://47.96.21.88:8086/public/1.png' />
            <Item.Content verticalAlign='middle'>
              <Item.Header className='info-title'>{item.info_title}</Item.Header>
              <Item.Meta>
                <span className='price'>$1200</span>
                <span className='stay'>1 Month</span>
              </Item.Meta>
            </Item.Content>
          </Item>
        );
      }); 
      listTpl = (
        <Item.Group unstackable>
          {listInfo}
        </Item.Group>
      );
    } else if(type === 3) {
      // 问答列表
      let faqInfo = list.map(item=>{
        return (
          <li key={item.id}>
            <div className='title'>
              <span className='cate'>
                <Icon color='green' name='users' size='small' />
                思维
              </span>
              <span>
                {item.question_name}
              </span>
            </div>
            {item.answer_content&&(
              <div className='user'>
                <Icon circular name='users' size='mini'/>
                {item.username} 的回答
              </div>
            )}
            <div className="info">
              {item.answer_content}
            </div>
            <div className="tag">
              {item.question_tag&&item.question_tag.split(',').map((tag,index)=>{return <span key={index}>{tag}X</span>})}
              <span>{item.qnum?item.qnum:0}个回答</span>
            </div>
          </li>
        );
      });
      listTpl = (
        <div>
          {/*弹窗效果*/}
          <FaqWindow close={this.hideWindow} open={this.state.isOpen}/>
          <div className="info-ask-btn">
            <Button onClick={this.showWindow} fluid color='green'>快速提问</Button>
          </div>
          <div className="info-ask-list">
            {faqInfo}
          </div>
        </div>
      );
    }
    return listTpl;
  }
}

class LoadMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表数据
      list: [],
      // 列表总数
      total: 0,
      // 当前记录数
      pagenum: 0,
      // 每页加载条数
      pagesize: 2,
      // 控制是否还有更多数据
      hasMore: true,
      // 进度条状态
      initializing: 1
    }
  }

  loadData = () => {
    // 列表类型：1表示资讯；2表示头条；3表示问答
    let { type } = this.props;
    // 封装通用的接口调用方法
    axios.post('infos/list', {
      type: type,
      pagenum: this.state.pagenum,
      pagesize: this.state.pagesize
    }).then(res=>{
      let result = null;
      if(this.state.pagenum === 0) {
        // 第一次加载列表数据
        result = res.data.list.data;
      } else {
        // 再次加载数据时，将新加载的数据添加到原有的数据中
        result = [...this.state.list, ...res.data.list.data];
      }
      this.setState({
        list: result,
        total: res.data.list.total,
        // 统一判断是否还有更多数据
        hasMore: this.state.pagenum + this.state.pagesize < res.data.list.total?true: false,
        // 进度条结束
        initializing: 2
      });
    })
  }

  componentDidMount() {
    // 初始化数据
    this.loadData();
  }

  refresh = (resolve, reject) => {
    // 处理刷新:重新加载相应数据
    this.setState({
      pagenum: 0,
      // 1表示进度条开始
      initializing: 1
    }, () => {
      // 从新加载第一页数据
      this.loadData();
    });
    resolve();
  }

  loadMore = (resolve, reject) => {
    // 处理加载更多：修改当前的记录数(当前记录数 + 每页条数)
    let { pagenum, pagesize } = this.state;
    
    // 列表已经全部加载完成
    // if(pagenum + pagesize >= total && total !== 0) {
    //   // 没有更多数据了，终止接口继续调用
    //   this.setState({
    //     hasMore: false
    //   });
    //   resolve();
    //   return ;
    // }

    this.setState({
      // 加载下一页数据
      pagenum: pagenum + pagesize
    }, () => {
      // 重新加载列表数据
      this.loadData();
      // 这里判断可以保证没有数据时，加载更多的按钮消失
      // this.setState({
      //   hasMore: this.state.pagenum + pagesize - total<0?true: false
      // });
    });
    
    resolve();
  }

  render() {
    let { hasMore, list, initializing } = this.state;
    let { type } = this.props;
    return (
      <div className='view'>
        <Tloader
          className="main"
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
          hasMore={hasMore}
          autoLoadMore={false}
          initializing={initializing}
          >
          {/*里面就是列表信息*/}
          <ul>
            <CommonList type={type} list={list}/>
          </ul>
        </Tloader>
      </div>
    );
  }
}

export default LoadMore;