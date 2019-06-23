import React, { Component } from 'react';
import { Row, Col, Card, Bar, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import moment from 'moment';
import Charts from '../Charts';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Bar } = Charts;
const dateFormat = 'YYYY-MM-DD'||undefined;

class DetailPlane extends Component {
  state = {
  };
  
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, dateRange, rangePickerChange, historyData } = this.props;
	const { startTime, endTime } = dateRange;
    return (
	  <div  className={styles.detail} >
      <Card loading={loading} bodyStyle={{ padding: 0 }} >
        <Row>
          <Col xl={24} lg={24} md={24} sm={48} xs={48}>
            <RangePicker
              onChange={rangePickerChange}
              style={{ width: 256 }}
		      value={startTime ===undefined || endTime===undefined ? null : [moment(startTime, dateFormat), moment(endTime, dateFormat)]}
			  format={dateFormat}
			  placeholder={['开始时间','结束时间']}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={24} lg={24} md={24} sm={48} xs={48}>
            <Bar
              height={292}
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.level-trend"
                  defaultMessage="Level Trend"
                />
              }
              data={historyData}
            />
          </Col>
        </Row>
      </Card>
	  </div>
    );
  }
}

export default DetailPlane;
