import React from 'react';
import './Index.css';
import { Tab } from 'semantic-ui-react';
import LoadMore from './LoadMore.js';

class Msg extends React.Component {
  render() {
    return <LoadMore type={1}/>
  }
}
class Top extends React.Component {
  render() {
    return <LoadMore type={2}/>
  }
}
class Faq extends React.Component {
  render() {
    return <LoadMore type={3}/>
  }
}
class Home extends React.Component {
  render() {
    const panes = [
      { menuItem: '资讯', render: () => <Tab.Pane><Msg/></Tab.Pane>},
      { menuItem: '头条', render: () => <Tab.Pane><Top/></Tab.Pane>},
      { menuItem: '问答', render: () => <Tab.Pane><Faq/></Tab.Pane>}
    ];
    return (
      <div className="find-container">
        <div className="find-topbar">资讯</div>
        <div className="find-content">
          <div>
            <Tab panes={panes}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

