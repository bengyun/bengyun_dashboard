import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

/* for remember
props = {
  pumpStatus      : object
};
*/

class PumpStatusPlane extends Component {
  state = {};

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  render() {
    const { pumpStatus } = this.props;
    return (
      <div className={styles.pumpStatusPlane}>
        <Icon type="setting" theme="filled" />
        工作水泵 {pumpStatus.working + ' / ' + pumpStatus.total}
      </div>
    );
  }
}

export default PumpStatusPlane;
