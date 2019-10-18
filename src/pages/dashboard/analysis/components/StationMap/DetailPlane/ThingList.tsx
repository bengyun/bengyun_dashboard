import React, { Component } from 'react';
import { List, Icon, Row, Col } from 'antd';
import styles from './index.less';
import { IAnalysisData, IStationsList, IThing } from '@/pages/dashboard/analysis/data';
import { connect } from 'dva';

interface ThingListProps {
  dashboardAnalysis?: IAnalysisData;
  onDetailButtonClick?: Function /* 设置选中设备 */;
  onReturnClick?: Function /* 返回主菜单 */;
}

interface ThingListState {}

const ThingListStyle = {
  top: '30px',
  bottom: 0,
  width: '100%',
  background: 'white',
  border: '1px solid #eee',
};

@connect(
  ({
     dashboardAnalysis,
   }: {
    dashboardAnalysis: IAnalysisData;
  }) => ({
    dashboardAnalysis,
  }),
)
class ThingList extends Component<ThingListProps, ThingListState> {
  state: ThingListState = {};

  constructor(props: ThingListProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }
  /* 当点击设备(Thing)列表的某一项时候，将其设为选中设备(Thing) */
  onItemClick = (station: IThing) => {
    const { onDetailButtonClick = () => {} } = this.props;
    onDetailButtonClick(station);
  };
  /* 根据筛选条件筛选显示的设备(Thing) */
  filterListItem = (stationsData: IStationsList) => {
    const res = [];
    for (let i = 0; i < stationsData.things.length; i++) {
      const stationData = stationsData.things[i];
      if (stationData.metadata.location === undefined) continue;
      /*
      const stationData = stationsData.things[i];
      const metadata = stationData.metadata;
      const dataUpdateTimeStri = metadata.dataUpdateTime;
      const dataUpdateTimeDate = new Date(dataUpdateTimeStri.replace(/-/g, '/')).getTime();
      const fourHourBeforeDate = Date.now() - 1000 * 60 * 60 * 4;
      const Online = dataUpdateTimeDate >= fourHourBeforeDate;
      const Alarm = metadata.alarmLevel > 0;

      //Filter
      //OnlineFilter
      if (OnlineFilterCurState.Online === false && Online === true) continue;
      if (OnlineFilterCurState.Offline === false && Online === false) continue;
      //AlarmFilter
      if (AlarmFilterCurState.Normal === false && Alarm === false) continue;
      if (AlarmFilterCurState.Alarm === false && Alarm === true) continue;
      */
      /* 暂时无效了筛选功能 */ res.push(stationData);
    }
    return res;
  };

  RenderListItemFunction = (item: IThing) => {
    const current = item.metadata.reporting.water_level.current;
    const critical = item.metadata.reporting.water_level.critical;
    const warning = item.metadata.reporting.water_level.warning;

    let color;
    const space = "\xa0\xa0\xa0\xa0";

    const updateTime = item.metadata.reporting.updateTime;
    if (new Date().getTime() - new Date(updateTime).getTime() > 24 * 60 * 60 * 1000) {
      color = "grey";
    } else if (current < warning) {
      color = "green";
    } else if (current > critical) {
      color = "red";
    } else {
      color = "orange";
    }

    return (
      <div>
        <Row >
          <Col span={20}>{space}{item.name}</Col>
          <Col span={4} style={{ color: color}}>
            <Icon type="info-circle" theme="filled" />
          </Col>
        </Row>
        <Row>
          {space}{item.metadata.location.address}
        </Row>
      </div>
    )
  };

  /* 显示组件 */
  render() {
    const {
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined },
      onReturnClick = () => {},
    } = this.props;
    const {
      stationsData,
    } = dashboardAnalysis;
    let stations: IThing[] = [];
    /* 对设备(Thing)信息进行筛选 */
    if (stationsData !== undefined) stations = this.filterListItem(stationsData);

    const space = "\xa0\xa0\xa0\xa0" + "液位:";

    return (
      <>
        <div
          className={styles.ReturnToMenu}
          onClick={() => {
            onReturnClick('FunctionMenu');
          }}
        >
          返回菜单 <Icon type="rollback" />
        </div>
        <div style={{ ...ThingListStyle, position: 'absolute', overflowY: 'auto' }}>
          <List
            size="large"
            dataSource={stations}
            renderItem={item => (
              <List.Item
                key={item.key}
                onClick={() => {
                  this.onItemClick(item);
                }}
                actions={[<span key={item.key}> {item.metadata.reporting.updateTime} </span>]}
              >
                <this.RenderListItemFunction {...item}/>
                {space}
                {item.metadata.reporting.water_level.current}
              </List.Item>
            )}
          />
        </div>
      </>
    );
  }
}

export default ThingList;
