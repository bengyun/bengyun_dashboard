import React, { Component } from 'react';
import { Map, Marker } from 'react-amap';
import { Tag, Table, List, Button, Slider, Row, Col, InputNumber, Tabs } from 'antd';
import styles from './index.less';

class MapView extends Component {
  state = {
    maxFlow: 999,
    rangeFlow: [0, 999],
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
    const { mapData } = this.props;
    const { rangeFlow } = this.state;
    if (mapData !== undefined && mapData.total !== undefined) {
      const res = [];
      const zIndex = 100;
      const offset = { x: -55, y: -37 };
      console.log(rangeFlow);
      for (let i = 0; i < mapData.things.length; i += 1) {
        if (mapData.things[i].metadata.currFlowspeed < rangeFlow[0]) continue;
        if (mapData.things[i].metadata.currFlowspeed > rangeFlow[1]) continue;
        res.push(
          <Marker
            key={mapData.things[i].key}
            position={mapData.things[i].metadata.position}
            render={this.renderMarker}
            events={this.markerEvents}
            extData={mapData.things[i]}
            offset={offset}
            zIndex={zIndex}
          />,
        );
      }
      return res;
    }
    return null;
  }

  renderMarker(extData) {
    const { currFlowspeed, rateFlowspeed, maxFlowspeed } = extData.metadata;
    const flowrate = (currFlowspeed / maxFlowspeed) * 100;
    const rateflowrate = (rateFlowspeed / maxFlowspeed) * 100;
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
    const { currFlowspeed, rateFlowspeed, maxFlowspeed, pumps } = extData.metadata;
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
            <Tag color="magenta">瞬时：{currFlowspeed.toString()}</Tag>
            <Tag color="blue">额定：{rateFlowspeed.toString()}</Tag>
            <Tag color="red">最大：{maxFlowspeed.toString()}</Tag>
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
  initializeHover() {
    const { TabPane } = Tabs;
    const { rangeFlow, maxFlow } = this.state;
    return (
      <Tabs defaultActiveKey="1" onChange={this.tabChange} className={styles.hover}>
        <TabPane tab="流量" key="1">
          <Row>
            <Col span={24}>
              <Slider range value={rangeFlow} max={maxFlow} onChange={this.rangeFlowChange} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <InputNumber
                min={0}
                max={maxFlow}
                value={rangeFlow[0]}
                onChange={this.mixFlowChange}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={maxFlow}
                value={rangeFlow[1]}
                onChange={this.maxFlowChange}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="位置" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    );
  }

  render() {
    return (
      <Map plugins={['ToolBar']} center={this.mapCenter}>
        {this.initializeMarker()}
        {this.initializeHover()}
      </Map>
    );
  }
}

export default MapView;
