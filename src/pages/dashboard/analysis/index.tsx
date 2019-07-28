import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { Dispatch } from 'redux';
import { IAnalysisData } from './data.d';
import StationMap from './components/StationMap';

interface DashboardAnalysisProps {
  dashboardAnalysis: IAnalysisData;
  dispatch: Dispatch<any>;
  loadingStationsData: boolean;
}

interface DashboardAnalysisState {
  update: boolean;
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
    loadingStationsData: loading.effects['dashboardAnalysis/fetchStationsData'],
    loadingStationsDetailData: loading.effects['dashboardAnalysis/fetchStationDetailData'],
  }),
)
class Analysis extends Component<DashboardAnalysisProps, DashboardAnalysisState> {
  state: DashboardAnalysisState = {
    update: false,
  };
  reqRef!: number;
  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
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

  // 获取站点列表
  FetchStationList = (region: any) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'dashboardAnalysis/fetchStationsData',
      payload: { region: JSON.stringify(region) },
    });
  };

  // 获取某个站点的详细信息
  FetchStationDetail = (data: any) => {
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
    const {
      dashboardAnalysis,

      loadingStationsData,
    } = this.props;

    const { stationsData, stationDetailData } = dashboardAnalysis;

    return (
      <div style={{ width: '100%', height: '800px' }}>
        <Suspense fallback={<PageLoading />}>
          <StationMap
            loading={loadingStationsData}
            stationsData={stationsData}
            FetchStationList={this.FetchStationList}
            stationDetailData={stationDetailData}
            FetchStationDetail={this.FetchStationDetail}
            ClearStationDetail={this.ClearStationDetail}
          />
        </Suspense>
      </div>
    );
  }
}

export default Analysis;
