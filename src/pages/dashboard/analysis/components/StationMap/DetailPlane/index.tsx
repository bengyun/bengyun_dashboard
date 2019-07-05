import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

import HistoryLevel from './HistoryLevel'

import EquipmentStatus from './EquipmentStatus';
import EquipmentList from './EquipmentList';

class DetailPlane extends Component {
  state = {
    stDetailPlaneOpen: false,
  };

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  RenderSmallPlane = () =>{
    
    const OpenPlaneF = () => {
      this.setState({
        stDetailPlaneOpen: true
      });
    }

    return (
      <Button
        type="link"
        className={styles.openCloseButton}
        onClick={OpenPlaneF}>
        <Icon type="down" />
        <span>显示详细信息</span>
      </Button>
    );
  }
  
  RenderLargePlane = () =>{

    const { stationExtData } = this.props;
  
    const ClosePlaneF = () => {
      this.setState({stDetailPlaneOpen: false});
    }
    
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
	      <EquipmentStatus {...this.props} />
		  <EquipmentList {...this.props} />
	    </>
	  );
	}

    return (
    <>
      <div className={styles.detailArea}>
        {detailArea}
      </div>

      <Button
        type="link"
        className={styles.openCloseButton}
        onClick={ClosePlaneF}>
        <Icon type="up" />
        <span>隐藏详细信息</span>
      </Button>
    </>
    );
  }

  render() {

    const { stationExtData } = this.props;
    const { stDetailPlaneOpen } = this.state;


    // 选择放大内容和缩小内容
    let ComponentClassName = null;
    let Content = null;

    if (stDetailPlaneOpen === true || stationExtData !== null) {

      ComponentClassName = styles.detailPlaneLarge;
      Content = this.RenderLargePlane();

    } else {

      ComponentClassName = styles.detailPlaneSmall;
      Content = this.RenderSmallPlane();
      
    }

    return (
      <div className={ComponentClassName} >
        {Content}
      </div>
    );
  }
}

export default DetailPlane;
