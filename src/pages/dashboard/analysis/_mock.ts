import moment from 'moment';
import { IAnalysisData, IPumpStatu, IpumpMaintain, IStationsList } from './data';

const DataTime = [];
const DateNow = new Date();
// 时间间隔4小时，一天6条，30天180条，随机生成240天的液位
for (let idx = 0; idx < 1440; idx++) {
  const YYYY = DateNow.getFullYear();
  const MM = DateNow.getMonth() + 1;
  const DD = DateNow.getDate();
  const HH = DateNow.getHours();
  const mm = DateNow.getMinutes();
  const ss = DateNow.getSeconds();
  DataTime.push(YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss);
  DateNow.setTime(DateNow.getTime() - 4 * 60 * 60 * 1000);
}

// mock data
const pumpStatus: IPumpStatu = {
  working: 50,
  total: 100,
  runtime: 600,
};

const pumpMaintain: IpumpMaintain = {
  breakdownPump: 50,
  breakEveryDay: [
    { x: '周日', y: 2 },
    { x: '周一', y: 3 },
    { x: '周二', y: 1 },
    { x: '周三', y: 0 },
    { x: '周四', y: 3 },
    { x: '周五', y: 2 },
    { x: '周六', y: 5 },
  ],
  repairEveryDay: [
    { x: '周日', y: 3 },
    { x: '周一', y: 2 },
    { x: '周二', y: 3 },
    { x: '周三', y: 5 },
    { x: '周四', y: 1 },
    { x: '周五', y: 2 },
    { x: '周六', y: 4 },
  ],
  repairPump: 3,
};

const pumpPower: IPumpPower = {
  currentPower: 56,
  trendPower: [
    { x: '周日', y: 45 },
    { x: '周一', y: 48 },
    { x: '周二', y: 43 },
    { x: '周三', y: 35 },
    { x: '周四', y: 67 },
    { x: '周五', y: 52 },
    { x: '周六', y: 44 },
  ],
  totalPower: 70,
};

