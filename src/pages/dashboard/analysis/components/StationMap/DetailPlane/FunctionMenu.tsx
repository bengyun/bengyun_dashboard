import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import styles from './index.less';
import { IAnalysisData } from '@/pages/dashboard/analysis/data';
import { connect } from 'dva';

interface FunctionMenuProps {
  dashboardAnalysis?: IAnalysisData;
  onMenuClick?: Function /* 点击菜单事件 */;
}

interface FunctionMenuState {}

@connect(
  ({
     dashboardAnalysis,
   }: {
    dashboardAnalysis: IAnalysisData;
  }) => ({
    dashboardAnalysis,
  }),
)
class FunctionMenu extends Component<FunctionMenuProps, FunctionMenuState> {
  state: FunctionMenuState = {};

  constructor(props: FunctionMenuProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  render() {
    const {
      onMenuClick = () => {},
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined },
    } = this.props;
    const {
      stationsData = { total: 0, offset: 0, limit: 0, things: [] },
    } = dashboardAnalysis;
    /* Equipment State */
    let workingEquipment: number = 0;
    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000;
    for (let idx: number = 0; idx < stationsData.things.length; idx++) {
      if (
        stationsData.things[idx].metadata.reporting /* 部分站点信息格式不正常 */ &&
        stationsData.things[idx].metadata.reporting.updateTime /* 部分站点信息格式不正常 */ &&
        timeLimit < new Date(stationsData.things[idx].metadata.reporting.updateTime).getTime()
      )
        workingEquipment++;
    }
    return (
      <>
        <div className={styles.FunctionMenuBlock}>
          <Row
            className={styles.FunctionMenuClickRow}
            onClick={() => {
              onMenuClick('ThingList');
            }}
          >
            <Col span={2} offset={1} style={{ borderBottom: '1px solid #DDD' }}>
              <Icon type="database" theme="filled" />
            </Col>
            <Col span={20} style={{ borderBottom: '1px solid #DDD' }}>
              设备一览
            </Col>
          </Row>
          <Row className={styles.FunctionMenuClickRow}>
            <Col span={22} offset={1}>
              预留菜单扩展区
            </Col>
          </Row>
        </div>
        <div className={styles.FunctionMenuBlock} style={{ marginTop: 10 }}>
          <Row className={styles.FunctionMenuRow}>
            <Col span={2} offset={1}>
              <Icon type="setting" theme="filled" />
            </Col>
            <Col span={20}>工作设备 {workingEquipment + ' / ' + stationsData.things.length}</Col>
          </Row>
        </div>
        <div className={styles.FunctionMenuBlock} style={{ marginTop: 10 }}>
          <Row className={styles.FunctionMenuRow}>
            <Col span={22} offset={1}>
              预留功能区
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default FunctionMenu;
