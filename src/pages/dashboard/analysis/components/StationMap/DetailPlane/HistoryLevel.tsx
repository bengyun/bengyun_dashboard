import React, { Component } from 'react';
import { Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import Charts from '../../Charts';
import styles from './index.less';
import { IStationDetailData, IThing } from '@/pages/dashboard/analysis/data';

const { RangePicker } = DatePicker;
const { MiniArea } = Charts;
const dateFormat = 'YYYY-MM-DD' || undefined;

interface HistoryLevelProps {
  stationExtData: IThing | null;
  stationDetailData: IStationDetailData;
  FetchStationDetail: Function;
}

interface HistoryLevelState {
  stTimeRange: { startTime: string | undefined; endTime: string | undefined };
}

class HistoryLevel extends Component<HistoryLevelProps, HistoryLevelState> {
  state: HistoryLevelState = {
    stTimeRange: { startTime: undefined, endTime: undefined },
  };

  constructor(props: HistoryLevelProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  componentWillMount() {
    const { stationExtData, FetchStationDetail } = this.props;
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
    if (stationExtData)
      FetchStationDetail({
        stationId: stationExtData.id,
        timeRange: { startTime, endTime },
      });
  }

  componentDidMount() {}

  componentWillUpdate() {}

  componentDidUpdate(prevProps: HistoryLevelProps, prevState: HistoryLevelState) {
    const { stationExtData, FetchStationDetail } = this.props;
    const { stTimeRange } = this.state;
    const { startTime, endTime } = stTimeRange;
    if (
      stationExtData &&
      (!prevProps.stationExtData || stationExtData.id !== prevProps.stationExtData.id)
    ) {
      FetchStationDetail({
        stationId: stationExtData.id,
        timeRange: { startTime, endTime },
      });
    }
  }

  FetchData = (data: any, dateString: string[]) => {
    const { stationExtData, FetchStationDetail } = this.props;
    this.setState({
      stTimeRange: { startTime: dateString[0], endTime: dateString[1] },
    });
    if (stationExtData)
      FetchStationDetail({
        stationId: stationExtData.id,
        timeRange: { startTime: dateString[0], endTime: dateString[1] },
      });
  };

  render() {
    const { stationDetailData } = this.props;
    const { stTimeRange } = this.state;
    const { startTime, endTime } = stTimeRange;
    const data: { x: string | number; y: number }[] = [];
    for (let idx: number = 0; idx < stationDetailData.historyLevel.length; idx++) {
      if (stationDetailData.historyLevel[idx].name === 'water_level')
        data.push({
          x: stationDetailData.historyLevel[idx].time,
          y: parseFloat(stationDetailData.historyLevel[idx].value),
        });
    }
    return (
      <>
        <div className={styles.historyLevel}>
          <Row>
            <Col xl={24} lg={24} md={24} sm={48} xs={48} style={{ textAlign: 'center' }}>
              <RangePicker
                onChange={this.FetchData}
                value={
                  startTime === undefined || endTime === undefined
                    ? [undefined, undefined]
                    : [moment(startTime, dateFormat), moment(endTime, dateFormat)]
                }
                format={dateFormat}
                placeholder={['开始时间', '结束时间']}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xl={24}
              lg={24}
              md={24}
              sm={48}
              xs={48}
              style={{ textAlign: 'center', fontSize: '16px' }}
            >
              液位变化趋势
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={48} xs={48}>
              <MiniArea height={292} data={data} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default HistoryLevel;
