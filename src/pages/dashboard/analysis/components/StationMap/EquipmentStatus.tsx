import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

interface EquipmentStatusProps {
  pumpStatus: { working: number; total: number } | undefined;
}
interface EquipmentStatusState {}

class EquipmentStatus extends Component<EquipmentStatusProps, EquipmentStatusState> {
  state = {};

  constructor(props: EquipmentStatusProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  render() {
    const { pumpStatus } = this.props;
    const working = pumpStatus === undefined ? 0 : pumpStatus.working;
    const total = pumpStatus === undefined ? 0 : pumpStatus.total;
    return (
      <div className={styles.equipmentStatus}>
        <Icon type="setting" theme="filled" />
        工作设备 {working + ' / ' + total}
      </div>
    );
  }
}

export default EquipmentStatus;
