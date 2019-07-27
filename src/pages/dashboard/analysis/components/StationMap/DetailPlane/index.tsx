import React, { Component } from 'react';
import { Button, Icon, Tooltip } from 'antd';
import styles from './index.less';
import ThingList from './ThingList';
import { IStationDetailData, IStationsList, IThing } from '@/pages/dashboard/analysis/data';
import DetailContainer from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/DetailContainer';
import FunctionMenu from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/FunctionMenu';
import ThingInformation from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/ThingInformation';
import SearchPlane from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/SearchPlane';

interface DetailPlaneProps {
  SelectedThing?: IThing | null /* 选中设备 */;
  stationDetailData: IStationDetailData /* 设备详细 */;
  stationsData: IStationsList /* 设备列表 */;
  onDetailButtonClick: Function /* 设置选中设备 */;
  FetchStationDetail: Function /* 获得选中设备历史 - 数据模型更新 */;
  onDetailPlaneClose?: Function /* 清空选中设备历史 - 数据模型更新 */;
  OnlineFilterCurState: object;
  OnlineFilterCallBack: Function;
  AlarmFilterCurState: object;
  AlarmFilterCallBack: Function;
  returnPoi?: Function /* 搜索框返回搜索地址坐标 */;
}

interface DetailPlaneState {
  stDetailPlaneOpen: boolean;
  stDetailPlaneShow: boolean;
  stShowThingInformation: boolean;
  stDetailPlaneState: 'FunctionMenu' | 'ThingList';
}

class DetailPlane extends Component<DetailPlaneProps, DetailPlaneState> {
  state: DetailPlaneState = {
    stDetailPlaneOpen: false,
    stDetailPlaneShow: true,
    stShowThingInformation: false,
    stDetailPlaneState: 'FunctionMenu',
  };

