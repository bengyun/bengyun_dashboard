import React, { Component } from 'react';
import { Row, Col, DatePicker, Tabs } from 'antd';
import moment from 'moment';
import Charts from '../../Charts';
import { Dispatch } from 'redux';
import { IAnalysisData, IThing } from '@/pages/dashboard/analysis/data';
import { connect } from 'dva';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TimelineChart, Bar } = Charts;
const dateFormat = 'YYYY-MM-DD' || undefined;

interface ThingInformationProps {
  dashboardAnalysis?: IAnalysisData;
  dispatch?: Dispatch<any>;
  SelectedThing: IThing | null;
}

interface ThingInformationState {
  stTimeRange: { startTime: string | undefined; endTime: string | undefined };
  stShowTimeValueRange: { startValue: string | undefined; endValue: string | undefined };
}

@connect(
  ({
     dashboardAnalysis,
   }: {
    dashboardAnalysis: IAnalysisData;
  }) => ({
    dashboardAnalysis,
  }),
)
class ThingInformation extends Component<ThingInformationProps, ThingInformationState> {
  state: ThingInformationState = {
    stTimeRange: { startTime: undefined, endTime: undefined },
    stShowTimeValueRange: { startValue: undefined, endValue: undefined },
  };
  /* 在加载组件的时候获取当天的液位趋势 */
  constructor(props: ThingInformationProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
    const { SelectedThing } = this.props;
    const { stTimeRange } = this.state;
    let { startTime, endTime } = stTimeRange;
    if (startTime === undefined || endTime === undefined) {
      const DateNow = new Date();
      const YYYY = DateNow.getFullYear();
      const MM = DateNow.getMonth() + 1;
      const DD = DateNow.getDate();
      const HH = DateNow.getHours();
      const mm = DateNow.getMinutes();
      const ss = DateNow.getSeconds();
      endTime = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;
      startTime = YYYY + '-' + MM + '-' + DD + ' 00:00:00';
    }
    this.state.stTimeRange = { startTime, endTime };
    if (SelectedThing) this.FetchStationDetail([startTime, endTime]);
  }
  /* 在选中的设备改变时重新获得液位趋势 */
  componentDidUpdate(prevProps: ThingInformationProps, prevState: ThingInformationState) {
    const { SelectedThing } = this.props;
    const { stTimeRange } = this.state;
    if (
      SelectedThing && /* 选中的设备(Thing)存在 且 */
      (!prevProps.SelectedThing || /* 选中的设备(Thing)从无到有 或 */
        SelectedThing.id !== prevProps.SelectedThing.id) /* 选中的设备(Thing)改变 */
    ) {
      /* 触发模型更新数据，景改变thing_id，时间区间不改变 */
      this.FetchStationDetail([stTimeRange.startTime, stTimeRange.endTime]);
    }
  }
  /* 触发模型更新历史数据 */
  FetchStationDetail = (dateString: (string | undefined)[]) => {
    const { SelectedThing, dispatch } = this.props;
    if ((SelectedThing) && (dispatch) && (dateString[0] !== undefined) && (dateString[1] !== undefined)) dispatch({
      type: 'dashboardAnalysis/fetchStationDetailData',
      payload: {
        stationId: SelectedThing.id,
        timeRange: { startTime: dateString[0], endTime: dateString[1] },
      },
    });
  };
  /* 在组件的时间选择更新时重新获得液位趋势 */
  FetchData = (data: any, dateString: string[]) => {
    this.setState({
      stTimeRange: { startTime: dateString[0], endTime: dateString[1] },
    });
    this.FetchStationDetail(dateString);
  };

  render() {
    const {
      SelectedThing,
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined },
    } = this.props;
    const {
      stationDetailData,
    } = dashboardAnalysis;
    if (stationDetailData === undefined) return null;
    const { stTimeRange } = this.state;
    const chartData: { x: number; y1: number; max: number }[] = [];
    const barData: { x: string; y: number }[] = [];
    for (let idx: number = 0; idx < stationDetailData.historyLevel.length; idx++) {
      chartData.push({
        x: new Date(stationDetailData.historyLevel[idx].time).getTime(),
        y1: parseFloat(stationDetailData.historyLevel[idx].mean),
        max: SelectedThing ? SelectedThing.metadata.reporting.water_level.warning : 0,
      });
    }
    for (let idx: number = 0; idx < stationDetailData.histogram.length; idx++) {
      barData.push({
        x: stationDetailData.histogram[idx].le,
        y: stationDetailData.histogram[idx].value,
      });
    }
    if (SelectedThing === null) return null;
    return (
      <div style={{ backgroundColor: 'white', border: '1px solid #DDD' }}>
        <div
          style={{
            padding: '10px',
            textAlign: 'center',
            fontSize: '18px',
            borderBottom: '1px solid #DDD',
          }}
        >
          {SelectedThing.name}
        </div>
        <div style={{ marginTop: '10px', backgroundColor: 'white', textAlign: 'center' }}>
          <RangePicker
            onChange={this.FetchData}
            value={
              stTimeRange.startTime === undefined || stTimeRange.endTime === undefined
                ? [undefined, undefined]
                : [
                    moment(stTimeRange.startTime, dateFormat),
                    moment(stTimeRange.endTime, dateFormat),
                  ]
            }
            format={dateFormat}
            placeholder={['开始时间', '结束时间']}
          />
        </div>
        <Row style={{ borderBottom: '1px solid #EEE' }}>
          <Col span={24}>
            <Tabs defaultActiveKey="1" tabPosition="bottom">
              <TabPane tab="液位趋势" key="1">
                <TimelineChart
                  height={240}
                  data={chartData}
                  titleMap={{ y1: '液位变化趋势', max: '液位上限' }}
                  title
                />
              </TabPane>
              <TabPane tab="液位分布" key="2">
                <Bar height={250} data={barData} title />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: '10px',
            borderBottom: '1px solid #EEE',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          <Col span={6} offset={2}>
            最新液位：
          </Col>
          <Col span={16}>{SelectedThing.metadata.reporting.water_level.current} CM</Col>
        </Row>
        <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
          <Col span={6} offset={2}>
            更新时间：
          </Col>
          <Col span={16}>{SelectedThing.metadata.reporting.updateTime}</Col>
        </Row>
        <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
          <Col span={6} offset={2}>
            窨井深度：
          </Col>
          <Col span={16}>{SelectedThing.metadata.reporting.water_level.depth} CM</Col>
        </Row>
        <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
          <Col span={6} offset={2}>
            电池电压：
          </Col>
          <Col span={16}>{SelectedThing.metadata.reporting.batteryVoltage} V</Col>
        </Row>
        <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
          <Col span={6} offset={2}>
            设备型号：
          </Col>
          <Col span={16}>{SelectedThing.metadata.device}</Col>
        </Row>
        <Row style={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Col span={6} offset={2}>
            设备地址：
          </Col>
          <Col span={16}>{SelectedThing.metadata.location.address}</Col>
        </Row>
      </div>
    );
  }
}

export default ThingInformation;
