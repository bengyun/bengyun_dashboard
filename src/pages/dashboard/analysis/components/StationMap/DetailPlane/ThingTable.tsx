import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import styles from './index.less';
import { IAnalysisData, IStationsList, IThing } from '@/pages/dashboard/analysis/data';
import { connect } from 'dva';

interface ThingListProps {
  dashboardAnalysis?: IAnalysisData;
  onDetailButtonClick?: Function /* 设置选中设备 */;
  onReturnClick?: Function /* 返回主菜单 */;
}

interface ThingListState {}

const ThingTableStyle = {
  top: '30px',
  bottom: 0,
  width: '100%',
  background: 'white',
  border: '1px solid #eee',
  paddingTop: 5,
  paddingLeft: 5,
  paddingRight: 5,
};

@connect(
  ({
     dashboardAnalysis,
   }: {
    dashboardAnalysis: IAnalysisData;
  }) => ({
    dashboardAnalysis,
  }),
)
class ThingList extends Component<ThingListProps, ThingListState> {
  state: ThingListState = {};

  constructor(props: ThingListProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }
  /* 当点击设备(Thing)列表的某一项时候，将其设为选中设备(Thing) */
  onItemClick = (station: IThing) => {
    const { onDetailButtonClick = () => {} } = this.props;
    onDetailButtonClick(station);
  };
  /* 根据筛选条件筛选显示的设备(Thing) */
  filterListItem = (stationsData: IStationsList) => {
    const res = [];
    for (let i = 0; i < stationsData.things.length; i++) {
      const stationData = stationsData.things[i];
      if (stationData.metadata.location === undefined) continue;
      /*
      const stationData = stationsData.things[i];
      const metadata = stationData.metadata;
      const dataUpdateTimeStri = metadata.dataUpdateTime;
      const dataUpdateTimeDate = new Date(dataUpdateTimeStri.replace(/-/g, '/')).getTime();
      const fourHourBeforeDate = Date.now() - 1000 * 60 * 60 * 4;
      const Online = dataUpdateTimeDate >= fourHourBeforeDate;
      const Alarm = metadata.alarmLevel > 0;

      //Filter
      //OnlineFilter
      if (OnlineFilterCurState.Online === false && Online === true) continue;
      if (OnlineFilterCurState.Offline === false && Online === false) continue;
      //AlarmFilter
      if (AlarmFilterCurState.Normal === false && Alarm === false) continue;
      if (AlarmFilterCurState.Alarm === false && Alarm === true) continue;
      */
      /* 暂时无效了筛选功能 */ res.push(stationData);
    }
    return res;
  };

  /* 显示组件 */
  render() {
    const {
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined },
      onReturnClick = () => {},
    } = this.props;
    const {
      stationsData,
    } = dashboardAnalysis;
    let things: IThing[] = [];
    /* 对设备(Thing)信息进行筛选 */
    if (stationsData !== undefined) things = this.filterListItem(stationsData);

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: number) => {
          const color = status === 0 ? 'gray' :  status === 1 ? 'green' : status === 2 ? 'orange' : status === 3 ? 'red' : 'gray';
          const name = status === 0 ? '离线' :  status === 1 ? '运行' : status === 2 ? '预警' : status === 3 ? '警报' : '离线';
          return (<span style={{color: color}}>{name}</span>)
        },
      },
      {
        title: '液位',
        dataIndex: 'waterLevel',
        key: 'waterLevel',
        render: ({waterLevel, status}: {waterLevel: number, status: number}) => {
          const color = status === 0 ? 'gray' :  status === 1 ? 'green' : status === 2 ? 'orange' : status === 3 ? 'red' : 'gray';
          return (<span style={{color: color}}>{waterLevel}</span>)
        },
      },
      {
        title: '信息更新时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
      },
    ];
    const data = [];
    for (let idx = 0; idx < things.length; idx++) {
      const thing: IThing = things[idx];

      const typeEN = thing.metadata.type;
      const type = typeEN === 'pump_station' ? '泵站' : typeEN === 'manhole' ? '窨井' : '其他';

      const waterLevelOrigin = thing.metadata.reporting.water_level.current;
      const waterLevel = isNaN(waterLevelOrigin) ? '-' : waterLevelOrigin;

      const criticalLevel = thing.metadata.reporting.water_level.critical;
      const warningLevel = thing.metadata.reporting.water_level.warning;

      let status = 0;
      const updateTime = thing.metadata.reporting.updateTime;
      if (new Date().getTime() - new Date(updateTime).getTime() > 24 * 60 * 60 * 1000) {
        status = 0;
      } else if (waterLevel < warningLevel) {
        status = 1;
      } else if (waterLevel < criticalLevel) {
        status = 2;
      } else {
        status = 3;
      }

      data.push({
        key: idx,
        name: thing.name,
        address: thing.metadata.location.address,
        type: type,
        status: status,
        waterLevel: {waterLevel, status},
        updateTime: thing.metadata.reporting.updateTime,
        thing: thing,
      });
    }
    data.sort((a: any, b: any) => {
      return b.status - a.status;
    });

    return (
      <>
        <div
          className={styles.ReturnToMenu}
          onClick={() => {
            onReturnClick('FunctionMenu');
          }}
        >
          返回菜单 <Icon type="rollback" />
        </div>
        <div style={{ ...ThingTableStyle, position: 'absolute' }}>
          <Table
            onRow={(record) => {
              return {
                onClick: () => {
                  this.onItemClick(record.thing);
                },
              };
            }}
            columns={columns}
            dataSource={data}
          />
        </div>
      </>
    );
  }
}

export default ThingList;
