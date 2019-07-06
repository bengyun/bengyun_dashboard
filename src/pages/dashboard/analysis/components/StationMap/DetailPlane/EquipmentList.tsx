import React, { Component } from 'react';
import { List } from 'antd';
import styles from './index.less';

/* for remember
props = {
  pumpStatus      : object
};
*/

class EquipmentList extends Component {
  state = {};

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  onItemClick = station => {
    const { ShowStationDetail } = this.props;
    ShowStationDetail(station);
  };

  filterListItem = () => {
    const { stationsData } = this.props;
    const { OnlineFilterCurState, AlarmFilterCurState } = this.props;
    const res = [];

    for (let i = 0; i < stationsData.stations.length; i += 1) {
      const stationData = stationsData.stations[i];
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

      res.push(stationData);
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
              actions={[<span> {item.metadata.dataUpdateTime} </span>]}
            >
              <List.Item.Meta title={item.name} description={item.metadata.address} />
              液位:{item.metadata.level} 电压:{item.metadata.voltage}
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default EquipmentList;
