import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

/* for remember
props = {
  pumpStatus      : object
};
*/

class EquipmentStatusPlane extends Component {
  state = {};

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  render() {
    const { pumpStatus } = this.props;
    return (
      <div className={styles.equipmentStatusPlane}>
        <Icon type="setting" theme="filled" />
        工作设备 {pumpStatus.working + ' / ' + pumpStatus.total}
      </div>
    );
  }
}

export default EquipmentStatusPlane;
