import React, { Component } from 'react';
import { Icon, List, Popover, Button } from 'antd';
import styles from './index.less';

import OnlineFilter from './OnlineFilter';
import AlarmFilter from './AlarmFilter';

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

  OnlineFilterItem = () => {
    return (
      <Popover placement="left" title="" content={OnlineFilter(this.props)} trigger="hover">
        <Icon type="disconnect" />
        <span style={{ cursor: 'pointer' }}> 在线</span>
      </Popover>
    );
  };

  AlarmFilterItem = () => {
    return (
      <Popover placement="left" title="" content={AlarmFilter(this.props)} trigger="hover">
        <Icon type="info-circle" />
        <span style={{ cursor: 'pointer' }}> 警报</span>
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
          <List.Item>{this.OnlineFilterItem()}</List.Item>
          <List.Item>{this.AlarmFilterItem()}</List.Item>
        </List>
      );
    } else {
      return null;
    }
  };

  RenderIcon = () => {
    const { ShowToolList } = this.state;
    let type = 'caret-down';
    if (ShowToolList) type = 'caret-up';
    return (
      <Icon type={type} theme="filled" style={{ fontSize: '20px' }} onClick={this.IconClick} />
    );
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
        {this.RenderIcon()}
        {this.RenderToolList()}
      </div>
    );
  }
}

export default ToolBar;
