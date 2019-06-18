import React, { Component } from 'react';
import { Map, Marker } from 'react-amap';
import { Progress } from 'antd';
// import styles from './index.less';

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
    // 将地图中心定位到第一个泵站的位置
    this.mapCenter = markers[0].position;

    this.markerEvents = {
      mouseover: e => {
        const marker = e.target;
        // Move to top while mouseover
        marker.setzIndex(101);
        const offset = { x: -120, y: -112 };
        marker.setOffset(offset);
        marker.render(MapView.renderMarkerHover);
      },
      mouseout: e => {
        const marker = e.target;
        // Move to default while mouseover
        marker.setzIndex(100);
        const offset = { x: -75, y: -62 };
        marker.setOffset(offset);
        marker.render(MapView.renderMarker);
      },
    };
  }

  initializeMarker() {
    const { mapData } = this.props;
    if (mapData !== undefined && mapData.total !== undefined) {
      const res = [];
      for (let i = 0; i < mapData.things.length; i += 1) {
        const zIndex = 100;
        const offset = { x: -75, y: -62 };
        res.push(
          <Marker
            position={mapData.things[i].metadata.position}
            render={MapView.renderMarker}
            events={this.markerEvents}
            extData={mapData.things[i]}
            offset={offset}
            zIndex={zIndex}
          />,
        );
      }
      this.mapMarkers = res;
      return res;
    }
    return null;
  }

  static renderMarker(extData) {
    const { currFlowspeed, rateFlowspeed, maxFlowspeed } = extData.metadata;
    const flowrate = (currFlowspeed / maxFlowspeed) * 100;
    const rateflowrate = (rateFlowspeed / maxFlowspeed) * 100;
    let color;
    if (flowrate <= rateflowrate) {
      color = 'green';
    } else if (flowrate <= 100) {
      color = 'yellow';
    } else {
      color = 'red';
    }
    const Style = {
      width: '150px',
      height: '50px',
      position: 'relative',
      color: 'green',
      background: '#fff',
      border: '1px solid #088cb7',
      borderRadius: '5px',
    };
    const Before = {
      position: 'absolute',
      content: '',
      width: '0',
      height: '0',
      top: '100%',
      left: '45%',
      borderTop: '12px solid #088cb7',
      borderRight: '6px solid transparent',
      borderLeft: '6px solid transparent',
      borderBottom: '6px solid transparent',
    };
    return (
      <div>
        <div style={Style}>
          {extData.name}
          <Progress percent={flowrate} strokeColor={color} showInfo={false} />
        </div>
        <div style={Before} />
      </div>
    );
  }

  static renderMarkerHover(extData) {
    const Style = {
      width: '250px',
      height: '100px',
      position: 'relative',
      color: 'green',
      background: '#fff',
      border: '1px solid #088cb7',
      borderRadius: '5px',
      zIndex: '9999',
    };
    const Before = {
      position: 'absolute',
      content: '',
      width: '0',
      height: '0',
      top: '100%',
      left: '45%',
      borderTop: '12px solid #088cb7',
      borderRight: '6px solid transparent',
      borderLeft: '6px solid transparent',
      borderBottom: '6px solid transparent',
    };
    return (
      <div>
        <div style={Style}>{extData.name}</div>
        <div style={Before} />
      </div>
    );
  }

  /*
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
  */

  render() {
    const mapMarkers = this.initializeMarker();
    return (
      <Map plugins={['ToolBar']} center={this.mapCenter} zoom={12}>
        {mapMarkers}
      </Map>
    );
  }
}

export default MapView;
