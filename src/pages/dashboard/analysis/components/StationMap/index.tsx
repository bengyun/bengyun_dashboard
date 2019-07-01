import React, { Component } from 'react';
import { Tag, Table, List, Button, Input } from 'antd';
import { Map, Marker } from 'react-amap';

import styles from './index.less';

import DetailPlane from './detailPlane';
import CustomMarker from './customMarker';
import SearchPlane from './searchPlane';
import ToolBar from './ToolBar';
import PumpStatusPlane from './pumpStatusPlane';

/* Remember
props = {
  stationsData     : object,
  getStationDetail : function,
}
*/

class StationMap extends Component {
  state = {
    mapCenter: undefined,
    OnlineFilterCurState: { Online: true, Offline: true },
    AlarmFilterCurState: { Normal: true, Alarm: true },

    StationDetailVisible: false,
    ShowStationExtData: null,
  };

  constructor(props) {
    super(props);
  }

  ShowStationDetail = extData => {
    this.setState({
      StationDetailVisible: true,
      ShowStationExtData: extData,
    });

    const { FatchStationDetail, stationDetailDataRange } = this.props;
    let { startTime, endTime } = stationDetailDataRange;
    if (startTime === undefined || endTime === undefined) {
      const DateNow = new Date();
      let YYYY = DateNow.getFullYear();
      let MM = DateNow.getMonth() + 1;
      let DD = DateNow.getDate();
      let HH = DateNow.getHours();
      let mm = DateNow.getMinutes();
      let ss = DateNow.getSeconds();
      endTime = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;

      DateNow.setTime(DateNow.getTime() - 24 * 60 * 60 * 1000);
      YYYY = DateNow.getFullYear();
      MM = DateNow.getMonth() + 1;
      DD = DateNow.getDate();
      HH = DateNow.getHours();
      mm = DateNow.getMinutes();
      ss = DateNow.getSeconds();
      startTime = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;

      FatchStationDetail({
        stationId: extData.id,
        stationDetailDataRange: { startTime: startTime, endTime: endTime },
      });
    }
  };
  CloseStationDetail = () => {
    this.setState({
      StationDetailVisible: false,
      ShowStationExtData: null,
    });
  };

  returnPoi = poi => {
    this.setState({
      mapCenter: poi.location,
    });
  };

  OnlineFilterCallBack = OnlineFilterCurState => {
    this.setState({
      OnlineFilterCurState,
    });
  };

  AlarmFilterCallBack = AlarmFilterCurState => {
    this.setState({
      AlarmFilterCurState,
    });
  };

  // initialize map markers according to props.stationsData
  RenderMarker = () => {
    const { OnlineFilterCurState, AlarmFilterCurState } = this.state;
    const { stationsData } = this.props;
    if (stationsData === undefined || stationsData.total === undefined) return null;
    const res = [];
    for (let i = 0; i < stationsData.stations.length; i += 1) {
      const stationData = stationsData.stations[i];
      const metadata = stationData.metadata;
      const dataUpdateTimeStri = metadata.dataUpdateTime;
      const dataUpdateTimeDate = new Date(dataUpdateTimeStri.replace(/-/g, '/')).getTime();
      const fourHourBeforeDate = Date.now() - 1000 * 60 * 60 * 4;
      const Online = dataUpdateTimeDate >= fourHourBeforeDate;
      const Alarm = stationData.metadata.alarmLevel > 0;

      //Filter
      //OnlineFilter
      if (OnlineFilterCurState.Online === false && Online === true) continue;
      if (OnlineFilterCurState.Offline === false && Online === false) continue;
      //AlarmFilter
      if (AlarmFilterCurState.Normal === false && Alarm === false) continue;
      if (AlarmFilterCurState.Alarm === false && Alarm === true) continue;

      res.push(CustomMarker(stationData, Online, this.ShowStationDetail));
    }
    return res;
  };

  render() {
    const { mapCenter } = this.state;

    // Filter Status
    const { OnlineFilterCurState, AlarmFilterCurState } = this.state;

    // Detail Data
    const { StationDetailVisible, ShowStationExtData } = this.state;

    //const plugins = ['MapType', 'OverView', 'Scale', 'ToolBar', 'ControlBar'];
    const plugins = ['Scale', 'ToolBar'];
    return (
      <Map plugins={plugins} center={mapCenter}>
        <SearchPlane
          className={styles.searchPlane}
          placeholder="输入位置定位地图"
          returnPoi={this.returnPoi}
        />

        <ToolBar
          OnlineFilterCurState={OnlineFilterCurState}
          OnlineFilterCallBack={this.OnlineFilterCallBack}
          AlarmFilterCurState={AlarmFilterCurState}
          AlarmFilterCallBack={this.AlarmFilterCallBack}
        />

        <DetailPlane
          loading={false}
          StationDetailVisible={StationDetailVisible}
          ShowStationExtData={ShowStationExtData}
          CloseStationDetail={this.CloseStationDetail}
          {...this.props}
        />

        <PumpStatusPlane {...this.props} />

        {this.RenderMarker()}
      </Map>
    );
  }
}

export default StationMap;
