import React, { Component } from 'react';
import { Icon, List, Popover, Button } from 'antd';
import styles from './index.less';

import OnlineFilter from './OnlineFilter';

/* for remember
props = {
};
*/

class ToolBar extends Component {
  state = {
    ShowToolList: false,
  };

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
  }

  OnlineFilter = () => {
    return (
      <Popover placement="right" title="" content={OnlineFilter(this.props)} trigger="click">
        Online
      </Popover>
    );
  };

  RenderToolList = () => {
    const { ShowToolList } = this.state;
    if (ShowToolList) {
      return (
        <List
          style={{ backgroundColor: 'white' }}
          size="small"
          header={null}
          footer={null}
          bordered
        >
          <List.Item>{this.OnlineFilter()}</List.Item>
        </List>
      );
    } else {
      return null;
    }
  };

  RenderIcon = () => {
    const { ShowToolList } = this.state;
    let type = 'up-circle';
    if (ShowToolList) type = 'down-circle';
    return <Icon type={type} style={{ fontSize: 20 }} onClick={this.IconClick} />;
  };

  IconClick = () => {
    const { ShowToolList } = this.state;
    this.setState({
      ShowToolList: !ShowToolList,
    });
  };

  render() {
    const { ShowToolList } = this.state;
    return (
      <div className={styles.toolBar} style={{ textAlign: 'center' }}>
        {this.RenderToolList()}
        {this.RenderIcon()}
      </div>
    );
  }
}

export default ToolBar;
