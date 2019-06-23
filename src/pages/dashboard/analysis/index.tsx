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

interface dashboardAnalysisProps {
  dashboardAnalysis: IAnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
  loadingPumpStatus: boolean;
  loadingPumpMaintain: boolean;
  loadingStationsData: boolean;
  loadingPumpPower:boolean;
}

interface dashboardAnalysisState {
  
}

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
    loading: loading.effects['dashboardAnalysis/fetch'],
    loadingPumpStatus: loading.effects['dashboardAnalysis/fetchPumpStatus'],
    loadingPumpMaintain: loading.effects['dashboardAnalysis/fetchPumpMaintain'],
    loadingStationsData: loading.effects['dashboardAnalysis/fetchStationsData'],
    loadingPumpPower: loading.effects['dashboardAnalysis/fetchPumpPower'],
  }),
)
class Analysis extends Component<dashboardAnalysisProps, dashboardAnalysisState> {
  state: dashboardAnalysisState = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
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

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const {
      dashboardAnalysis,
      loading,
      
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
    } = dashboardAnalysis;

    return (
      <GridContent>
        <React.Fragment>
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
          
          <Suspense fallback={<PageLoading />}>
            <div style={{ width: '100%', height: '700px' }}>
              <StationMap loading={loadingStationsData} stationsData={stationsData} />
            </div>
            <br />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
