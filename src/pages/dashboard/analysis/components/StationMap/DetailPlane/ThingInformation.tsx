import React, { Component } from 'react';
import { Row, Col, DatePicker, Tabs } from 'antd';
import moment from 'moment';
import Charts from '../../Charts';
import { IStationDetailData, IThing } from '@/pages/dashboard/analysis/data';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TimelineChart, Bar } = Charts;
const dateFormat = 'YYYY-MM-DD' || undefined;

interface ThingInformationProps {
  SelectedThing: IThing;
  stationDetailData: IStationDetailData;
  FetchStationDetail: Function;
}

interface ThingInformationState {
  stTimeRange: { startTime: string | undefined; endTime: string | undefined };
  stShowTimeValueRange: { startValue: string | undefined; endValue: string | undefined };
}

class ThingInformation extends Component<ThingInformationProps, ThingInformationState> {
  state: ThingInformationState = {
    stTimeRange: { startTime: undefined, endTime: undefined },
    stShowTimeValueRange: { startValue: undefined, endValue: undefined },
  };

  constructor(props: ThingInformationProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  /* 在加载组件的时候获取当天的液位趋势 */
  componentWillMount() {
    const { SelectedThing, FetchStationDetail } = this.props;
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
    this.setState({
      stTimeRange: { startTime, endTime },
    });
    if (SelectedThing)
      FetchStationDetail({
        stationId: SelectedThing.id,
        timeRange: { startTime, endTime },
      });
  }
  componentDidMount() {}
  componentWillUpdate() {}
  /* 在选中的设备改变时重新获得液位趋势 */
  componentDidUpdate(prevProps: ThingInformationProps, prevState: ThingInformationState) {
    const { SelectedThing, FetchStationDetail } = this.props;
    const { stTimeRange } = this.state;
    if (
      SelectedThing &&
      (!prevProps.SelectedThing || SelectedThing.id !== prevProps.SelectedThing.id)
    ) {
      FetchStationDetail({
        stationId: SelectedThing.id,
        timeRange: { startTime: stTimeRange.startTime, endTime: stTimeRange.endTime },
      });
    }
  }
  /* 在组件的时间选择更新时重新获得液位趋势 */
  FetchData = (data: any, dateString: string[]) => {
    const { SelectedThing, FetchStationDetail } = this.props;
    this.setState({
      stTimeRange: { startTime: dateString[0], endTime: dateString[1] },
    });
    if (SelectedThing)
      FetchStationDetail({
        stationId: SelectedThing.id,
        timeRange: { startTime: dateString[0], endTime: dateString[1] },
      });
  };

  render() {
    const { SelectedThing, stationDetailData } = this.props;
    const { stTimeRange } = this.state;
    const chartData: { x: number; y1: number; max: number }[] = [];
    const barData: { x: string; y: number }[] = [];
    for (let idx: number = 0; idx < stationDetailData.historyLevel.length; idx++) {
      chartData.push({
        x: new Date(stationDetailData.historyLevel[idx].time).getTime(),
        y1: parseFloat(stationDetailData.historyLevel[idx].mean),
        max: SelectedThing.metadata.reporting.water_level.warning,
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