const stationsData: IStationsList = {
  total: 5,
  offset: 0,
  limit: 10,
  stations: [
    {
      id: '3ffb3880-d1e6-4edd-acd9-4294123aff5b',
      name: '环湖路窨井1',
      key: 'b1996995-237a-4552-94b2-4294123aff5b',
      metadata: {
        address: '浙江省宁波市镇海区环湖西路169号',
        pumps: [],
        position: {
          longitude: 121.514097,
          latitude: 30.039444,
        },
        region: ['zhejiang', 'ningbo', 'jiulonghu'],
        level: 50,
        alarmLevel: 0,
        voltage: 210,
        dataUpdateTime: DataTime[0],
      },
    },
    {
      id: '3ffb3880-d1e6-4edd-acd9-4294123aff5c',
      name: '环湖路窨井2',
      key: 'b1996995-237a-4552-94b2-4294123aff5c',
      metadata: {
        address: '浙江省宁波市镇海区环湖西路170号',
        pumps: [],
        position: {
          longitude: 121.534097,
          latitude: 30.039664,
        },
        region: ['zhejiang', 'ningbo', 'jiulonghu'],
        level: 50,
        alarmLevel: 0,
        voltage: 210,
        dataUpdateTime: DataTime[0],
      },
    },
    {
      id: '3ffb3880-d1e6-4edd-acd9-4294d013f35b',
      name: '郎家坪泵站',
      key: 'b1996995-237a-4552-94b2-83ec2e92a040',
      metadata: {
        address: '浙江省宁波市镇海区环湖西路168号',
        pumps: [],
        position: {
          longitude: 121.512097,
          latitude: 30.049444,
        },
        region: ['zhejiang', 'ningbo', 'jiulonghu'],
        level: 50,
        alarmLevel: 1,
        voltage: 210,
        dataUpdateTime: DataTime[2],
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1e',
      name: '河横路牌楼泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebe8',
      metadata: {
        address: '浙江省宁波市镇海区王岙巷2',
        pumps: [
          {
            name: '-',
            power: '-',
            lift: '-',
            flow: '-',
          },
          {
            name: '-',
            power: '-',
            lift: '-',
            flow: '-',
          },
        ],
        position: {
          longitude: 121.553233,
          latitude: 30.031005,
        },
        region: ['zhejiang', 'ningbo', 'jiulonghu'],
        level: 75,
        alarmLevel: 2,
        voltage: 230,
        dataUpdateTime: DataTime[1],
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1f',
      name: '田顾西泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebe9',
      metadata: {
        address: '浙江省宁波市镇海区西河路1号',
        pumps: [
          {
            name: '350QZB-70',
            power: '18.5KW',
            lift: '5m',
            flow: '-',
          },
          {
            name: '350QZB-70',
            power: '18.5KW',
            lift: '5m',
            flow: '-',
          },
        ],
        position: {
          longitude: 121.546947,
          latitude: 30.005627,
        },
        region: ['zhejiang', 'ningbo', 'luotuo'],
        level: 85,
        alarmLevel: 0,
        voltage: 240,
        dataUpdateTime: DataTime[0],
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1g',
      name: '西河泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebea',
      metadata: {
        address: '浙江省宁波市镇海区九龙大道2208号',
        pumps: [
          {
            name: '100WQ130-15-11',
            power: '11KW',
            lift: '15m',
            flow: '130m3/h',
          },
          {
            name: '100WQ130-15-11',
            power: '11KW',
            lift: '15m',
            flow: '130m3/h',
          },
          {
            name: '100WQ130-15-11',
            power: '11KW',
            lift: '15m',
            flow: '130m3/h',
          },
        ],
        position: {
          longitude: 121.555785,
          latitude: 30.022581,
        },
        region: ['zhejiang', 'ningbo', 'jiulonghu'],
        level: 100,
        alarmLevel: 1,
        voltage: 220,
        dataUpdateTime: DataTime[0],
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1h',
      name: '三星泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebeb',
      metadata: {
        address: '浙江省宁波市镇海区荣吉路836',
        pumps: [
          {
            name: '150JYWQ150-10-7.5',
            power: '7.5KW',
            lift: ' 11m',
            flow: '130m3/h',
          },
          {
            name: '150JYWQ150-10-7.5',
            power: '7.5KW',
            lift: '11m',
            flow: '130m3/h',
          },
          {
            name: '150JYWQ150-10-7.5',
            power: '7.5KW',
            lift: '11m',
            flow: '130m3/h',
          },
        ],
        position: {
          longitude: 121.568672,
          latitude: 29.972112,
        },
        region: ['zhejiang', 'ningbo', 'luotuo'],
        level: 125,
        alarmLevel: 2,
        voltage: 200,
        dataUpdateTime: DataTime[0],
      },
    },
  ],
};

const getFakeData: IAnalysisData = {
  pumpStatus,
  pumpMaintain,
  pumpPower,
  stationsData,
};

const getFakePumpStatus: IPumpStatu = {
  pumpStatus,
};

const getFakePumpMaintain: IPumpMaintain = {
  pumpMaintain,
};

const getFakePumpPower: IPumpPower = {
  pumpPower,
};

function getFakeStationsData(req, res) {
  const params = req.query;
  const { region } = params;

  if (region === undefined) {
    res.send(stationsData);
  } else {
    const regionArray = JSON.parse(region);
    const data = { stations: [] };
    for (let idx = 0; idx < stationsData.stations.length; idx++) {
      if (
        (stationsData.stations[idx].metadata.region[0] === regionArray[0] ||
          regionArray[0] === 'all') &&
        (stationsData.stations[idx].metadata.region[1] === regionArray[1] ||
          regionArray[1] === 'all') &&
        (stationsData.stations[idx].metadata.region[2] === regionArray[2] ||
          regionArray[2] === 'all')
      ) {
        data.stations.push(stationsData.stations[idx]);
      }
    }
    data.total = data.stations.length;
    res.send(data);
  }
}

const createHistoryLevel = () => {
  const historyLevel = [];
  for (let idx = DataTime.length - 1; idx >= 0; idx--) {
    historyLevel.push({ x: DataTime[idx], y: Math.random() * 5 + 5 });
  }
  return historyLevel;
};

const fakeStationDetailData = [
  {
    stationId: '3ffb3880-d1e6-4edd-acd9-4294123aff5b',
    historyLevel: createHistoryLevel(),
  },
  {
    stationId: '3ffb3880-d1e6-4edd-acd9-4294123aff5c',
    historyLevel: createHistoryLevel(),
  },
  {
    stationId: '3ffb3880-d1e6-4edd-acd9-4294d013f35b',
    historyLevel: createHistoryLevel(),
  },
  {
    stationId: '94d166d6-6477-43dc-93b7-5c3707dbef1e',
    historyLevel: createHistoryLevel(),
  },
  {
    stationId: '94d166d6-6477-43dc-93b7-5c3707dbef1f',
    historyLevel: createHistoryLevel(),
  },
  {
    stationId: '94d166d6-6477-43dc-93b7-5c3707dbef1g',
    historyLevel: createHistoryLevel(),
  },
  {
    stationId: '94d166d6-6477-43dc-93b7-5c3707dbef1h',
    historyLevel: createHistoryLevel(),
  },
];

function getFakeStationDetailData(req, res) {
  const params = req.query;
  const { stationId, timeRange } = params;

  let targetStation = null;
  for (let idx = 0; idx < fakeStationDetailData.length; idx++) {
    if (fakeStationDetailData[idx].stationId === stationId)
      targetStation = fakeStationDetailData[idx];
  }
  if (targetStation === null) {
    res.send(null);
  } else {
    const historyLevel = [];
    const startTime = new Date(timeRange.startTime.replace(/-/g, '/')).getTime();
    const endTime = new Date(timeRange.endTime.replace(/-/g, '/')).getTime();
    for (let idx = 0; idx < targetStation.historyLevel.length; idx++) {
      const dataTime = new Date(targetStation.historyLevel[idx].x.replace(/-/g, '/')).getTime();
      if (dataTime >= startTime && dataTime <= endTime) {
        historyLevel.push(targetStation.historyLevel[idx]);
      }
    }
    res.send({
      historyLevel: historyLevel,
    });
  }
}

export default {
  'GET  /api/data': getFakeData,
  'GET  /api/stationsData': getFakeStationsData,
  'GET  /api/pumpStatus': getFakePumpStatus,
  'GET  /api/pumpMaintain': getFakePumpMaintain,
  'GET  /api/pumpPower': getFakePumpPower,
  'GET  /api/StationDetailData': getFakeStationDetailData,
};
