import React, { Component } from 'react';
import { Row, Col, DatePicker, Tabs, Switch, Modal, Icon, Popover } from 'antd';
import moment from 'moment';
import Charts from '../../Charts';
import { Dispatch } from 'redux';
import { IAnalysisData, IThing } from '@/pages/dashboard/analysis/data';
import { connect } from 'dva';
// @ts-ignore
import Websocket from 'react-websocket';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TimelineChart, TimelineChartMulti, TimelineChartMultiTemp, Bar } = Charts;
const dateFormat = 'YYYY-MM-DD' || undefined;

interface ThingInformationProps {
  dashboardAnalysis?: IAnalysisData;
  dispatch?: Dispatch<any>;
  SelectedThing: IThing | null;
}

interface ThingInformationState {
  stTimeRange: { startTime: string | undefined; endTime: string | undefined };
  stShowTimeValueRange: { startValue: string | undefined; endValue: string | undefined };
  stAutoControl: {
    pumpStation1: boolean;
    pumpStation2: boolean;
    pumpStation3: boolean;
    pumpStation4: boolean;
  };
  visible: boolean;
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
    stAutoControl: {
      pumpStation1: true,
      pumpStation2: true,
      pumpStation3: true,
      pumpStation4: true,
    },
    visible: false,
  };

  url: string = '';
  refWebSocket: any = null;
  // reqRef: number;
  /* 在加载组件的时候获取当天的液位趋势 */
  constructor(props: ThingInformationProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
    const { SelectedThing } = this.props;
    const { stTimeRange } = this.state;
    const { startTime, endTime } = stTimeRange;
    let endTimeS;
    let startTimeS;
    if (startTime === undefined || endTime === undefined) {
      const DateNow = new Date();
      const YYYY = DateNow.getFullYear();
      const MM = DateNow.getMonth() + 1;
      const DD = DateNow.getDate();
      const HH = DateNow.getHours();
      const mm = DateNow.getMinutes();
      const ss = DateNow.getSeconds();
      endTimeS = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;
      startTimeS = YYYY + '-' + MM + '-' + DD + ' 00:00:00';
    }
    this.state.stTimeRange = { startTime, endTime };
    if (SelectedThing) this.FetchStationDetail([startTimeS, endTimeS]);

    const channelId = '7030fe36-c8bb-4adf-8670-cd670acbf321'; /* 微服务控制频道 */
    const thingKey = '1033d3be-fffd-4ecb-94b1-51776a1cbb2b';
    this.url =
      'ws://121.41.1.169/ws/channels/' +
      channelId +
      '/messages?authorization=' +
      thingKey;

    /* 设定10秒更新1次站点(Thing)信息 */
    /* this.reqRef = window.setInterval(() => {
      this.AutoUpdate();
    }, 15000); */
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
        thingType: SelectedThing.metadata.type,
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
  /* 生成窨井 */
  RenderManHole = () => {
    const {
      SelectedThing,
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined},
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
        y1: stationDetailData.historyLevel[idx].mean,
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
              <TabPane tab="液位趋势" key="液位趋势">
                <TimelineChart
                  height={240}
                  data={chartData}
                  titleMap={{ y1: '液位变化趋势', max: '液位上限' }}
                  title
                />
              </TabPane>
              <TabPane tab="液位分布" key="液位分布">
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
  };
  handleData = (data: any) => {
    data = JSON.parse(data);
    if (data.type === 'report') {
      console.log(data);
      this.setState({
        stAutoControl: data.data,
      })
    }
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = (e: any) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  /* 生成泵站 */
  RenderPumpStation = () => {
    const {
      SelectedThing,
      dashboardAnalysis = {stationsData: undefined, stationDetailData: undefined, controlSocket: null},
    } = this.props;
    const {
      stationDetailData,
    } = dashboardAnalysis;
    if (stationDetailData === undefined) return null;
    if (SelectedThing === null) return null;
    const { stTimeRange } = this.state;
    const chartData: { x: number; y1: number; max: number; y2: number; switch1: number; switch2: number; switch3: number }[] = [];
    const currentData: { x: number; y1: number; max: number; y2: number; switch1: number; switch2: number; switch3: number }[] = [];
    const barData: { x: string; y: number }[] = [];
    for (let idx: number = 0; idx < stationDetailData.historyLevel.length; idx++) {
      chartData.push({
        x: new Date(stationDetailData.historyLevel[idx].time).getTime(),
        y1: Math.round(stationDetailData.historyLevel[idx].mean),
        max: SelectedThing ? SelectedThing.metadata.reporting.water_level.critical : 0,
        y2: Math.round(stationDetailData.historyLevelOfTiangu[idx].mean),
        switch1: Math.round(Math.round(stationDetailData.PumpStatus[idx].max) % 10),
        switch2: Math.round(Math.round(stationDetailData.PumpStatus[idx].max) / 10 % 10),
        switch3: Math.round(Math.round(stationDetailData.PumpStatus[idx].max / 100)),
      });
    }
    for (let idx: number = 0; idx < stationDetailData.histogram.length; idx++) {
      barData.push({
        x: stationDetailData.histogram[idx].le,
        y: stationDetailData.histogram[idx].value,
      });
    }
    for (let idx: number = 0; idx < stationDetailData.pumpCurrent.length; idx++) {
      const y1 = Math.round(stationDetailData.newWaterLevel[idx].mean);
      const y2 = Math.round(stationDetailData.newWaterLevelTIANGU[idx].mean);
      if (y1 !== 0 && y2 !== 0) {
        currentData.push({
          x: new Date(stationDetailData.pumpCurrent[idx].time).getTime(),
          y1: y1,
          max: SelectedThing ? SelectedThing.metadata.reporting.water_level.critical : 0,
          y2: y2,
          switch1: Math.round(Math.round(stationDetailData.newPumpStatus[idx].max) % 10),
          switch2: Math.round(Math.round(stationDetailData.newPumpStatus[idx].max) / 10 % 10),
          switch3: Math.round(Math.round(stationDetailData.newPumpStatus[idx].max / 100)),
        });
      }
    }

    const pumpStatusArea = [];
    const pumpStatus = SelectedThing.metadata.reporting.pump_status ? SelectedThing.metadata.reporting.pump_status : 0;
    for (let idx = 0; idx < SelectedThing.metadata.pump_ctrl.pump_number; idx++) {
      const figure = Math.pow(10, idx);
      const pumpOnOff = (pumpStatus / figure % 10) >= 1;
      const pumpNumber = idx;
      pumpStatusArea.push(
        <Col span={8} key={'switch' + idx}>
          <Switch checkedChildren="关闭" unCheckedChildren="启动" checked={pumpOnOff} onChange={(checked: boolean) => {
            const data = {
              target: SelectedThing.metadata.pump_ctrl.control_channel,
              pumpData: '{"P' + (pumpNumber) + '": ' + (checked ? 1 : 0) + '}',
            };
            const { dispatch } = this.props;
            if (dispatch) dispatch({
              type: 'dashboardAnalysis/pumpControl',
              payload: data,
            });
          }}/>
        </Col>,
      );
    }

    const { stAutoControl } = this.state;
    let autoControl = false;
    switch (SelectedThing.id) {
      case '28d39cd5-3757-42de-9a59-1bb1fdefd4db':
        autoControl = stAutoControl.pumpStation1;
        break;
      case 'fec16868-36f8-4cf9-bbff-62b3220154b1':
        autoControl = stAutoControl.pumpStation2;
        break;
      case 'fbbd76aa-f7e0-4fef-85aa-16a4ad7044e0':
        autoControl = stAutoControl.pumpStation3;
        break;
      case '1734efc1-6e75-476d-985b-4ea26776d470':
        autoControl = stAutoControl.pumpStation4;
        break;
      default:
    }

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
          <Row>
            <Col span={8}/>
            <Col span={8}>{SelectedThing.name}</Col>
            <Col span={8} style={{textAlign: 'right'}}>
              <Popover placement="right" content={'历史数据'}>
                <Icon type="history" onClick={this.showModal}/>
              </Popover>
            </Col>
          </Row>
          <Modal
            title={SelectedThing.name + ' - 历史数据'}
            onCancel={this.handleCancel}
            visible={this.state.visible}
            footer={null}
            width={1040}
            style={{textAlign: 'center'}}
          >
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
            <br/>
            <TimelineChartMulti
              height={213}
              data={chartData}
              titleMap={{ y1: '液位', max: '报警液位', y2: '田顾液位' }}
              titleMap1={{ switch1: '泵一' }}
              titleMap2={{ switch2: '泵二' }}
              titleMap3={{ switch3: '泵三' }}
              title
            />
            <br/>
          </Modal>
        </div>
        <Row style={{ borderBottom: '1px solid #EEE' }}>
          <Col span={24}>
            <Tabs defaultActiveKey="1" tabPosition="top">
              <TabPane tab="设备监控" key="设备监控">
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
                    水泵电流：
                  </Col>
                  <Col span={16}>{SelectedThing.metadata.reporting.pump_current} A</Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
                  <Col span={6} offset={2}>
                    设备型号：
                  </Col>
                  <Col span={16}>{SelectedThing.metadata.device}</Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
                  <Col span={6} offset={2}>
                    设备地址：
                  </Col>
                  <Col span={16}>{SelectedThing.metadata.location.address}</Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }}>
                  <Col span={6} offset={2}>
                    手动控制：
                  </Col>
                  <Col span={16}>
                    <Switch checkedChildren="手动" unCheckedChildren="自动" checked={!autoControl} onChange={(checked: boolean) => {
                      const { dispatch } = this.props;
                      const microMessage = JSON.stringify({
                        type: 'command',
                        data: {
                          thing: SelectedThing.id,
                          status: checked ? 'manual' : 'auto',
                        },
                      });
                      if (dispatch) dispatch({
                        type: 'dashboardAnalysis/microServiceControl',
                        payload: microMessage,
                      });
                      SelectedThing.metadata.pump_ctrl.auto_control = checked;
                      if (dispatch) dispatch({
                        type: 'dashboardAnalysis/setSelectedThing',
                        payload: SelectedThing,
                      });
                      const { stationsData = {things: []} } = dashboardAnalysis;
                      const { things } = stationsData;
                      for (let idx = 0; idx < things.length; idx++) {
                        if (SelectedThing.id === things[idx].id) {
                          stationsData.things[idx].metadata.pump_ctrl.auto_control = checked;
                          if (dispatch) dispatch({
                            type: 'dashboardAnalysis/updateThingData',
                            payload: stationsData,
                          });
                          break;
                        }
                      }
                    }}/>
                  </Col>
                </Row>
                <Row type="flex" align="middle" key="名称栏" style={{borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }} >
                  <Col span={6} offset={2}>泵 1 状态：</Col>
                  <Col span={16}>{pumpStatusArea[0]}</Col>
                </Row>
                <Row type="flex" align="middle" key="名称栏2" style={{borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }} >
                  <Col span={6} offset={2}>泵 2 状态：</Col>
                  <Col span={16}>{pumpStatusArea[1]}</Col>
                </Row>
                <Row type="flex" align="middle" key="名称栏3" style={{borderBottom: '1px solid #EEE', paddingTop: '5px', paddingBottom: '5px' }} >
                  <Col span={6} offset={2}>泵 3 状态：</Col>
                  <Col span={16}>{pumpStatusArea[2]}</Col>
                </Row>
              </TabPane>
              <TabPane tab="实时信息" key="实时信息">
                <TimelineChartMultiTemp
                  height={195}
                  data={currentData}
                  titleMap={{ y1: '液位', max: '报警液位', y2: '田顾液位' }}
                  titleMap1={{ switch1: '泵一' }}
                  titleMap2={{ switch2: '泵二' }}
                  titleMap3={{ switch3: '泵三' }}
                  title
                />
              </TabPane>
              <TabPane tab="液位分布" key="液位分布">
                <Bar height={250} data={barData} title />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <Websocket
          style={{display: 'none'}}
          url={this.url}
          onMessage={this.handleData}
          onOpen={() => {console.log('WebSocket connected')}}
          onClose={() => {console.log('WebSocket disconnected')}}
          reconnect
          debug
          ref={(WebSocket: any) => {
            this.refWebSocket = WebSocket;
          }}
        />
      </div>
    );
  };

  render() {
    const {
      SelectedThing,
    } = this.props;
    if (SelectedThing === null) return null;
    if (SelectedThing.metadata.type === 'manhole') {
      return this.RenderManHole();
    } else if (SelectedThing.metadata.type === 'pump_station') {
      return this.RenderPumpStation();
    } else {
      return null;
    }
  }
}

export default ThingInformation;
