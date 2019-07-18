import React, { Component } from 'react';
import { List } from 'antd';
import styles from './index.less';
import { IStationsList, IThing } from '@/pages/dashboard/analysis/data';

interface EquipmentListProps {
  stationsData: IStationsList /* 设备列表 */;
  ShowStationDetail: Function /* 设置选中设备 */;
  OnlineFilterCurState: object;
  OnlineFilterCallBack: Function;
  AlarmFilterCurState: object;
  AlarmFilterCallBack: Function;
}

interface EquipmentListState {}

class EquipmentList extends Component<EquipmentListProps, EquipmentListState> {
  state: EquipmentListState = {};

  constructor(props: EquipmentListProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  onItemClick = (station: IThing) => {
    const { ShowStationDetail } = this.props;
    ShowStationDetail(station);
  };

  filterListItem = () => {
    const { stationsData } = this.props;
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
    const stations = this.filterListItem();
    return (
      <div className={styles.equipmentList}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={stations}
          renderItem={item => (
            <List.Item
              key={item.key}
              className={styles.equipmentItem}
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
    );
  }
}

export default EquipmentList;