  constructor(props: DetailPlaneProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(newProps: DetailPlaneProps) {
    const { SelectedThing } = newProps;
    if (SelectedThing === undefined || SelectedThing === null) {
      this.setState({ stShowThingInformation: false });
    } else {
      this.setState({
        stShowThingInformation: true,
        stDetailPlaneOpen: true,
        stDetailPlaneShow: true,
      });
    }
  }
  shouldComponentUpdate(newProps: DetailPlaneProps, newState: DetailPlaneState) {
    return true;
  }
  componentWillUpdate(nextProps: DetailPlaneProps, nextState: DetailPlaneState) {}
  componentDidUpdate(prevProps: DetailPlaneProps, prevState: DetailPlaneState) {}
  componentWillUnmount() {}

  CloseDetailPlane = () => {
    const { onDetailPlaneClose = () => {} } = this.props;
    this.setState({ stDetailPlaneOpen: false, stDetailPlaneState: 'FunctionMenu' });
    onDetailPlaneClose();
  };

  SwitchDetailPlaneContent = (task: 'FunctionMenu' | 'ThingList') => {
    this.setState({ stDetailPlaneState: task });
  };

  ShowHideDetailPlane = () => {
    const { stDetailPlaneShow } = this.state;
    if (stDetailPlaneShow) {
      this.setState({ stDetailPlaneShow: false });
    } else {
      this.setState({ stDetailPlaneShow: true });
    }
  };

  render() {
    const {
      SelectedThing,
      stationDetailData,
      FetchStationDetail,
      stationsData,
      onDetailButtonClick,
      returnPoi = () => {},
    } = this.props;
    const {
      stDetailPlaneOpen,
      stDetailPlaneShow,
      stShowThingInformation,
      stDetailPlaneState,
    } = this.state;
    // 选择放大内容和缩小内容
    let ComponentClassName = null;
    const Content = [];

    if (!stDetailPlaneShow) {
      /* 隐藏模式 */
      ComponentClassName = styles.detailPlaneHide;
      Content.push(
        <div
          key={'隐藏显示按钮'}
          className={styles.showHideButton}
          onClick={() => {
            this.ShowHideDetailPlane();
          }}
        >
          <Tooltip placement="right" title={stDetailPlaneShow ? '隐藏' : '显示'}>
            <Icon type={stDetailPlaneShow ? 'double-left' : 'double-right'} />
          </Tooltip>
        </div>,
      );
    } else if (!stDetailPlaneOpen) {
      /* 简要功能模式 */
      ComponentClassName = styles.detailPlaneSmall;
      Content.push(
        <SearchPlane
          key={'搜索栏'}
          placeholder={'输入位置定位地图'}
          returnPoi={returnPoi}
          FetchStationList={() => {}}
        />,
        <Button
          key={'放大缩小按钮'}
          type="link"
          className={styles.openCloseButton}
          onClick={() => {
            this.setState({ stDetailPlaneOpen: true });
          }}
        >
          <Icon type="down" />
          <span>显示详细信息</span>
        </Button>,
      );
    } else if (stShowThingInformation) {
      /* 设备详细显示模式 */
      ComponentClassName = styles.detailPlaneLarge;
      Content.push(
        <SearchPlane
          key={'搜索栏'}
          placeholder={'输入位置定位地图'}
          returnPoi={returnPoi}
          FetchStationList={() => {}}
          style={{ margin: 10 }}
        />,
        <div
          key={'隐藏显示按钮'}
          className={styles.showHideButton}
          onClick={() => {
            this.ShowHideDetailPlane();
          }}
        >
          <Tooltip placement="right" title={stDetailPlaneShow ? '隐藏' : '显示'}>
            <Icon type={stDetailPlaneShow ? 'double-left' : 'double-right'} />
          </Tooltip>
        </div>,
        <Button
          key={'放大缩小按钮'}
          type="link"
          className={styles.openCloseButton}
          onClick={() => {
            this.CloseDetailPlane();
          }}
        >
          <Icon type="up" />
          <span>隐藏详细信息</span>
        </Button>,
        <DetailContainer key={'内容区'}>
          <ThingInformation
            SelectedThing={SelectedThing}
            stationDetailData={stationDetailData}
            FetchStationDetail={FetchStationDetail}
          />
        </DetailContainer>,
      );
    } else {
      /* 多功能模式 */
      ComponentClassName = styles.detailPlaneLarge;
      Content.push(
        <SearchPlane
          key={'搜索栏'}
          placeholder={'输入位置定位地图'}
          returnPoi={returnPoi}
          FetchStationList={() => {}}
          style={{ margin: 10 }}
        />,
        <div
          key={'隐藏显示按钮'}
          className={styles.showHideButton}
          onClick={() => {
            this.ShowHideDetailPlane();
          }}
        >
          <Tooltip placement="right" title={stDetailPlaneShow ? '隐藏' : '显示'}>
            <Icon type={stDetailPlaneShow ? 'double-left' : 'double-right'} />
          </Tooltip>
        </div>,
        <Button
          key={'放大缩小按钮'}
          type="link"
          className={styles.openCloseButton}
          onClick={() => {
            this.CloseDetailPlane();
          }}
        >
          <Icon type="up" />
          <span>隐藏详细信息</span>
        </Button>,
      );
      switch (stDetailPlaneState) {
        case 'ThingList':
          Content.push(
            <DetailContainer key={'内容区'}>
              <ThingList
                stationsData={stationsData}
                onDetailButtonClick={onDetailButtonClick}
                onReturnClick={this.SwitchDetailPlaneContent}
              />
            </DetailContainer>,
          );
          break;
        case 'FunctionMenu':
        default:
          Content.push(
            <DetailContainer key={'内容区'}>
              <FunctionMenu
                stationsData={stationsData}
                onMenuClick={this.SwitchDetailPlaneContent}
              />
            </DetailContainer>,
          );
          break;
      }
    }
    return <div className={ComponentClassName}>{Content}</div>;
  }
}

export default DetailPlane;
