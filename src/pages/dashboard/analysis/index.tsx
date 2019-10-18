import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { Dispatch } from 'redux';
import StationMap from './components/StationMap';
// @ts-ignore
import Websocket from 'react-websocket';
import { IAnalysisData } from '@/pages/dashboard/analysis/data';
const dateTime = require('date-time');

interface DashboardAnalysisProps {
  dashboardAnalysis: IAnalysisData;
  dispatch: Dispatch<any>;
}

interface DashboardAnalysisState {}

@connect(
  ({
     dashboardAnalysis,
     loading,
  }: {
    dashboardAnalysis: IAnalysisData;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAnalysis,
    loadingStationsData: loading.effects['dashboardAnalysis/fetchStationsData'], /* 并没有卵用，只是留在这里提醒还能获得调用中的状态 */
  }),
)
class Analysis extends Component<DashboardAnalysisProps, DashboardAnalysisState> {
  state: DashboardAnalysisState = {};
  url: string = '';
  refWebSocket: any = null;
  /* 在组件加载时，更新站点(Thing)信息，并设定定时更新 */
  constructor(props: any) {
    super(props);
    const { dispatch } = this.props;
    /* 更新站点(Thing)信息 */
    dispatch({
      type: 'dashboardAnalysis/fetchStationsData',
    });
    const channelId = 'ba22f57d-642e-4b82-9718-5e3b68809ac0';
    const thingKey = '1033d3be-fffd-4ecb-94b1-51776a1cbb2b';
    this.url =
      'ws://121.41.1.169/ws/channels/' +
      channelId +
      '/messages?authorization=' +
      thingKey;
  }
  /* 在组件卸载前，终止更新站点(Thing)信息的计时器，并清空模型中的数据 */
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
  }
  handleData = (data: any) => {
    data = JSON.parse(data);
    if (data[0].bn) {
      const { dispatch } = this.props;
      const { dashboardAnalysis } = this.props;
      const { stationsData, selectedThing, stationDetailData, TIANGU } = dashboardAnalysis;
      const thingList = stationsData.things;
      let updateThing = null;
      let newPumpCurrent = '';
      let newPumpStatusData = '';
      let newWaterLevelData = '';
      if (data[0].bn === '4e2b4730-c5bc-4b1d-8fa1-b810d3aca96d') {
        newWaterLevelData = data[1].v;
        const { pumpCurrent, newPumpStatus, newWaterLevel, newWaterLevelTIANGU } = stationDetailData;
        const timeNowString = dateTime();
        newWaterLevelTIANGU.push({
          time: timeNowString,
          mean: parseFloat(newWaterLevelData),
        });
        pumpCurrent.push({
          time: timeNowString,
          mean: pumpCurrent.length > 0 ? pumpCurrent[pumpCurrent.length - 1].mean : 0,
        });
        newPumpStatus.push({
          time: timeNowString,
          max: newPumpStatus.length > 0 ? newPumpStatus[newPumpStatus.length - 1].max : 0,
        });
        newWaterLevel.push({
          time: timeNowString,
          mean: newWaterLevel.length > 0 ? newWaterLevel[newWaterLevel.length - 1].mean : 0,
        });
        stationDetailData.newWaterLevelTIANGU = newWaterLevelTIANGU;
        dispatch({
          type: 'dashboardAnalysis/updateDetailData',
          payload: stationDetailData,
        });
        dispatch({
          type: 'dashboardAnalysis/setTiangu',
          payload: newWaterLevelData,
        });
      }
      for (let idx = 0; idx < thingList.length; idx++) {
        updateThing = thingList[idx];
        if (updateThing.id === data[0].bn) {
          for (let idxOfSenML = 0; idxOfSenML < data.length; idxOfSenML++) {
            switch (data[idxOfSenML].n) {
              case 'water_level':
                newWaterLevelData = data[idxOfSenML].v;
                updateThing.metadata.reporting.water_level.current = data[idxOfSenML].v;
                break;
              case 'pump_current':
                newPumpCurrent = data[idxOfSenML].v;
                updateThing.metadata.reporting.pump_current = data[idxOfSenML].v;
                break;
              case 'pump_status':
                newPumpStatusData = data[idxOfSenML].v;
                updateThing.metadata.reporting.pump_status = data[idxOfSenML].v;
                break;
              default:
                break;
            }
          }
          updateThing.metadata.reporting.updateTime = dateTime({ date: new Date() });
          stationsData.things[idx] = updateThing;
          dispatch({
            type: 'dashboardAnalysis/updateThingData',
            payload: stationsData,
          });
          break;
        }
      }
      if (selectedThing && selectedThing.id === data[0].bn) {
        dispatch({
          type: 'dashboardAnalysis/setSelectedThing',
          payload: updateThing,
        });
        const { pumpCurrent, newPumpStatus, newWaterLevel, newWaterLevelTIANGU } = stationDetailData;
        const timeNowString = dateTime();
        pumpCurrent.push({
          time: timeNowString,
          mean: parseFloat(newPumpCurrent),
        });
        newPumpStatus.push({
          time: timeNowString,
          max: parseFloat(newPumpStatusData),
        });
        newWaterLevel.push({
          time: timeNowString,
          mean: parseFloat(newWaterLevelData),
        });
        newWaterLevelTIANGU.push({
          time: timeNowString,
          mean: newWaterLevelTIANGU.length > 0 ? newWaterLevelTIANGU[newWaterLevelTIANGU.length - 1].mean : TIANGU,
        });
        if (pumpCurrent.length > 120) pumpCurrent.shift();
        if (newPumpStatus.length > 120) newPumpStatus.shift();
        if (newWaterLevel.length > 120) newWaterLevel.shift();
        if (newWaterLevelTIANGU.length > 120) newWaterLevelTIANGU.shift();
        stationDetailData.pumpCurrent = pumpCurrent;
        stationDetailData.newPumpStatus = newPumpStatus;
        stationDetailData.newWaterLevel = newWaterLevel;
        dispatch({
          type: 'dashboardAnalysis/updateDetailData',
          payload: stationDetailData,
        });
      }
    }
  };
  sendMessage = (message: string) => {
    this.refWebSocket.sendMessage(message);
  };
  /* 显示组件 */
  render() {
    return (
      <div style={{ width: '100%', height: '800px' }}>
        <Suspense fallback={<PageLoading />}>
          <StationMap />
        </Suspense>
        <Websocket
          style={{display: 'none'}}
          url={this.url}
          onMessage={ this.handleData }
          onOpen={() => {console.log('WebSocket connected')}}
          onClose={() => {console.log('WebSocket disconnected')}}
          reconnect
          debug
          ref={(WebSocket: any) => {
            this.refWebSocket = WebSocket;
          }}
        />
      </div>
    );
  }
}

export default Analysis;
