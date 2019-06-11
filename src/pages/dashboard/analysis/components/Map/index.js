import React, { Component } from 'react';
import { Map, Markers } from 'react-amap';
import styles from './index.less';
import { Popover, Button } from 'antd';

const markers = [
  {
    name: '郎家坪泵站',
    address: '浙江省宁波市镇海区环湖西路168号',
    pumps: ['无数据'],
    position: {
      longitude: 121.512097,
      latitude: 30.049444,
    },
  },
  {
    name: '河横路牌楼泵站',
    address: '浙江省宁波市镇海区王岙巷2',
    pumps: ['1#泵', '2#泵'],

    position: {
      longitude: 121.553233,
      latitude: 30.031005,
    },
  },
  {
    name: '田顾西泵站',
    address: '浙江省宁波市镇海区西河路1号',
    pumps: ['1#泵 350QZB-70 功率：18.5KW 扬程：5m', '2#泵：350QZB-70 功率：18.5KW 扬程：5m'],
    position: {
      longitude: 121.546947,
      latitude: 30.005627,
    },
  },
  {
    name: '西河泵站',
    address: '浙江省宁波市镇海区九龙大道2208号',
    pumps: [
      '1#泵：100WQ130-15-11 功率：11KW 扬程：15m 流量：130m3/h',
      '2#泵：100WQ130-15-11 功率：11KW 扬程：15m 流量：130m3/h',
      '3#泵：100WQ130-15-11 功率：11KW 扬程：15m 流量：130m3/h',
    ],
    position: {
      longitude: 121.555785,
      latitude: 30.022581,
    },
  },
  {
    name: '三星泵站',
    address: '浙江省宁波市镇海区荣吉路836',
    pumps: [
      '1#泵：150JYWQ150-10-7.5 功率：7.5KW 扬程：11m 流量：130m3/h',
      '2#泵：150JYWQ150-10-7.5 功率：7.5KW 扬程：11m 流量：130m3/h',
      '3#泵：150JYWQ150-10-7.5 功率：7.5KW 扬程：11m 流量：130m3/h',
    ],
    position: {
      longitude: 121.568672,
      latitude: 29.972112,
    },
  },
];

class MapView extends Component {
  constructor(props) {
    super(props);
    var _this = this;
    // 随机生成 10 个标记点的原始数据
    this.mapCenter = markers[0].position;
    console.log(props);
    this.markersEvents = {
      click(e, marker) {
        // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData();
        const index = extData.name;
        //alert(`点击的是第${index}号坐标点`);
      },
    };
  }

  renderMarkerFn = extData => {
    const markerStyle = {
      background: '#fff',
      padding: '2px',
      backgroundColor: '#000',
      color: '#fff',
      border: '1px solid #fff',
    };
    const title = <Button onClick={() => this.props.showPage(1)}>{extData.name} 查看详情</Button>;
    const content = extData.pumps.map((item, key) => <li key={item.id}>{item}</li>);
    return (
      <Popover title={title} content={content} trigger="hover">
        <Button style={markerStyle}>{extData.name}</Button>
      </Popover>
    );
  };

  render() {
    return (
      <Map plugins={['ToolBar']} center={this.mapCenter} zoom={12}>
        <Markers
          render={this.renderMarkerFn}
          markers={markers}
          events={this.markersEvents}
          useCluster={false}
        />
      </Map>
    );
  }
}

export default MapView;
