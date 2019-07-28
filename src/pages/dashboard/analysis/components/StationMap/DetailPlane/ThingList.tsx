import React, { Component } from 'react';
import { List, Icon } from 'antd';
import styles from './index.less';
import { IStationsList, IThing } from '@/pages/dashboard/analysis/data';

interface ThingListProps {
  stationsData: IStationsList /* 设备列表 */;
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

class ThingList extends Component<ThingListProps, ThingListState> {
  state: ThingListState = {};

  constructor(props: ThingListProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  onItemClick = (station: IThing) => {
    const { onDetailButtonClick = () => {} } = this.props;
    onDetailButtonClick(station);
  };

  filterListItem = (stationsData: IStationsList) => {
    const res = [];
    for (let i = 0; i < stationsData.things.length; i += 1) {
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

  render() {
    const { stationsData, onReturnClick = () => {} } = this.props;
    const stations = this.filterListItem(stationsData);
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
                <List.Item.Meta title={item.name} description={item.metadata.location.address} />
                液位:{item.metadata.reporting.water_level.current}
              </List.Item>
            )}
          />
        </div>
      </>
    );
  }
}

export default ThingList;
