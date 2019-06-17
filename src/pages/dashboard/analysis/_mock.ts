import moment from 'moment';
import { IVisitData, IRadarData, IAnalysisData, IThingsList } from './data';
import { getThings } from '@/services/api';

// mock data
const visitData: IVisitData[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: '家用电器',
    y: 4544,
  },
  {
    x: '食用酒水',
    y: 3321,
  },
  {
    x: '个护健康',
    y: 3113,
  },
  {
    x: '服饰箱包',
    y: 2341,
  },
  {
    x: '母婴产品',
    y: 1231,
  },
  {
    x: '其他',
    y: 1231,
  },
];

const salesTypeDataOnline = [
  {
    x: '家用电器',
    y: 244,
  },
  {
    x: '食用酒水',
    y: 321,
  },
  {
    x: '个护健康',
    y: 311,
  },
  {
    x: '服饰箱包',
    y: 41,
  },
  {
    x: '母婴产品',
    y: 121,
  },
  {
    x: '其他',
    y: 111,
  },
];

const salesTypeDataOffline = [
  {
    x: '家用电器',
    y: 99,
  },
  {
    x: '食用酒水',
    y: 188,
  },
  {
    x: '个护健康',
    y: 344,
  },
  {
    x: '服饰箱包',
    y: 255,
  },
  {
    x: '其他',
    y: 65,
  },
];

const offlineData = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

const radarData: IRadarData[] = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});

const getFakeChartData: IAnalysisData = {
  visitData,
  visitData2,
  salesData,
  searchData,
  offlineData,
  offlineChartData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
};

const getThings: IThingsList = {
  total: 5,
  offset: 0,
  limit: 10,
  things: [
    {
      id: "3ffb3880-d1e6-4edd-acd9-4294d013f35b",
      name: '郎家坪泵站',
      key: "b1996995-237a-4552-94b2-83ec2e92a040",
      metadata: {
        address: '浙江省宁波市镇海区环湖西路168号',
        pumps: ['无数据'],
        position: {
          longitude: 121.512097,
          latitude: 30.049444,
        }
      }
    },
    {
      id: "94d166d6-6477-43dc-93b7-5c3707dbef1e",
      name: "河横路牌楼泵站",
      key: "e4588a68-6028-4740-9f12-c356796aebe8",
      metadata: {
        address: '浙江省宁波市镇海区王岙巷2',
        pumps: ['1#泵', '2#泵'],
        position: {
          longitude: 121.553233,
          latitude: 30.031005,
        },
      }
    },
    {
      id: "94d166d6-6477-43dc-93b7-5c3707dbef1e",
      name: "田顾西泵站",
      key: "e4588a68-6028-4740-9f12-c356796aebe8",
      metadata: {
        address: '浙江省宁波市镇海区西河路1号',
        pumps: ['1#泵 350QZB-70 功率：18.5KW 扬程：5m', '2#泵：350QZB-70 功率：18.5KW 扬程：5m'],
        position: {
          longitude: 121.546947,
          latitude: 30.005627,
        },
      }
    },
    {
      id: "94d166d6-6477-43dc-93b7-5c3707dbef1e",
      name: "西河泵站",
      key: "e4588a68-6028-4740-9f12-c356796aebe8",
      metadata: {
        address: '浙江省宁波市镇海区九龙大道2208号',
        pumps: [
          '1#泵：100WQ130-15-11 功率：11KW 扬程：15m 流量：130m3/h',
          '2#泵：100WQ130-15-11 功率：11KW 扬程：15m 流量：130m3/h',
          '3#泵：100WQ130-15-11 功率：11KW 扬程：15m 流量：130m3/h',
        ],
        position: {
          longitude: 121.555785,
          latitude: 30.022581,
        },
      }
    },
    {
      id: "94d166d6-6477-43dc-93b7-5c3707dbef1e",
      name: "三星泵站",
      key: "e4588a68-6028-4740-9f12-c356796aebe8",
      metadata: {
        address: '浙江省宁波市镇海区荣吉路836',
        pumps: [
          '1#泵：150JYWQ150-10-7.5 功率：7.5KW 扬程：11m 流量：130m3/h',
          '2#泵：150JYWQ150-10-7.5 功率：7.5KW 扬程：11m 流量：130m3/h',
          '3#泵：150JYWQ150-10-7.5 功率：7.5KW 扬程：11m 流量：130m3/h',
        ],
        position: {
          longitude: 121.568672,
          latitude: 29.972112,
        }
      }
    },
  ]
};

export default {
  'GET  /api/fake_chart_data': getFakeChartData,
  'GET  /api/things': getThings,
};