export interface IMetaData {
  device: string;
  name: string;
  type: string; /* ???�^ */
  location: {
    address: string; /* �n�� */
    gps: {  /* GPS��? */
      latitude: number;
      longitude: number;
    };
  };
  reporting: {
    updateTime: string; /* �����X�V?? */
    batteryVoltage: number; /* ?�r?? */
    pump_current: number; /* ��??�� */
    pump_status: number; /* ��?��? */
    water_level: { /* ���ʐM�� */
      current: number; /* ���O���� */
      critical: number; /* ?�}���� */
      depth: number; /* �[�x */
      overflow: number; /* ?�쐅�� */
      warning: number; /* �x?���� */
    };
  };
  pump_ctrl: { /* ?⋓ƗL�I��?�T���M�� */
    pump_number: number;
    control_channel: string;
    auto_control: boolean;
  }
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
    mean: number;
  }[];
  histogram: {
    le: string;
    value: number;
  }[];
  historyLevelOfTiangu: {
    time: string;
    mean: number;
  }[];
  PumpStatus: {
    time: string;
    max: number;
  }[];

  pumpCurrent: {
    time: string;
    mean: number;
  }[];
  newPumpStatus: {
    time: string;
    max: number;
  }[];
  newWaterLevel: {
    time: string;
    mean: number;
  }[];
  newWaterLevelTIANGU: {
    time: string;
    mean: number;
  }[];
}

export interface IAnalysisData {
  stationsData: IStationsList;
  selectedThing: IThing | null;
  stationDetailData: IStationDetailData;
  TIANGU: number;
}
