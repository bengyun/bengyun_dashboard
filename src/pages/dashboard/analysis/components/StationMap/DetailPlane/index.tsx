import React, { Component } from 'react';
import { Button, Icon, Tooltip } from 'antd';
import styles from './index.less';
import ThingList from './ThingList';
import ThingTable from './ThingTable';
import { IThing } from '@/pages/dashboard/analysis/data';
import DetailContainer from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/DetailContainer';
import FunctionMenu from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/FunctionMenu';
import ThingInformation from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/ThingInformation';
import SearchPlane from '@/pages/dashboard/analysis/components/StationMap/DetailPlane/SearchPlane';

interface DetailPlaneProps {
  SelectedThing: IThing | null /* 选中设备 */;
  onDetailButtonClick: Function /* 设置选中设备 */;
  onDetailPlaneClose?: Function /* 清空选中设备 */;
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
  stDetailPlaneState: 'FunctionMenu' | 'ThingList' | 'ThingTable';
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
  /* 切换菜单的状态 */
  componentWillReceiveProps(newProps: DetailPlaneProps) {
    const { SelectedThing } = newProps;
    /* 没有设备(Thing)被选中，则不显示设备详细信息 */
    if (SelectedThing === undefined || SelectedThing === null) {
      this.setState({ stShowThingInformation: false });
    } else { /* 设备(Thing)被选中，则显示细节菜单，并放大细节菜单，并显示设备详细信息 */
      this.setState({
        stShowThingInformation: true, /* 显示设备详细信息 */
        stDetailPlaneOpen: true, /* 放大左侧面板 */
        stDetailPlaneShow: true, /* 显示左侧面板 */
      });
    }
  }
  /* 缩小左侧面板，并将面板内容设为菜单，并将选中设备设置为null */
  CloseDetailPlane = () => {
    const { onDetailPlaneClose = () => {} } = this.props;
    this.setState({ stDetailPlaneOpen: false, stDetailPlaneState: 'FunctionMenu' });
    onDetailPlaneClose();
  };
  /* 改变左侧面板的内容 */
  SwitchDetailPlaneContent = (task: 'FunctionMenu' | 'ThingList' | 'ThingTable') => {
    this.setState({ stDetailPlaneState: task });
  };
  /* 隐藏左侧面板 */
  ShowHideDetailPlane = () => {
    const { stDetailPlaneShow } = this.state;
    if (stDetailPlaneShow) {
      this.setState({ stDetailPlaneShow: false });
    } else {
      this.setState({ stDetailPlaneShow: true });
    }
  };
  /* 显示组件 */
  render() {
    const {
      SelectedThing,
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
                onDetailButtonClick={onDetailButtonClick}
                onReturnClick={this.SwitchDetailPlaneContent}
              />
            </DetailContainer>,
          );
          break;
        case 'ThingTable':
          ComponentClassName = styles.detailPlaneVeryLarge;
          Content.push(
            <DetailContainer key={'内容区'}>
              <ThingTable
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
