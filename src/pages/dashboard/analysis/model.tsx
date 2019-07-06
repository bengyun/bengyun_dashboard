import {
  fakeChartData,
  getPumpStatus,
  getStationsData,
  getPumpPower,
  getPumpMaintain,
  getStationDetailData,
} from './service';
import { IAnalysisData } from './data';
import { Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: IAnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: IAnalysisData;
  effects: {
    fetchPumpStatus: Effect;
    fetchPumpMaintain: Effect;
    fetchPumpPower: Effect;
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
    pumpStatus: {},
    pumpMaintain: {},
    pumpPower: {},
    stationsData: {},
    stationDetailData: {},
  },

  effects: {
    *fetchPumpStatus(_, { call, put }) {
      const response = yield call(getPumpStatus);
      yield put({
        type: 'save',
        payload: {
          pumpStatus: response.pumpStatus,
        },
      });
    },
    *fetchPumpMaintain(_, { call, put }) {
      const response = yield call(getPumpMaintain);
      yield put({
        type: 'save',
        payload: {
          pumpMaintain: response.pumpMaintain,
        },
      });
    },
    *fetchPumpPower(_, { call, put }) {
      const response = yield call(getPumpPower);
      yield put({
        type: 'save',
        payload: {
          pumpPower: response.pumpPower,
        },
      });
    },
    *fetchStationsData({ payload }, { call, put }) {
      const response = yield call(getStationsData, payload);
      yield put({
        type: 'save',
        payload: {
          stationsData: response,
        },
      });
    },
    *fetchStationDetailData({ payload }, { call, put }) {
      const response = yield call(getStationDetailData, payload);
      yield put({
        type: 'save',
        payload: {
          stationDetailData: response,
        },
      });
    },
    *clearStationDetailData(_, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          stationDetailData: {},
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
    clear(state, { payload }) {
      return {
        pumpStatus: {},
        pumpMaintain: {},
        pumpPower: {},
        stationsData: {},
        stationDetailData: {},
      };
    },
  },
};

export default Model;
