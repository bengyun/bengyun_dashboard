export interface IPumpStatu {
  working: int;
  total: int;
  runtime: int;
}

export interface IpumpMaintain {
  breakdownPump: int;
  breakEveryDay: [];
  repairEveryDay: [];
  repairPump: int;
}

export interface IPumpPower     {
  currentPower: int;
  trendPower: [];
  totalPower: int;
};

export interface IStation {
  id: string;
  name: string;
  key: string;
  metadata: Object;
}

export interface IStationsList {
  total: number;
  offset: number;
  limit: number;
  stations: IStation[];
}

export interface IAnalysisData {
  pumpStatus: IPumpStatu;
  pumpMaintain : IpumpMaintain;
  stationsData: IStationsList;
  pumpPower: I    ;
}
