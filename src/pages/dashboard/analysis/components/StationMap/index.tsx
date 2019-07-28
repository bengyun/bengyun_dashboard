import React, { Component } from 'react';
import { Map } from 'react-amap';
import DetailPlane from './DetailPlane';
import CustomMarker from './customMarker';
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
  mapZoom: number | null;
  OnlineFilterCurState: object;
  AlarmFilterCurState: object;

  SelectedThing: IThing | null;
}

class StationMap extends Component<StationMapProps, StationMapState> {
  state = {
    mapCenter: { longitude: 121.56, latitude: 30.01 },
    mapZoom: 14,
    OnlineFilterCurState: { Online: true, Offline: true },
    AlarmFilterCurState: { Normal: true, Alarm: true },

    SelectedThing: null,
  };

  aMap = null;

  constructor(props: any) {
    super(props);
  }

  CustomMapComponent = (props: any) => {
    // props.__ele__;
    // props.__map__;
    // your code here
    this.aMap = props.__map__;
    return null;
  };

  Bd09llToGcj02ll = (gps: { latitude: number; longitude: number }) => {
    const PI = (3.14159265358979324 * 3000.0) / 180.0;
    const x = gps.longitude - 0.0065;
    const y = gps.latitude - 0.006;
    const k = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI);
    const longitude = k * Math.cos(theta);
    const latitude = k * Math.sin(theta);
    return { latitude, longitude };
  };

  SetSelectedThing = (extData: IThing) => {
    const Bd09ll = extData.metadata.location.gps;
    const Gcj02ll = this.Bd09llToGcj02ll(Bd09ll);
    this.setState({
      SelectedThing: extData,
      mapCenter: Gcj02ll,
    });
    const aMap = this.aMap;
    if (aMap !== null) {
      // @ts-ignore
      aMap.setZoom(18);
    }
  };
  ResetSelectedThing = () => {
    this.setState({
      SelectedThing: null,
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
      /* 暂时对应 */ res.push(
        CustomMarker({ stationData: stationData, onDetailButtonClick: this.SetSelectedThing }),
      );
    }
    return res;
  };

  render() {
    const { mapCenter, mapZoom } = this.state;
    // Filter Status
    const { OnlineFilterCurState, AlarmFilterCurState } = this.state;
    // Detail Data
    const { SelectedThing } = this.state;
    /* Map Properties */
    const plugins: ('MapType' | 'OverView' | 'Scale' | 'ToolBar' | 'ControlBar')[] = [
      'Scale',
      'ToolBar',
    ];
    const events: { created: Function; click: Function } = {
      created: () => {},
      click: () => {
        this.ResetSelectedThing();
      },
    };

    return (
      <Map
        plugins={plugins}
        center={mapCenter}
        zoom={mapZoom}
        events={events}
        resizeEnable
        amapkey="4cb9cfa5d9351a3ff333011d9428e359"
        mapStyle="amap://styles/63cf3afb9449d4e7784944699f472d6d"
      >
        {this.RenderMarker()}

        <DetailPlane
          SelectedThing={SelectedThing}
          onDetailPlaneClose={this.ResetSelectedThing}
          onDetailButtonClick={this.SetSelectedThing}
          OnlineFilterCurState={OnlineFilterCurState}
          OnlineFilterCallBack={this.OnlineFilterCallBack}
          AlarmFilterCurState={AlarmFilterCurState}
          AlarmFilterCallBack={this.AlarmFilterCallBack}
          returnPoi={this.returnPoi}
          {...this.props}
        />

        <this.CustomMapComponent />
      </Map>
    );
  }
}

export default StationMap;
