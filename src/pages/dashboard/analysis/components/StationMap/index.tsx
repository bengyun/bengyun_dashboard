import React, { Component } from 'react';
import { Map } from 'react-amap';

import DetailPlane from './DetailPlane';
import CustomMarker from './customMarker';
import SearchPlane from './searchPlane';
import EquipmentStatus from './EquipmentStatus';
import { IStationDetailData, IStationsList, IThing } from '@/pages/dashboard/analysis/data';

interface StationMapProps {
  loading: boolean;
  stationsData: IStationsList;
  FetchStationList: Function;
  stationDetailData: IStationDetailData;
  FetchStationDetail: Function;
  ClearStationDetail: Function;
}

interface StationMapState {
  mapCenter: object;
  OnlineFilterCurState: object;
  AlarmFilterCurState: object;
  ShowStationExtData: IThing | null;
}

class StationMap extends Component<StationMapProps, StationMapState> {
  state = {
    mapCenter: { longitude: 121.54, latitude: 29.85 },
    OnlineFilterCurState: { Online: true, Offline: true },
    AlarmFilterCurState: { Normal: true, Alarm: true },

    ShowStationExtData: null,
  };

  constructor(props: any) {
    super(props);
  }

  ShowStationDetail = (extData: IThing) => {
    this.setState({
      ShowStationExtData: extData,
      mapCenter: extData.metadata.location.gps,
    });
  };

  CloseStationDetail = () => {
    this.setState({
      ShowStationExtData: null,
    });
  };

  returnPoi = (POI: any) => {
    this.setState({
      mapCenter: POI.location,
    });
  };

  OnlineFilterCallBack = (OnlineFilterCurState: any) => {
    this.setState({
      OnlineFilterCurState,
    });
  };

  AlarmFilterCallBack = (AlarmFilterCurState: any) => {
    this.setState({
      AlarmFilterCurState,
    });
  };

  // initialize map markers according to props.stationsData
  RenderMarker = () => {
    const { stationsData } = this.props;

    if (stationsData === undefined || stationsData.total === undefined) return null;
    const res = [];
    for (let i = 0; i < stationsData.things.length; i += 1) {
      const stationData = stationsData.things[i];
      if (stationData.metadata.location === undefined) continue;
      /*
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
      */
      /* 暂时对应 */ res.push(CustomMarker(stationData, this.ShowStationDetail));
    }
    return res;
  };

  render() {
    const { mapCenter } = this.state;
    // Filter Status
    const { OnlineFilterCurState, AlarmFilterCurState } = this.state;
    // Detail Data
    const { ShowStationExtData } = this.state;
    /* Map Properties */
    const plugins: ('MapType' | 'OverView' | 'Scale' | 'ToolBar' | 'ControlBar')[] = [
      'Scale',
      'ToolBar',
    ];
    const zoom: number | null = 11;
    const events: { created: Function; click: Function } = {
      created: () => {},
      click: () => {
        this.CloseStationDetail();
      },
    };
    /* Map Properties */
    const placeholder: string = '输入位置定位地图';
    /* Equipment State */
    const { stationsData } = this.props;
    let workingEquipment: number = 0;
    for (let idx: number = 0; idx < stationsData.things.length; idx++) {
      if (
        stationsData.things[idx].metadata.reporting &&
        stationsData.things[idx].metadata.reporting.updateTime
      )
        workingEquipment++;
    }
    const pumpStatus: { working: number; total: number } | undefined = {
      working: workingEquipment,
      total: stationsData.things.length,
    };
    return (
      <Map plugins={plugins} center={mapCenter} zoom={zoom} events={events}>
        {this.RenderMarker()}

        <SearchPlane placeholder={placeholder} returnPoi={this.returnPoi} {...this.props} />

        <DetailPlane
          stationExtData={ShowStationExtData}
          CloseStationDetail={this.CloseStationDetail}
          ShowStationDetail={this.ShowStationDetail}
          OnlineFilterCurState={OnlineFilterCurState}
          OnlineFilterCallBack={this.OnlineFilterCallBack}
          AlarmFilterCurState={AlarmFilterCurState}
          AlarmFilterCallBack={this.AlarmFilterCallBack}
          {...this.props}
        />

        <EquipmentStatus pumpStatus={pumpStatus} />
      </Map>
    );
  }
}

export default StationMap;
