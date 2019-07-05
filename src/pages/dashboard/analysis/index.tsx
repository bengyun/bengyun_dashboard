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

  // 地图侧边显示的操作
  FatchStationDetail = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/fetchStationDetailData',
      payload: data,
    });
  };
  ClearStationDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clearStationDetailData',
    });
  };

  render() {
    const { rangePickerValue } = this.state;

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
            <div style={{ width: '100%', height: '780px' }}>
              <StationMap
                loading={loadingStationsData}
                stationsData={stationsData}
                pumpStatus={pumpStatus}
                stationDetailData={stationDetailData}
                FatchStationDetail={this.FatchStationDetail}
                ClearStationDetail={this.ClearStationDetail}
              />
            </div>
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
