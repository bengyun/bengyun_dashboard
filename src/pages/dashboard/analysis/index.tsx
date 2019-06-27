import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';
import PageLoading from './components/PageLoading';
import { Dispatch } from 'redux';
import { IAnalysisData } from './data.d';
import { GridContent } from '@ant-design/pro-layout';
import StationMap from './components/StationMap';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

interface DashboardAnalysisProps {
  dashboardAnalysis: IAnalysisData;
  dispatch: Dispatch<any>;
  loadingPumpStatus: boolean;
  loadingPumpMaintain: boolean;
  loadingStationsData: boolean;
  loadingPumpPower: boolean;
}

interface DashboardAnalysisState {}

@connect(
  ({
    dashboardAnalysis,
    loading,
  }: {
    dashboardAnalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAnalysis,
    loadingPumpStatus: loading.effects['dashboardAnalysis/fetchPumpStatus'],
    loadingPumpMaintain: loading.effects['dashboardAnalysis/fetchPumpMaintain'],
    loadingStationsData: loading.effects['dashboardAnalysis/fetchStationsData'],
    loadingPumpPower: loading.effects['dashboardAnalysis/fetchPumpPower'],
    loadingStationsDetailData: loading.effects['dashboardAnalysis/fetchStationDetailData'],
  }),
)
class Analysis extends Component<DashboardAnalysisProps, DashboardAnalysisState> {
  state: dashboardAnalysisState = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    stationId: null,
    stationDetailDataRange: { startTime: undefined, endTime: undefined },
  };
  reqRef!: number;
  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetchPumpStatus',
      });
      dispatch({
        type: 'dashboardAnalysis/fetchPumpMaintain',
      });
      dispatch({
        type: 'dashboardAnalysis/fetchPumpPower',
      });
      dispatch({
        type: 'dashboardAnalysis/fetchStationsData',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    cancelAnimationFrame(this.reqRef);
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
  }

  //地图侧边显示的操作
  getStationDetail = stationId => {
    this.setState({
      stationId: stationId,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/fetchStationDetailData',
      payload: { stationId },
    });
  };
  stationDetailDataRangeChange = (data, dateString) => {
    const stationDetailDataRange = { startTime: dateString[0], endTime: dateString[1] };
    this.setState({
      stationDetailDataRange: stationDetailDataRange,
    });

    const { stationId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/fetchStationDetailData',
      payload: {
        stationId,
        stationDetailDataRange,
      },
    });
  };
  mapClick = () => {
    this.setState({
      stationId: null,
      stationDetailDataRange: { startTime: undefined, endTime: undefined },
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clearStationDetailData',
    });
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey, stationDetailDataRange } = this.state;

    const {
      dashboardAnalysis,

      loadingPumpStatus,
      loadingPumpMaintain,
      loadingPumpPower,
      loadingStationsData,
    } = this.props;

    const {
      pumpStatus,
      pumpMaintain,
      pumpPower,
      stationsData,
      stationDetailData,
    } = dashboardAnalysis;

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <div style={{ width: '100%', height: '700px' }}>
              <StationMap
                loading={loadingStationsData}
                mapClick={this.mapClick}
                stationsData={stationsData}
                stationDetailData={stationDetailData}
                getStationDetail={this.getStationDetail}
                stationDetailDataRange={stationDetailDataRange}
                stationDetailDataRangeChange={this.stationDetailDataRangeChange}
              />
            </div>
            <br />
          </Suspense>

          <Suspense fallback={<PageLoading />}>
            <IntroduceRow
              loadingPumpStatus={loadingPumpStatus}
              pumpStatus={pumpStatus}
              loadingPumpMaintain={loadingPumpMaintain}
              pumpMaintain={pumpMaintain}
              loadingPumpPower={loadingPumpPower}
              pumpPower={pumpPower}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
