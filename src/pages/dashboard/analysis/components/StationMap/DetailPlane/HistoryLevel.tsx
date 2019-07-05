import React, { Component } from 'react';
import { Card, Row, Col, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import moment from 'moment';
import Charts from '../../Charts';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { MiniArea } = Charts;
const dateFormat = 'YYYY-MM-DD' || undefined;

class HistoryLevel extends Component {
  state = {
    stTimeRange: { startTime: undefined, endTime: undefined },
  };

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  componentWillMount() {
    const { stationExtData, FatchStationDetail } = this.props;
    const { stTimeRange } = this.state;
    let { startTime, endTime } = stTimeRange;

    if (startTime === undefined || endTime === undefined) {
      const DateNow = new Date();
      let YYYY = DateNow.getFullYear();
      let MM = DateNow.getMonth() + 1;
      let DD = DateNow.getDate();
      let HH = DateNow.getHours();
      let mm = DateNow.getMinutes();
      let ss = DateNow.getSeconds();
      endTime = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;

      DateNow.setTime(DateNow.getTime() - 24 * 60 * 60 * 1000);
      YYYY = DateNow.getFullYear();
      MM = DateNow.getMonth() + 1;
      DD = DateNow.getDate();
      HH = DateNow.getHours();
      mm = DateNow.getMinutes();
      ss = DateNow.getSeconds();
      startTime = YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;
    }

	this.setState({
	  stTimeRange: { startTime, endTime },
	});
	
	FatchStationDetail({
      stationId: stationExtData.id,
      timeRange: { startTime, endTime },
    });
  }
  
  componentDidMount() {}
  
  componentWillUpdate() {}
  
  componentDidUpdate(prevProps,prevState){
    const { stationExtData, FatchStationDetail } = this.props;
    const { stTimeRange } = this.state;
    const { startTime, endTime } = stTimeRange;
	
	if (stationExtData.id !== prevProps.stationExtData.id) {
	  FatchStationDetail({
        stationId: stationExtData.id,
        timeRange: { startTime, endTime },
      });
	} 
  }
  
  FatchData = (data, dateString) => {
    const { stationExtData, FatchStationDetail } = this.props;

    this.setState({
      stTimeRange: { startTime: dateString[0], endTime: dateString[1] }
    });
    
    FatchStationDetail({
      stationId: stationExtData.id,
      timeRange: { startTime: dateString[0], endTime: dateString[1] },
    });
  };

  render() {
    const { stationDetailData } = this.props;
    const { stTimeRange } = this.state;
    const { startTime, endTime } = stTimeRange;

    return (
    <>
	  <div className={styles.historyLevel}>
        <Row>
          <Col xl={24} lg={24} md={24} sm={48} xs={48}>
            <RangePicker
              onChange={this.FatchData}
              value={(startTime === undefined || endTime === undefined)
                ? null
                : [moment(startTime, dateFormat), moment(endTime, dateFormat)]}
              format={dateFormat}
              placeholder={['开始时间', '结束时间']}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={24} lg={24} md={24} sm={48} xs={48} style={{ textAlign: 'center', fontSize: '16px' }}>
            液位变化趋势
          </Col>
        </Row>
        <Row>
          <Col xl={24} lg={24} md={24} sm={48} xs={48}>
            <MiniArea
              height={292}
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.level-trend"
                  defaultMessage="Level Trend"
                />
              }
              data={stationDetailData.historyLevel}
            />
          </Col>
        </Row>
	  </div>
    </>
    );
  }
}

export default HistoryLevel;
