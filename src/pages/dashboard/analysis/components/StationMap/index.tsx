import React, { Component } from 'react';
import { Map } from 'react-amap';
import DetailPlane from './DetailPlane';
import CustomMarker from './customMarker';
import { IAnalysisData, IThing } from '@/pages/dashboard/analysis/data';
import { connect } from 'dva';
import { Dispatch } from 'redux';

interface StationMapProps {
  dashboardAnalysis?: IAnalysisData;
  dispatch?: Dispatch<any>;
}

interface StationMapState {
  mapCenter: object;
  mapZoom: number | null;
  OnlineFilterCurState: object;
  AlarmFilterCurState: object;
}

@connect(
  ({
     dashboardAnalysis,
   }: {
    dashboardAnalysis: IAnalysisData;
  }) => ({
    dashboardAnalysis,
  }),
)
class StationMap extends Component<StationMapProps, StationMapState> {
  state = {
    mapCenter: { longitude: 121.56, latitude: 30.01 }, /* 地图的中心，暂时是个固定值 */
    mapZoom: 14, /* 地图的缩放比例，暂时是个固定值 */
    OnlineFilterCurState: { Online: true, Offline: true }, /* 在线筛选条件 */
    AlarmFilterCurState: { Normal: true, Alarm: true }, /* 警报筛选条件 */
  };
  /* 保存高德地图原生对象 */
  aMap = null;
  constructor(props: any) {
    super(props);
  }
  /* 获得高德地图原生对象 */
  CustomMapComponent = (props: any) => {
    // props.__ele__;
    // props.__map__;
    // your code here
    this.aMap = props.__map__;
    return null;
  };
  /* 将百度地图坐标转换为高德地图坐标 */
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
  /* 设置选中的设备(Thing),并移动到地图中心，并将地图缩放设为18 */
  SetSelectedThing = (extData: IThing) => {
    const Bd09ll = extData.metadata.location.gps;
    const Gcj02ll = this.Bd09llToGcj02ll(Bd09ll);
    this.setState({
      mapCenter: Gcj02ll,
    });
    const { dispatch } = this.props;
    if (dispatch) dispatch({
      type: 'dashboardAnalysis/setSelectedThing',
      payload: extData,
    });
    const aMap = this.aMap;
    if (aMap !== null) {
      // @ts-ignore
      aMap.setZoom(18);
    }
  };
  /* 将选中设备设置为null */
  ResetSelectedThing = () => {
    const { dispatch } = this.props;
    if (dispatch) dispatch({
      type: 'dashboardAnalysis/setSelectedThing',
      payload: null,
    });
  };
  /* 根据参数的坐标定位地图中心 */
  returnPoi = (POI: any) => {
    this.setState({
      mapCenter: POI.location,
    });
  };
  /* 设置在线筛选的条件状态 */
  OnlineFilterCallBack = (OnlineFilterCurState: any) => {
    this.setState({
      OnlineFilterCurState,
    });
  };
  /* 设置警报筛选的条件状态 */
  AlarmFilterCallBack = (AlarmFilterCurState: any) => {
    this.setState({
      AlarmFilterCurState,
    });
  };
  /* 控制水泵的函数 */
  PumpControl = (data: any) => {
    const {
      dispatch,
    } = this.props;
    if (dispatch) dispatch({
      type: 'dashboardAnalysis/pumpControl',
      payload: data,
    });
  };
  /* 根据设备(Thing)信息生成地图标记列表 */
  RenderMarker = () => {
    const {
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined },
    } = this.props;
    const {
      stationsData,
    } = dashboardAnalysis;
    /* 如果没有设备(Thing)信息则返回空数组 */
    if (stationsData === undefined || stationsData.total === undefined) return [];
    const res = [];
    /* 根据设备(Thing)信息创建地图标记集合 */
    for (let i = 0; i < stationsData.things.length; i += 1) {
      const thing = stationsData.things[i];
      if (
        thing !== undefined &&
        (
          thing.metadata.type === 'manhole' ||
          thing.metadata.type === 'pump_station'
        )
      ) {
        res.push(
          CustomMarker({ thing: thing, onDetailButtonClick: this.SetSelectedThing, pumpSwitch: this.PumpControl }),
        );
      }
    }
    return res;
  };
  /* 显示组件 */
  render() {
    /* 地图中心坐标和地图缩放等级 */
    const { mapCenter, mapZoom } = this.state;
    /* 筛选条件 */
    const { OnlineFilterCurState, AlarmFilterCurState } = this.state;
    /* 选中的设备(Thing) */
    const { dashboardAnalysis = {selectedThing: null} } = this.props;
    const { selectedThing } = dashboardAnalysis;
    /* Map Properties */
    const plugins: ('MapType' | 'OverView' | 'Scale' | 'ToolBar' | 'ControlBar')[] = [
      'Scale',
      'ToolBar',
    ];
    /* 当鼠标点击地图时，取消选中的设备(Thing) */
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
          SelectedThing={selectedThing}
          onDetailPlaneClose={this.ResetSelectedThing}
          onDetailButtonClick={this.SetSelectedThing}
          OnlineFilterCurState={OnlineFilterCurState}
          OnlineFilterCallBack={this.OnlineFilterCallBack}
          AlarmFilterCurState={AlarmFilterCurState}
          AlarmFilterCallBack={this.AlarmFilterCallBack}
          returnPoi={this.returnPoi}
        />

        <this.CustomMapComponent />
      </Map>
    );
  }
}

export default StationMap;
