import React, { Component } from 'react';
import { Tag, Table, List, Button, Input } from 'antd';
import { Map, Marker } from 'react-amap';
import HoverPlane from './hoverPlane';
import DetailPlane from './detailPlane';
import styles from './index.less';

class StationMap extends Component {
  state = {
    maxFlow: 999,
    rangeFlow: [0, 999],
    dateRange: { startTime: undefined, endTime: undefined, },
    historyData: [
      { x:'2019-06-01', y: 2 },
      { x:'2019-06-02', y: 1 },
      { x:'2019-06-03', y: 6 },
      { x:'2019-06-04', y: 5 },
      { x:'2019-06-05', y: 4 },
      { x:'2019-06-06', y: 3 },
      { x:'2019-06-07', y: 7 },
      { x:'2019-06-08', y: 2 },
      { x:'2019-06-09', y: 8 },
      { x:'2019-06-10', y: 5 },
      { x:'2019-06-11', y: 1 },
      { x:'2019-06-12', y: 2 },
    ],
	mapCenter: undefined,
  };

  constructor(props) {
    super(props);
    // 未将地图中心定位到某个位置
        
    this.markerEvents = {
      mouseover: e => {
        const marker = e.target;
        // Move to top while mouseover
        marker.setzIndex(101);
        const offset = { x: -114, y: -332 };
        marker.setOffset(offset);
        marker.render(this.renderMarkerHover);
      },
      mouseout: e => {
        const marker = e.target;
        // Move to default while mouseover
        marker.setzIndex(100);
        const offset = { x: -55, y: -37 };
        marker.setOffset(offset);
        marker.render(this.renderMarker);
      },
    };
  }

  initializeMarker() {
    const { stationsData } = this.props;
    const { rangeFlow } = this.state;
    if (stationsData !== undefined && stationsData.total !== undefined) {
      const res = [];
      const zIndex = 100;
      const offset = { x: -55, y: -37 };
      for (let i = 0; i < stationsData.stations.length; i += 1) {
        if (stationsData.stations[i].metadata.currLevel < rangeFlow[0]) continue;
        if (stationsData.stations[i].metadata.currLevel > rangeFlow[1]) continue;
        res.push(
          <Marker
            key={stationsData.stations[i].key}
            position={stationsData.stations[i].metadata.position}
            render={this.renderMarker}
            events={this.markerEvents}
            extData={stationsData.stations[i]}
            offset={offset}
            zIndex={zIndex}
          />
        );
      }
      return res;
    }
    return null;
  }

  renderMarker(extData) {
    const { currLevel, rateLevel, maxLevel } = extData.metadata;
    const flowrate = (currLevel / maxLevel) * 100;
    const rateflowrate = (rateLevel / maxLevel) * 100;
    let background;
    let color;
    if (flowrate <= rateflowrate) {
      background = 'green';
      color = 'white';
    } else if (flowrate <= 100) {
      background = 'yellow';
      color = 'black';
    } else {
      background = 'red';
      color = 'white';
    }
    const Style = {
      color: color,
      background: background,
    };
    return (
      <>
        <div className={styles.small} style={Style}>
          {extData.name}
        </div>
        <div className={styles.under} />
      </>
    );
  }

  renderMarkerHover(extData) {
    const { currLevel, rateLevel, maxLevel, pumps } = extData.metadata;
    const pumpTable = [];
    for (let i = 0; i < pumps.length; i += 1) {
      pumpTable.push(
        '泵' +
          pumps[i].name +
          ' 功率' +
          pumps[i].power +
          ' 扬程' +
          pumps[i].lift +
          ' 流量' +
          pumps[i].flow,
      );
    }
    return (
      <>
        <div className={styles.large}>
          {extData.name}
          <div>
            <Tag color="magenta">瞬时：{currLevel.toString()}</Tag>
            <Tag color="blue">额定：{rateLevel.toString()}</Tag>
            <Tag color="red">最大：{maxLevel.toString()}</Tag>
          </div>
          <List
            size="small"
            header={<div>Pumps</div>}
            bordered
            dataSource={pumpTable}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
          <Button type="link">详细</Button>
        </div>
        <div className={styles.under} />
      </>
    );
  }

  rangeFlowChange = value => {
    this.setState({
      rangeFlow: value,
    });
  };
  mixFlowChange = value => {
    const { rangeFlow } = this.state;
    this.setState({
      rangeFlow: [value, rangeFlow[1]],
    });
  };
  maxFlowChange = value => {
    const { rangeFlow } = this.state;
    this.setState({
      rangeFlow: [rangeFlow[0], value],
    });
  };
  tabChange = key => {
    const { maxFlow } = this.state;
    if (key !== 1) {
      this.setState({
        rangeFlow: [0, maxFlow],
      });
    }
  };
  rangePickerChange = (data, dateString) =>{
    const { dateRange } = this.state;
    this.setState({
      dateRange: { startTime: dateString[0], endTime: dateString[1], },
    });
  };
  returnLocation = (poi) =>{
	this.setState({
      mapCenter: poi.location,
    });
  }

  render() {
    const { mapCenter, rangeFlow, maxFlow, dateRange, historyData } = this.state;
    return (
      <Map plugins={['ToolBar']} center={mapCenter}>
        <HoverPlane
          tabChange={this.tabChange}
          rangeFlowChange={this.rangeFlowChange}
          mixFlowChange={this.mixFlowChange}
          maxFlowChange={this.maxFlowChange}
		  returnLocation = {this.returnLocation}
          rangeFlow={rangeFlow}
          maxFlow={maxFlow}
          />

        <DetailPlane 
          loading={false}
          dateRange={dateRange}
          rangePickerChange={this.rangePickerChange}
          historyData={historyData}
          />

        {this.initializeMarker()}
      </Map>
    );
  }
}

export default StationMap;
