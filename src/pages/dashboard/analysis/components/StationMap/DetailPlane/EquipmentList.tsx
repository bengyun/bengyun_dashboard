import React, { Component } from 'react';
import { List } from 'antd';
import styles from './index.less';

import InfiniteScroll from 'react-infinite-scroller';

/* for remember
props = {
  pumpStatus      : object
};
*/

class EquipmentList extends Component {
  state = {};

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  render() {
    const { stationsData } = this.props;
    return (
      <div className={styles.equipmentList}>
        <List
        bordered
        dataSource={stationsData.stations}
        renderItem={item => (
          <List.Item>
            {item.name}
          </List.Item>
        )}
        />
      </div>
    );
  }
}

export default EquipmentList;
