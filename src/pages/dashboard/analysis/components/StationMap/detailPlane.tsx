import React, { Component } from 'react';
import { Row, Col, Card, DatePicker, Table } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import moment from 'moment';
import Charts from '../Charts';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Bar, MiniArea } = Charts;
const dateFormat = 'YYYY-MM-DD' || undefined;

class DetailPlane extends Component {
  state = {};

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  FatchData = (data, dateString) => {
    const { ShowStationExtData, FatchStationDetail } = this.props;

    FatchStationDetail({
      stationId: ShowStationExtData.id,
      stationDetailDataRange: { startTime: dateString[0], endTime: dateString[1] },
    });
  };

  ClosePlane = () => {
    const { CloseStationDetail, ClearStationDetail } = this.props;
    CloseStationDetail();
    ClearStationDetail();
  };

  render() {
    const {
      loading,
      // TRUE/FALSE
      StationDetailVisible,
      // Function to close station detail
      CloseStationDetail,
      // StationExtData
      ShowStationExtData,
      // Function to fatch station detail
      FatchStationDetail,
      // Function to clear station detail
      ClearStationDetail,

      // Date Range
      stationDetailDataRange,
      // Show Data
      stationDetailData,
    } = this.props;

    const { startTime, endTime } = stationDetailDataRange;

    let style = null;
    let mask = null;
    if (StationDetailVisible) {
      style = { width: 420 };
      mask = <div className={styles.detailPlaneMask} onClick={this.ClosePlane} />;
    }

    const columns = [
      {
        title: '型号',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '功率',
        dataIndex: 'power',
        key: 'power',
      },
      {
        title: '扬程',
        dataIndex: 'lift',
        key: 'lift',
      },
      {
        title: '流速',
        dataIndex: 'flow',
        key: 'flow',
      },
    ];

    let dataSource = null;
    if (ShowStationExtData !== null && ShowStationExtData.metadata !== null)
      dataSource = ShowStationExtData.metadata.pumps;

    return (
      <>
        {mask}
        <div className={styles.detailPlane} style={style}>
          <Card style={{ height: '100%' }}>
            <Row>
              <Col xl={24} lg={24} md={24} sm={48} xs={48}>
                <RangePicker
                  onChange={this.FatchData}
                  style={{ width: '100%' }}
                  value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                  format={dateFormat}
                  placeholder={['开始时间', '结束时间']}
                />
              </Col>
            </Row>
            <Row>
              <Col xl={24} lg={24} md={24} sm={48} xs={48}>
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
            <Row>
              <Col xl={24} lg={24} md={24} sm={48} xs={48}>
                <Table dataSource={dataSource} columns={columns} />;
              </Col>
            </Row>
          </Card>
        </div>
      </>
    );
  }
}

export default DetailPlane;
