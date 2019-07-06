import React, { Component } from 'react';
import { Tag, Table, List, Button, Input } from 'antd';
import { Map, Marker } from 'react-amap';

import styles from './index.less';

import DetailPlane from './DetailPlane';
import CustomMarker from './customMarker';
import SearchPlane from './searchPlane';
import EquipmentStatus from './EquipmentStatus';

/* Remember
props = {
  stationsData     : object,
  getStationDetail : function,
}
*/

class StationMap extends Component {
  state = {
    mapCenter: { longitude: 121.54, latitude: 30.01 },
    OnlineFilterCurState: { Online: true, Offline: true },
    AlarmFilterCurState: { Normal: true, Alarm: true },

    ShowStationExtData: null,
  };

  constructor(props) {
    super(props);
  }

  ShowStationDetail = extData => {
    this.setState({
      ShowStationExtData: extData,
      mapCenter: extData.metadata.position,
    });
  };

  CloseStationDetail = () => {
    this.setState({
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
    const { ShowStationExtData } = this.state;

    //const plugins = ['MapType', 'OverView', 'Scale', 'ToolBar', 'ControlBar'];
    const plugins = ['Scale', 'ToolBar'];

    const events = {
      created: ins => {},
      click: () => {
        this.CloseStationDetail();
      },
    };

    return (
      <Map plugins={plugins} center={mapCenter} zoom="13" events={events}>
        {this.RenderMarker()}

        <SearchPlane placeholder="输入位置定位地图" returnPoi={this.returnPoi} {...this.props} />

        <DetailPlane
          loading={false}
          stationExtData={ShowStationExtData}
          CloseStationDetail={this.CloseStationDetail}
          ShowStationDetail={this.ShowStationDetail}
          OnlineFilterCurState={OnlineFilterCurState}
          OnlineFilterCallBack={this.OnlineFilterCallBack}
          AlarmFilterCurState={AlarmFilterCurState}
          AlarmFilterCallBack={this.AlarmFilterCallBack}
          {...this.props}
        />

        <EquipmentStatus {...this.props} />
      </Map>
    );
  }
}

export default StationMap;
