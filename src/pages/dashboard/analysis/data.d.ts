export interface IMetaData {
  device: string;
  name: string;
  type: string;
  location: {
    address: string;
    gps: {
      latitude: number;
      longitude: number;
    };
  };
  reporting: {
    updateTime: string | undefined;
    batteryVoltage: number | undefined;
    water_level: {
      current: number | undefined;
      critical: number;
      depth: number;
      overflow: number;
      warning: number;
    };
  };
}

export interface IThing {
  id: string;
  name: string;
  key: string;
  metadata: IMetaData;
}

export interface IStationsList {
  total: number;
  offset: number;
  limit: number;
  things: IThing[];
}

export interface IStationDetailData {
  historyLevel: {
    name: 'water_level' | 'battery_voltage' | undefined;
    time: string;
    value: string;
  }[];
}

export interface IAnalysisData {
  stationsData: IStationsList;
  stationDetailData: IStationDetailData;
}
