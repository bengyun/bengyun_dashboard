import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { Dispatch } from 'redux';
import StationMap from './components/StationMap';

interface DashboardAnalysisProps {
  dispatch: Dispatch<any>;
}

interface DashboardAnalysisState {}

@connect(
  ({
    loading,
  }: {
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    loadingStationsData: loading.effects['dashboardAnalysis/fetchStationsData'], /* 并没有卵用，只是留在这里提醒还能获得调用中的状态 */
  }),
)
class Analysis extends Component<DashboardAnalysisProps, DashboardAnalysisState> {
  state: DashboardAnalysisState = {};
  reqRef: number;
  /* 在组件加载时，更新站点(Thing)信息，并设定定时更新 */
  constructor(props: any) {
    super(props);
    const { dispatch } = this.props;
    /* 更新站点(Thing)信息 */
    dispatch({
      type: 'dashboardAnalysis/fetchStationsData',
    });
    /* 设定10秒更新1次站点(Thing)信息 */
    this.reqRef = window.setInterval(() => {
      dispatch({
        type: 'dashboardAnalysis/fetchStationsData',
      });
    }, 20000);
  }
  /* 通过画面帧调用，访问后台频率太快，改用计时器
  Animate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/fetchStationsData',
    });
    this.reqRef = requestAnimationFrame(this.animate);
  };
  通过画面帧调用，访问后台频率太快，改用计时器 */
  /* 在组件卸载前，终止更新站点(Thing)信息的计时器，并清空模型中的数据 */
  componentWillUnmount() {
    const { dispatch } = this.props;
    window.clearInterval(this.reqRef);
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
  }
  /* 显示组件 */
  render() {
    return (
      <div style={{ width: '100%', height: '800px' }}>
        <Suspense fallback={<PageLoading />}>
          <StationMap />
        </Suspense>
      </div>
    );
  }
}

export default Analysis;
