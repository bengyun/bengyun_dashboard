import { getThings, getNewestData, getChannels } from '@/services/api';
import { IAnalysisData, IStationsList } from './data';
import { Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
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
    fetchStationDetailData: Effect;
    clearStationDetailData: Effect;
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
    stationDetailData: {
      historyLevel: [],
    },
  },

  effects: {
    *fetchStationsData({ payload }, { call, put }) {
      const thingList: IStationsList = yield call(getThings, payload); /* 获得设备信息 */
      const payloadForNewestData: { things: string[] } = { things: [] };
      for (let idx: number = 0; idx < thingList.things.length; idx++) {
        payloadForNewestData.things.push(thingList.things[idx].id); /* 设备列表 thing_id */
      }
      const newestData: {
        thing_id: string;
        water_level: string;
        water_level_time: string;
        battery_voltage: string;
        battery_voltage_time: string;
      }[] = yield call(getNewestData, payloadForNewestData); /* 获得设备最新液位和电压 */
      const TimeDiff =
        new Date(dateTime()).getTime() -
        new Date(dateTime({ local: false })).getTime(); /* 获得当前时区与UTC时区时间差 */
      for (let idx: number = 0; idx < thingList.things.length; idx++) {
        if (
          thingList.things[idx] === undefined ||
          thingList.things[idx].metadata === undefined ||
          thingList.things[idx].metadata.reporting === undefined
        )
          continue; /* 排除奇葩设备 */
        thingList.things[idx].metadata.reporting.water_level.current = parseFloat(
          newestData[idx].water_level,
        ); /* 插入最新水位 */
        thingList.things[idx].metadata.reporting.batteryVoltage = parseFloat(
          newestData[idx].battery_voltage,
        ); /* 插入最新电压 */
        thingList.things[idx].metadata.reporting.updateTime = dateTime({
          date: new Date(
            new Date(newestData[idx].water_level_time).getTime() + TimeDiff,
          ) /* 插入水位更新时间 */,
        });
      }
      yield put({
        type: 'save',
        payload: {
          stationsData: thingList,
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
      const response = yield call(getChannels, params);
      for (let idx: number = 0; idx < response.length; idx++) {
        /* 将返回的UTC时间转换为当地时间 */
        response[idx].time = dateTime({
          date: new Date(new Date(response[idx].time).getTime() + TimeDiff),
        });
      }
      yield put({
        type: 'save',
        payload: {
          stationDetailData: { historyLevel: response },
        },
      });
    },
    *clearStationDetailData(_, { call, put }) {
      yield put({
        type: 'clear',
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
        stationDetailData: {
          historyLevel: [],
        },
      };
    },
  },
};

export default Model;
