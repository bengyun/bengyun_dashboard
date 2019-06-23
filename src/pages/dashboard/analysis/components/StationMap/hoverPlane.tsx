import React, { Component } from 'react';
import { Slider, Row, Col, InputNumber, Tabs } from 'antd';
import styles from './index.less';

class HoverPlane extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { TabPane } = Tabs;
	const { tabChange, rangeFlowChange, mixFlowChange, maxFlowChange } = this.props;
    const { rangeFlow, maxFlow } = this.props;
    return (
      <Tabs defaultActiveKey="1" onChange={tabChange} className={styles.hover}>
        <TabPane tab="液位" key="1">
          <Row>
            <Col span={24}>
              <Slider range value={rangeFlow} max={maxFlow} onChange={rangeFlowChange} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <InputNumber
                min={0}
                max={maxFlow}
                value={rangeFlow[0]}
                onChange={mixFlowChange}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                min={0}
                max={maxFlow}
                value={rangeFlow[1]}
                onChange={maxFlowChange}
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
}

export default HoverPlane;
