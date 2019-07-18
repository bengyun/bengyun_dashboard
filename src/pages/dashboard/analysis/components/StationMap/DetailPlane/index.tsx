import React, { Component } from 'react';
import { Button, Icon, Row, Col } from 'antd';
import styles from './index.less';

import HistoryLevel from './HistoryLevel';

import AlarmFilter from './AlarmFilter';
import OnlineFilter from './OnlineFilter';
import EquipmentList from './EquipmentList';
import { IStationDetailData, IStationsList, IThing } from '@/pages/dashboard/analysis/data';

interface DetailPlaneProps {
  stationExtData: IThing | null /* 选中设备 */;
  stationDetailData: IStationDetailData /* 设备详细 */;
  stationsData: IStationsList /* 设备列表 */;
  ShowStationDetail: Function /* 设置选中设备 */;
  FetchStationDetail: Function /* 获得选中设备历史 - 数据模型更新 */;
  CloseStationDetail: Function /* 清空选中设备历史 - 数据模型更新 */;
  OnlineFilterCurState: object;
  OnlineFilterCallBack: Function;
  AlarmFilterCurState: object;
  AlarmFilterCallBack: Function;
}

interface DetailPlaneState {
  stDetailPlaneOpen: boolean;
}

class DetailPlane extends Component<DetailPlaneProps, DetailPlaneState> {
  state = {
    stDetailPlaneOpen: false,
  };

  constructor(props: DetailPlaneProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  RenderSmallPlane = () => {
    const OpenPlaneF = () => {
      this.setState({
        stDetailPlaneOpen: true,
      });
    };

    return (
      <Button type="link" className={styles.openCloseButton} onClick={OpenPlaneF}>
        <Icon type="down" />
        <span>显示详细信息</span>
      </Button>
    );
  };

  RenderLargePlane = () => {
    const { stationExtData, CloseStationDetail } = this.props;

    const ClosePlaneF = () => {
      this.setState({ stDetailPlaneOpen: false });
      CloseStationDetail();
    };

    let detailArea = null;
    if (stationExtData !== null) {
      detailArea = (
        <>
          <HistoryLevel {...this.props} />
        </>
      );
    } else {
      detailArea = (
        <>
          <Row>
            <Col
              span={12}
              style={{
                border: '1px solid #EEEEEE',
                textAlign: 'center',
                height: '45px',
                lineHeight: '45px',
                background: 'white',
              }}
            >
              {AlarmFilter(this.props)}
            </Col>
            <Col
              span={12}
              style={{
                border: '1px solid #EEEEEE',
                textAlign: 'center',
                height: '45px',
                lineHeight: '45px',
                background: 'white',
              }}
            >
              {OnlineFilter(this.props)}
            </Col>
          </Row>
          <EquipmentList {...this.props} />
        </>
      );
    }

    return (
      <>
        <div className={styles.detailArea}>{detailArea}</div>

        <Button type="link" className={styles.openCloseButton} onClick={ClosePlaneF}>
          <Icon type="up" />
          <span>隐藏详细信息</span>
        </Button>
      </>
    );
  };

  render() {
    const { stationExtData } = this.props;
    const { stDetailPlaneOpen } = this.state;
    // 选择放大内容和缩小内容
    let ComponentClassName = null;
    let Content = null;
    if (stationExtData !== null) {
      ComponentClassName = styles.detailPlaneHistory;
      Content = this.RenderLargePlane();
    } else if (stDetailPlaneOpen === true) {
      ComponentClassName = styles.detailPlaneLarge;
      Content = this.RenderLargePlane();
    } else {
      ComponentClassName = styles.detailPlaneSmall;
      Content = this.RenderSmallPlane();
    }
    return <div className={ComponentClassName}>{Content}</div>;
  }
}

export default DetailPlane;
