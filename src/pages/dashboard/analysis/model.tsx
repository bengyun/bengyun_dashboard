import { fakeChartData, getPumpStatus, getStationsData, getPumpPower, getPumpMaintain } from './service';
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
    fetchPumpStatus:Effect;
    fetchPumpMaintain:Effect;
    fetchPumpPower:Effect;
    fetchStationsData:Effect;
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
    *fetchStationsData(_, { call, put }) {
      const response = yield call(getStationsData);
      yield put({
        type: 'save',
        payload: {
          stationsData: response.stationsData,
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
        pumpStatus: {},
        pumpMaintain: {},
        stationsData: {},
      };
    },
  },
};

export default Model;
