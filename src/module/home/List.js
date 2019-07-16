import React from 'react';
import { Icon, Item } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: '',
      list: []
    }
  }
  
  goBack = () => {
    // 控制页面的回退
    let { history } = this.props;
    history.goBack();
  }

  render() {
    let listInfo = this.state.list.map(item=>{
      return (
        <Item key={item.id}>
          <Item.Image src={'http://47.96.21.88:8086/public/home.png'}/>
          <Item.Content>
            <Item.Header>{item.home_name}</Item.Header>
            <Item.Meta>
              <span className='cinema'>{item.home_desc}</span>
            </Item.Meta>
            <Item.Description>
              {item.home_tags}
            </Item.Description>
            <Item.Description>{item.home_price}</Item.Description>
          </Item.Content>
        </Item>
      );
    });
    return (
      <div className="house-list">
        <div className="house-list-title">
          <Icon onClick={this.goBack} name='angle left' size='large'/>
          {this.state.name}
        </div>
        <div className="house-list-content">
          {/*房源列表*/}
          <Item.Group divided unstackable>
            {listInfo}
          </Item.Group>
        </div>
      </div>
    );
  }
  componentDidMount() {
    // 获取路由参数
    // console.log(this.props)
    this.setState({
      name: this.props.location.state.mname,
      type: this.props.location.state.type,
    }, () => {
      // 调用后台接口，获取房源列表数据
      axios.post('/homes/list', {
        home_type: this.state.type
      }).then(res=>{
        // 更新状态数据
        this.setState({
          list: res.data
        });
      })
    });
  }
}

export default withRouter(List);