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
    updateTime: string;
    batteryVoltage: number;
    water_level: {
      current: number;
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
    time: string;
    mean: string;
  }[];
}

export interface IAnalysisData {
  stationsData: IStationsList;
  stationDetailData: IStationDetailData;
}
