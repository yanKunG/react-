import React from "react";
import "./Index.css";
import { Input, Grid, Icon, Item, Button,Dimmer, Loader } from "semantic-ui-react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import axios from "axios";
import { withRouter } from 'react-router-dom'; 
// 菜单布局
let Menus = function(props) {
  let menuList = props.data.map(item => {
    return (
      <Grid.Column onClick={props.handleMenu.bind(this, item.menu_name,item.id)} key={item.id}>
        <div className="home-menu-item">
          <Icon name="home" size="big" />
        </div>
        <div>{item.menu_name}</div>
      </Grid.Column>
    );
  });
  return (
    <div className="home-menu">
      <Grid columns={4} divided>
        <Grid.Row>{menuList}</Grid.Row>
      </Grid>
    </div>
  );
};
// 资讯的模板
let Info = function(props) {
  let info = props.data.map(item => {
    return (
      <Item.Header key={item.id}>
        <span>限购 ●</span>
        <span>{item.info_title}</span>
      </Item.Header>
    );
  });
  return (
    <div className="home-msg">
      <Item.Group unstackable>
        <Item className="home-msg-img">
          <Item.Image
            size="tiny"
            src={"http://47.96.21.88:8086/public/zixun.png"}
          />
          <Item.Content verticalAlign="top">
            {info}
            <div className="home-msg-more">
              <Icon name="angle right" size="big" />
            </div>
          </Item.Content>
        </Item>
      </Item.Group>
    </div>
  );
};
// 问答模板
let Faq = function(props) {
  let faq = props.data.map(item => {
    let tags = item.question_tag.split(",").map((tag, index) => {
      return (
        <Button key={index} basic color="green" size="mini">
          {tag}
        </Button>
      );
    });
    return (
      <li key={item.question_id}>
        <div>
          <Icon name="question circle outline" />
          <span>{item.question_name}</span>
        </div>
        <div>
          {tags}
          <div>
            {item.atime} ● <Icon name="comment alternate outline" /> {item.qnum}
          </div>
        </div>
      </li>
    );
  });
  return (
    <div className="home-ask">
      <div className="home-ask-title">好客问答</div>
      <ul>{faq}</ul>
    </div>
  );
};
// 房源列表
let House = function(props) {
  let house = ["最新开盘", "二手精选", "组一个家"];
  let houseData = [[], [], []];
  props.data.forEach(i => {
    if (i.home_type === 1) {
      // 最新开盘
      houseData[0].push(i);
    } else if (i.home_type === 2) {
      // 二手精选
      houseData[1].push(i);
    } else {
      // 租一个家
      houseData[2].push(i);
    }
  });
  let houseList = house.map((item, index) => {
    let list = houseData[index].map(house => {
      let tags = house.home_tags.split(",").map((tag, index) => {
        return (
          <Button key={index} color="green" size="mini">
            {tag}
          </Button>
        );
      });
      return (
        <Item key={house.id}>
          <Item.Image src={"http://47.96.21.88:8086/public/home.png"} />
          <Item.Content>
            <Item.Header>{house.home_name}</Item.Header>
            <Item.Meta>
              <span className="cinema">{house.home_desc}</span>
            </Item.Meta>
            <Item.Description>{tags}</Item.Description>
            <Item.Description>{house.home_price}</Item.Description>
          </Item.Content>
        </Item>
      );
    });
    return (
      <div key={index}>
        <div className="home-hire-title">{item}</div>
        <Item.Group divided unstackable>
          {/*房源列表*/}
          {list}
        </Item.Group>
      </div>
    );
  });
  return <div>{houseList}</div>;
};
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swiper: [],
      menu: [],
      info: [],
      faq: [],
      house: [],
      isLoading: true
    };
  }
  handleMenu = (name, type) => {
    // 处理主页菜单的点击行为
    // 处理页面跳转:编程式导航
    let { history } = this.props;
    if(name==='二手房' || name === '新房' || name === '租房' || name === '海外') {
      history.push('/home/list', {mname: name, type: type });
    } else if(name === '计算器') {
      // 利率计算器页面
      history.push('/home/calc');
    } else if(name === '地图找房') {
      history.push('/home/map');
    }
  }
  render() {
    return (
      <div className="home-container">
        <div className="home-topbar">
          {/*搜索条*/}
          <Input fluid icon="search" placeholder="请输入关键字..." />
        </div>
        {/*背景遮罩效果*/}
        <Dimmer inverted active={this.state.isLoading}>
          <Loader>Loading...</Loader>
        </Dimmer>
        <div className="home-content">
          {/*轮播图*/}
          <ImageGallery
            showThumbnails={false}
            showNav={false}
            autoPlay={false}
            items={this.state.swiper}
          />
          {/*菜单布局*/}
          <Menus data={this.state.menu} handleMenu={this.handleMenu}/>
          {/*资讯布局*/}
          <Info data={this.state.info} />
          {/*问答布局*/}
          <Faq data={this.state.faq} />
          {/*房源列表*/}
          <House data={this.state.house} />
        </div>
      </div>
    );
  }
  queryData = path => {
    return axios.post(path).then(res => {
      //promise返回值是一个数据，那么这个数据被下一个then方法拿到
      return res.data.list;
    });
  };
  componentDidMount() {
    let swipe = this.queryData("homes/swipe");
    let menu = this.queryData("homes/menu");
    let info = this.queryData("homes/info");
    let faq = this.queryData("homes/faq");
    let house = this.queryData("homes/house");
    Promise.all([swipe, menu, info, faq, house]).then(ret => {
      this.setState({
        swiper: ret[0],
        menu: ret[1],
        info: ret[2],
        faq: ret[3],
        house: ret[4],
        isLoading: false
      });
    });
  }
}

export default withRouter(Home);
