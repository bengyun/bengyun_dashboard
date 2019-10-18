import { getThings, getNewestData, getChannels, getChannelsTemp, getChannelsTempOfTiangu, getPumpStatus, /* getHistogram,*/ pumpControl, microServiceControl } from '@/services/api';
import { IAnalysisData, IStationsList } from './data';
import { Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { IThing } from '@/pages/dashboard/analysis/data';
const dateTime = require('date-time');

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: IAnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: IAnalysisData;
  effects: {
    fetchStationsData: Effect;
    updateThingData: Effect;
    fetchStationDetailData: Effect;
    clearStationDetailData: Effect;

    pumpControl: Effect;
    microServiceControl: Effect;

    setSelectedThing: Effect;
    updateDetailData: Effect;

    setTiangu: Effect;
  };
  reducers: {
    save: Reducer<IAnalysisData>;
    clear: Reducer<IAnalysisData>;
  };
}

const Model: ModelType = {
  namespace: 'dashboardAnalysis',

  state: {
    stationsData: {
      total: 0,
      offset: 0,
      limit: 0,
      things: [],
    },
    selectedThing: null,
    stationDetailData: {
      historyLevel: [],
      histogram: [],
      historyLevelOfTiangu: [],
      PumpStatus: [],

      pumpCurrent: [],
      newPumpStatus: [],
      newWaterLevel: [],
      newWaterLevelTIANGU: [],
    },
    TIANGU: 0,
  },

  effects: {
    *fetchStationsData({ payload }, { call, put }) {
      const thingList: IStationsList = yield call(getThings, payload); /* 获得设备信息 */
      const allThings: IThing[] = thingList.things;
      thingList.things = [];
      const payloadForNewestData: { things: {thing_id: string; thing_type: string}[] } = { things: [] };
      for (let idx: number = 0; idx < allThings.length; idx++) {
        if (
          (allThings[idx].metadata.type === 'pump_station') || /* 自制泵站终端 */
          (allThings[idx].metadata.type === 'manhole') /* 窨井 */
        ) {
          thingList.things.push(allThings[idx]); /* 重新加入有效的设备 */
          payloadForNewestData.things.push({
            thing_id: allThings[idx].id,
            thing_type: allThings[idx].metadata.type,
          }); /* 设备列表 */
        }
      }
      const newestData: {
        thing_id: string;
        water_level: string; /* 液位 */
        water_level_time: string;
        battery_voltage: string; /* 电池电压 */
        battery_voltage_time: string;
        pump_status: string; /* 水泵状态 */
        pump_status_time: string;
        pump_current: string; /* 电流 */
        current_time: string;
      }[] = yield call(getNewestData, payloadForNewestData); /* 获得设备最新液位和电压 */
      const TimeDiff =
        new Date(dateTime()).getTime() -
        new Date(dateTime({ local: false })).getTime(); /* 获得当前时区与UTC时区时间差 */
      for (let idx: number = 0; idx < thingList.things.length; idx++) {
        /* 窨井：：液位 & 电压 & 信息更新时间 */
        if (thingList.things[idx].metadata.type === 'manhole') {
          thingList.things[idx].metadata.reporting.water_level.current = parseFloat(
            parseFloat(newestData[idx].water_level).toFixed(1),
          ); /* 插入最新水位 */
          thingList.things[idx].metadata.reporting.batteryVoltage = parseFloat(
            parseFloat(newestData[idx].battery_voltage).toFixed(1),
          ); /* 插入最新电压 */
          thingList.things[idx].metadata.reporting.updateTime = dateTime({
            date: new Date(
              new Date(newestData[idx].water_level_time).getTime() + TimeDiff,
            ) /* 插入水位更新时间 */,
          });
        }
        /* 泵站：：液位 & 电流 & 水泵状态 & 信息更新时间 */
        if (thingList.things[idx].metadata.type === 'pump_station') {
          thingList.things[idx].metadata.reporting.water_level.current = parseFloat(
            parseFloat(newestData[idx].water_level).toFixed(1),
          ); /* 插入最新水位 */
          thingList.things[idx].metadata.reporting.pump_current = parseFloat(
            parseFloat(newestData[idx].pump_current).toFixed(1),
          ); /* 插入最新电流 */
          thingList.things[idx].metadata.reporting.pump_status = parseInt(newestData[idx].pump_status, 10); /* 插入水泵状态 */
          thingList.things[idx].metadata.reporting.updateTime = dateTime({
            date: new Date(
              new Date(newestData[idx].water_level_time).getTime() + TimeDiff,
            ) /* 插入水位更新时间 */,
          });
        }
      }
      yield put({
        type: 'save',
        payload: {
          stationsData: thingList,
        },
      });
    },
    *updateThingData({ payload }, { select, call, put }) {
      yield put({
        type: 'save',
        payload: {
          stationsData: payload,
        },
      });
    },
    *fetchStationDetailData({ payload }, { call, put }) {
      const TimeDiff =
        new Date(dateTime()).getTime() -
        new Date(dateTime({ local: false })).getTime(); /* 获得当前时区与UTC时区时间差 */
      const startTimeUTC = new Date(
        new Date(payload.timeRange.startTime).getTime() - TimeDiff,
      ); /* 获得起始时间对应的UTC时间 */
      const endTimeUTC = new Date(
        new Date(payload.timeRange.endTime).getTime() - TimeDiff,
      ); /* 获得结束时间对应的UTC时间 */
      const params = {
        publisher: payload.stationId /* 需要获取历史的设备 thing_id */,
        startTime: dateTime({ date: startTimeUTC }) /* 起始时间 yyyy-MM-dd HH:mm:ss */,
        endTime: dateTime({ date: endTimeUTC }) /* 结束时间 yyyy-MM-dd HH:mm:ss */,
      };
      let historyLevel: any = null;
      let historyLevelOfTiangu: any = null;
      let PumpStatus: any = null;
      if (payload.thingType === 'pump_station') {
        historyLevel = yield call(getChannelsTemp, params);
        historyLevelOfTiangu = yield call(getChannelsTempOfTiangu, params);
        PumpStatus = yield call(getPumpStatus, params);
        console.log(PumpStatus);
      } else {
        historyLevel = yield call(getChannels, params);
      }
      for (let idx: number = 0; idx < historyLevel.length; idx++) {
        /* 将返回的UTC时间转换为当地时间 */
        historyLevel[idx].time = dateTime({
          date: new Date(new Date(historyLevel[idx].time).getTime() + TimeDiff),
        });
      }
      for (let idx: number = 0; idx < historyLevelOfTiangu.length; idx++) {
        /* 将返回的UTC时间转换为当地时间 */
        historyLevelOfTiangu[idx].time = dateTime({
          date: new Date(new Date(historyLevelOfTiangu[idx].time).getTime() + TimeDiff),
        });
      }
      for (let idx: number = 0; idx < PumpStatus.length; idx++) {
        /* 将返回的UTC时间转换为当地时间 */
        PumpStatus[idx].time = dateTime({
          date: new Date(new Date(PumpStatus[idx].time).getTime() + TimeDiff),
        });
      }
      const histogram: any[] = [];
      // const histogram = yield call(getHistogram, params);
      let lastNum = 0;
      for (let idx: number = 0; idx < histogram.length; idx++) {
        if (histogram[idx].le === 0) continue;
        histogram[idx].le = histogram[idx].le - 20 + '-' + histogram[idx].le;
        histogram[idx].value = histogram[idx].value - lastNum;
        lastNum = histogram[idx].value;
      }
      yield put({
        type: 'save',
        payload: {
          stationDetailData: { historyLevel, pumpCurrent: [], histogram, historyLevelOfTiangu, PumpStatus, newPumpStatus: [], newWaterLevel: [], newWaterLevelTIANGU: [] },
        },
      });
    },
    *clearStationDetailData(_, { call, put }) {
      yield put({
        type: 'clear',
      });
    },
    *pumpControl({ payload }, { call }) {
      yield call(pumpControl, payload);
    },
    *microServiceControl({ payload }, { call }) {
      yield call(microServiceControl, payload);
    },
    *setSelectedThing({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          selectedThing: payload,
        },
      });
    },
    *updateDetailData({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          stationDetailData: payload,
        },
      });
    },

    *setTiangu({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          TIANGU: payload,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        stationsData: {
          total: 0,
          offset: 0,
          limit: 0,
          things: [],
        },
        selectedThing: null,
        stationDetailData: {
          historyLevel: [],
          histogram: [],
          historyLevelOfTiangu: [],
          PumpStatus: [],

          pumpCurrent: [],
          newPumpStatus: [],
          newWaterLevel: [],
          newWaterLevelTIANGU: [],
        },
        TIANGU: 0,
      };
    },
  },
};

export default Model;
