/*
  地图找房
*/
import React from 'react';
import { Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xy: [{
        'x': 116.43244,
        'y': 39.929986
      }, {
        'x': 116.424355,
        'y': 39.92982
      }, {
        'x': 116.423349,
        'y': 39.935214
      }, {
        'x': 116.350444,
        'y': 39.931645
      }, {
        'x': 116.351684,
        'y': 39.91867
      }, {
        'x': 116.353983,
        'y': 39.913855
      }, {
        'x': 116.357253,
        'y': 39.923152
      }, {
        'x': 116.349168,
        'y': 39.923152
      }, {
        'x': 116.354954,
        'y': 39.935767
      }, {
        'x': 116.36232,
        'y': 39.938339
      }, {
        'x': 116.374249,
        'y': 39.94625
      }, {
        'x': 116.380178,
        'y': 39.953053
      }]
    }
  }
  goBack = () => {
    // 通过路由控制回退
    this.props.history.goBack();
  }
  render() {
    return (
      <div className="map-house">
        <div className="map-house-title">
          <Icon onClick={this.goBack} name='angle left' size='large'/>地图找房
        </div>
        <div className="map-house-content" id='allmap'>
          {/*这个位置应该显示地图*/}
        </div>
      </div>
    );
  }
  componentDidMount() {
    // 百度地图API功能
    // 创建Map实例
    let BMap = window.BMap;
    let map = new BMap.Map("allmap");    
    // 初始化地图,设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  
    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
      mapTypes:[
        window.BMAP_NORMAL_MAP,
        window.BMAP_HYBRID_MAP
      ]
    }));   
    map.setCurrentCity("北京");         
    // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);
    // 处理聚合点的坐标
    let markers = [];
    let mdata = this.state.xy;
    mdata.forEach(dot=>{
      let point = new BMap.Point(dot.x, dot.y);
      let marker = new BMap.Marker(point);
      markers.push(marker);
    });
    // 实例化聚合对象
    // new window.BMapLib.MarkerClusterer(map, {markers:markers});
    new window.BMapLib.MarkerClusterer(map, {
      markers: markers,
      girdSize: 100,
      // 定制聚合图标的效果
      styles: [{
        background: 'rgba(12,181,106,0.9)',
        size: new BMap.Size(92, 92),
        textSize: '16',
        textColor: '#fff',
        borderRadius: 'true'
      }],
    });
  }
}

export default withRouter(Map);