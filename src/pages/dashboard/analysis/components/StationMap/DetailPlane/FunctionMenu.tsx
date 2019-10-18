import React, { Component } from 'react';
import { Row, Col, Icon, Statistic } from 'antd';
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
    let normalEquipment: number = 0;
    let waringEquipment: number = 0;
    let alarmEquipment: number = 0;
    const timeLimit = new Date().getTime() - 24 * 60 * 60 * 1000;
    for (let idx: number = 0; idx < stationsData.things.length; idx++) {
      if (
        stationsData.things[idx].metadata.reporting /* 部分站点信息格式不正常 */ &&
        stationsData.things[idx].metadata.reporting.updateTime /* 部分站点信息格式不正常 */
      ) {
        const thing = stationsData.things[idx];
        const current = thing.metadata.reporting.water_level.current;
        if (timeLimit < new Date(thing.metadata.reporting.updateTime).getTime()) {
          workingEquipment++;
          if (current < thing.metadata.reporting.water_level.warning) {
            normalEquipment++;
          } else if (current < thing.metadata.reporting.water_level.critical) {
            waringEquipment++
          } else {
            alarmEquipment++;
          }
        }
      }
    }
    return (
      <>
        <div className={styles.FunctionMenuBlock}>
          <Row className={styles.FunctionMenuRow}>
            <Col span={24}>
              <Row>
                全部设备： {stationsData.things.length}
              </Row>
              <Row style={{paddingLeft: '2px', paddingRight: '2px'}}>
                <Col span={6} style={{textAlign: 'center', borderRadius: '5px', backgroundColor: '#4DB34D', margin: '1px'}}>
                  <Statistic title="正常" value={normalEquipment} />
                </Col>
                <Col span={6} style={{textAlign: 'center', borderRadius: '5px', backgroundColor: '#c6c140', margin: '1px'}}>
                  <Statistic title="预警" value={waringEquipment} />
                </Col>
                <Col span={6} style={{textAlign: 'center', borderRadius: '5px', backgroundColor: '#d53f08', margin: '1px'}}>
                  <Statistic title="报警" value={alarmEquipment} />
                </Col>
                <Col span={5} style={{textAlign: 'center', borderRadius: '5px', backgroundColor: '#939393', margin: '1px'}}>
                  <Statistic title="离线" value={stationsData.things.length - workingEquipment} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className={styles.FunctionMenuBlock} style={{ marginTop: 10 }}>
          <Row
            className={styles.FunctionMenuClickRow}
            onClick={() => {
              onMenuClick('ThingList');
            }}
          >
            <Col span={2} offset={1} style={{ borderBottom: '1px solid #DDD' }}>
              <Icon type="unordered-list" />
            </Col>
            <Col span={20} style={{ borderBottom: '1px solid #DDD' }}>
              设备一览
            </Col>
          </Row>
          <Row
            className={styles.FunctionMenuClickRow}
            onClick={() => {
              onMenuClick('ThingTable');
            }}
          >
            <Col span={2} offset={1} style={{ borderBottom: '1px solid #DDD' }}>
              <Icon type="table" />
            </Col>
            <Col span={20} style={{ borderBottom: '1px solid #DDD' }}>
              列表显示
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default FunctionMenu;
