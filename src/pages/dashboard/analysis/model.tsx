import { getThings, getChannels } from '@/services/api';
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
      const LocalTimeNow = new Date();
      const UTCFullYear = LocalTimeNow.getUTCFullYear();
      const UTCMonth = LocalTimeNow.getUTCMonth();
      const UTCDate = LocalTimeNow.getUTCDate();
      const UTCHours = LocalTimeNow.getUTCHours();
      const UTCMinutes = LocalTimeNow.getUTCMinutes();
      const UTCSeconds = LocalTimeNow.getUTCSeconds();
      const UTCTimeNow = new Date(UTCFullYear, UTCMonth, UTCDate, UTCHours, UTCMinutes, UTCSeconds);
      const UTCTimeFourHourAgo = new Date(
        UTCFullYear,
        UTCMonth,
        UTCDate,
        UTCHours - 4,
        UTCMinutes,
        UTCSeconds,
      ); /* 已经验证 UTCHours - 24 可以获得前一天时间 */
      const thingList: IStationsList = yield call(getThings, payload);
      let currentLevel: {
        name: 'water_level' | 'battery_voltage' | undefined;
        value: string;
        time: string;
      }[] = [];
      /* ↓↓这里来不及对应一次获得所有设备最新数据的接口，暂时做成每个设备调用一次接口↓↓ */
      const TimeDiff =
        new Date(dateTime()).getTime() -
        new Date(dateTime({ local: false })).getTime(); /* 获得当前时区与UTC时区时间差 */
      for (let idx: number = 0; idx < thingList.things.length; idx++) {
        if (thingList.things[idx].metadata.type === 'manhole') {
          currentLevel = yield call(getChannels, {
            publisher: thingList.things[idx].id,
            startTime: dateTime({ date: UTCTimeFourHourAgo }),
            endTime: dateTime({ date: UTCTimeNow }),
          });
          if (currentLevel.length >= 2) {
            thingList.things[idx].metadata.reporting.water_level.current = parseFloat(
              currentLevel[currentLevel.length - 1].value,
            );
            thingList.things[idx].metadata.reporting.batteryVoltage = parseFloat(
              currentLevel[currentLevel.length - 2].value,
            );
            const UpdateTimeUTC = new Date(currentLevel[currentLevel.length - 1].time);
            const UpdateTimeLocal = new Date(UpdateTimeUTC.getTime() + TimeDiff); /* 时区转换 */
            thingList.things[idx].metadata.reporting.updateTime = dateTime({
              date: UpdateTimeLocal,
            });
          }
        }
      }
      /* ↑↑这里来不及对应一次获得所有设备最新数据的接口，暂时做成每个设备调用一次接口↑↑ */
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
      const startTimeUTC = new Date(new Date(payload.timeRange.startTime).getTime() - TimeDiff);
      const endTimeUTC = new Date(new Date(payload.timeRange.endTime).getTime() - TimeDiff);
      const params = {
        publisher: payload.stationId,
        startTime: dateTime({ date: startTimeUTC }),
        endTime: dateTime({ date: endTimeUTC }),
      };
      const response = yield call(getChannels, params);
      for (let idx: number = 0; idx < response.length; idx++) {
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
