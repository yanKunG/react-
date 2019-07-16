/*
  主页整体布局
*/
import React from 'react';
import './Main.css';
import { Grid, Icon } from 'semantic-ui-react'; 
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import Home from './home/Index.js';
import Info from './info/Index.js';
import Chat from './chat/Index.js';
import My from './my/Index.js';
import List from './home/List.js';
import Calc from './home/Calc.js';
import Map from './home/Map.js';
import ChatWindow from './chat/ChatWindow.js';

// 封装菜单组件
class Menu extends React.Component {
  render() {
    let { menuPath, menuName, menuIcon } = this.props;
    return (
      <Grid.Column>
        {/*children函数的渲染结果就是Link标签*/}
        <Route path={menuPath} children={ (param) => {
          // 无论请求路由和path是否匹配，都会触发children对应的函数
          // 如果匹配，那么param.match就会有值
          // 如果不匹配，那么param.match就是null
          let active = param.match?'active': '';
          return (
            <Link to={menuPath}>
              <div className={'menu ' + active}>
                <Icon name={menuIcon}/>
                <div>{menuName}</div>
              </div>
            </Link>
          );
        }}/>
      </Grid.Column>
    );
  }
}

class Main extends React.Component {
  render() {
    return (
      <div className="main-container">
        <div className="main-content">
          {/*内容区域*/}
          <Switch>
            <Route path='/home/index' component={Home}/>
            <Route path='/home/info' component={Info}/>
            <Route path='/home/chat' component={Chat}/>
            <Route path='/home/my' component={My}/>
            <Route path='/home/list' component={List}/>
            <Route path='/home/calc' component={Calc}/>
            <Route path='/home/map' component={Map}/>
            <Route path='/home/cwin' component={ChatWindow}/>
            <Redirect from='/home' to='/home/index'/>
          </Switch>
        </div>
        <div className="main-menu">
          {/*菜单区域*/}
          <Grid>
            <Grid.Row columns={4}>
              <Menu menuPath='/home/index' menuName='主页' menuIcon='home'/>
              <Menu menuPath='/home/info' menuName='资讯' menuIcon='home'/>
              <Menu menuPath='/home/chat' menuName='微聊' menuIcon='home'/>
              <Menu menuPath='/home/my' menuName='我的' menuIcon='home'/>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Main;
