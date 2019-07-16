import React from 'react';
import { Icon, Tab, Grid, Input, Dropdown,Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
// import axios from 'axios';
import ReactEcharts from 'echarts-for-react';

class First extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      total: 0,
      year: 0,
      rate: 0,
      chartData: [
        {value:335, name:'总利息'},
        {value:810, name:'房间总额'}
      ]
    }
  }
  handleTotal = (e) => {
    this.setState({
      total: e.target.value
    });
  }
  // 与传统表单绑定不相同
  handleType = (e, {value}) => {
    // 处理下拉选项的数据绑定
    this.setState({
      type: value
    });
  }
  handleRate = (e, {value}) => {
    // 处理下拉选项的数据绑定
    this.setState({
      rate: value
    });
  }
  handleYear = (e, {value}) => {
    // 处理下拉选项的数据绑定
    this.setState({
      year: value
    });
  }
  handleCalc = () => {
    // console.log(this.state.total)
    // console.log(this.state.type)
    // console.log(this.state.year)
    // console.log(this.state.rate)
    // 根据表单的数据影响图表展示效果的变化
    this.setState({
      chartData: [{
        value: this.state.chartData[0].value + parseInt(this.state.total),
        name:'总利息'
      }, {
        value: 810,
        name:'房间总额'
      }]
    }, () => {
      // this.getOption();
      // 获取组件中echarts的实例对象
      // let echart = this.reactEchart.getEchartsInstance();
      // 调用echarts的setOption方法进行图表更新
      // echart.setOption(this.getOption());
    });
  }
  getOption = () => {
    // echarts的option配置信息
    // let data = [
    //   {value:335, name:'总利息'},
    //   {value:810, name:'房间总额'},
    // ];
    // console.log(data)
    // data[0].value = this.state.chartData[0].value;
    // data[1].value = this.state.chartData[1].value;
    return  {
      title : {
        text: '贷款利息比例',
        subtext: '纯属虚构',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a}"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['总利息','房间总额']
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data: this.state.chartData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }
  render() {
    // 贷款方式
    const options = [
      { key: '1', text: '按房间总额', value: '1' },
      { key: '2', text: '按贷款总额', value: '2' }
    ]
    // 贷款年限
    let generateYears = (n) => {
      let years = [];
      for(let i=1;i<=n;i++) {
        let year = {
          key: i,
          text: i,
          value: i
        };
        years.push(year);
      }
      return years;
    }
    // 贷款利率
    let rates = [
      {key: 1,text: '基准利率(3.25%)',value: 1},
      {key: 2,text: '基准利率9.5折',value: 2},
      {key: 3,text: '基准利率9折',value: 3},
      {key: 4,text: '基准利率8.5折',value: 4}
    ];
    return (
      <Grid column={2}>
        <Grid.Row>
          <Grid.Column width={6}>
            贷款方式
          </Grid.Column>
          <Grid.Column width={10}>
            <Dropdown value={this.state.type} onChange={this.handleType} selection options={options}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            贷款总额
          </Grid.Column>
          <Grid.Column width={10}>
            <Input value={this.state.total} onChange={this.handleTotal} placeholder='贷款总额...'/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            贷款年限
          </Grid.Column>
          <Grid.Column width={10}>
            <Dropdown value={this.state.year} onChange={this.handleYear} selection options={generateYears(25)}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            贷款利率
          </Grid.Column>
          <Grid.Column width={10}>
            <Dropdown value={this.state.rate} onChange={this.handleRate} selection options={rates}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Button onClick={this.handleCalc} fluid primary>计算</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <ReactEcharts ref={(e) => { this.reactEchart = e;}} option={this.getOption()}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class Calc extends React.Component {
  handle = () => {
    // 页面回退
    this.props.history.goBack();
  }

  render() {
    let paneData = [
      {menuItem:'公积金贷款', render: () => <Tab.Pane><First/></Tab.Pane>},
      {menuItem:'商业贷款', render: () => <Tab.Pane>商业贷款</Tab.Pane>},
      {menuItem:'组合贷款', render: () => <Tab.Pane>组合贷款</Tab.Pane>}
    ];
    return (
      <div className="home-calc">
        <div className="home-calc-title">
          <Icon onClick={this.handle} name = 'angle left' size = 'large'/>贷款利率计算 
        </div>
        <div className="map-calc-content">
          {/*选项卡布局*/}
          <Tab panes={paneData}/>
        </div>
      </div>
    );
  }
}

export default withRouter(Calc);