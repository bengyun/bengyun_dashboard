import { query } from '@/services/station';
import { fakeStationData } from '@/services/api';
import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface IStation {
  id: string;
  name: string;
  key: string;
  metadata: Object;
}

export interface StationModelState {
  total: number;
  offset: number;
  limit: number;
  stations: IStation[];
}

export interface StationModelType {
  namespace: string;
  state: StationModelState;
  effects: {
    fetchStationData: Effect;
  };
  reducers: {
    save: Reducer<StationModelState>;
    clear: Reducer<StationModelState>;
  };
}

const Model: StationModelType = {
  namespace: 'station',

  state: {
    total: 0,
    offset: 0,
    limit: 0,
    stations: [],
  },

  effects: {
    *fetchStationData(_, { call, put }) {
      const response = yield call(fakeStationData);
      yield put({
        type: 'save',
        payload: response,
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
        total: 0,
        offset: 0,
        limit: 0,
        stations: [],
      };
    },
  },
};

export default Model;
