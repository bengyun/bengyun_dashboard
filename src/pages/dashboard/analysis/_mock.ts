import moment from 'moment';
import { IAnalysisData, IPumpStatu, IpumpMaintain, IStationsList } from './data';

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
      id: '3ffb3880-d1e6-4edd-acd9-4294d013f35b',
      name: '郎家坪泵站',
      key: 'b1996995-237a-4552-94b2-83ec2e92a040',
      metadata: {
        currLevel: 50,
        rateLevel: 75,
        maxLevel: 100,
        address: '浙江省宁波市镇海区环湖西路168号',
        pumps: [],
        position: {
          longitude: 121.512097,
          latitude: 30.049444,
        },
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1e',
      name: '河横路牌楼泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebe8',
      metadata: {
        currLevel: 75,
        rateLevel: 75,
        maxLevel: 100,
        address: '浙江省宁波市镇海区王岙巷2',
        pumps: [
          {
            name: '',
            power: '',
            lift: '',
            flow: '',
          },
          {
            name: '',
            power: '',
            lift: '',
            flow: '',
          },
        ],
        position: {
          longitude: 121.553233,
          latitude: 30.031005,
        },
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1f',
      name: '田顾西泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebe9',
      metadata: {
        currLevel: 85,
        rateLevel: 75,
        maxLevel: 100,
        address: '浙江省宁波市镇海区西河路1号',
        pumps: [
          {
            name: '350QZB-70',
            power: '18.5KW',
            lift: '5m',
            flow: 'null',
          },
          {
            name: '350QZB-70',
            power: '18.5KW',
            lift: '5m',
            flow: 'null',
          },
        ],
        position: {
          longitude: 121.546947,
          latitude: 30.005627,
        },
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1g',
      name: '西河泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebea',
      metadata: {
        currLevel: 100,
        rateLevel: 75,
        maxLevel: 100,
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
      },
    },
    {
      id: '94d166d6-6477-43dc-93b7-5c3707dbef1e',
      name: '三星泵站',
      key: 'e4588a68-6028-4740-9f12-c356796aebeb',
      metadata: {
        currLevel: 125,
        rateLevel: 75,
        maxLevel: 100,
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

const getFakeStationsData: IStationsList = {
  stationsData,
};

function getFakeStationDetailData(req, res) {
  const params = req.query;
  const { stationId, stationDetailDataRange } = params;

  res.send({
    stationId: stationId,
    stationDetailDataRange: stationDetailDataRange,
    historyLevel: [
      { x: '2019-06-01', y: 2 },
      { x: '2019-06-02', y: 1 },
      { x: '2019-06-03', y: 6 },
      { x: '2019-06-04', y: 5 },
      { x: '2019-06-05', y: 4 },
      { x: '2019-06-06', y: 3 },
      { x: '2019-06-07', y: 7 },
      { x: '2019-06-08', y: 2 },
      { x: '2019-06-09', y: 8 },
      { x: '2019-06-10', y: 5 },
      { x: '2019-06-11', y: 1 },
      { x: '2019-06-12', y: 2 },
    ],
  });
}

export default {
  'GET  /api/data': getFakeData,
  'GET  /api/stationsData': getFakeStationsData,
  'GET  /api/pumpStatus': getFakePumpStatus,
  'GET  /api/pumpMaintain': getFakePumpMaintain,
  'GET  /api/pumpPower': getFakePumpPower,
  'GET  /api/StationDetailData': getFakeStationDetailData,
};
