import React, { Component } from 'react';
import { Slider, Row, Col, InputNumber, Tabs, Input, List } from 'antd';
import styles from './index.less';

const { Search } = Input;

/* for remember
props = {
  returnLocation  : function(){},
  rangeFlowChange : function(){},
  mixFlowChange   : function(){},
  maxFlowChange   : function(){},
  rangeFlow       : [0, 999],
  maxFlow         : 999,
};
*/

class HoverPlane extends Component {
  state = {
    searchResult: [],
    list: [],
  };

  constructor(props) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
    const that = this;
    window.AMap.service('AMap.PlaceSearch', function() {
      that.placeSearch = new window.AMap.PlaceSearch({});
    });
  }
  // search
  searchKey = val => {
    const that = this;
    if (val === '') {
      this.setState({
        searchResult: [],
        list: [],
      });
    } else {
      this.placeSearch.search(val, (status, result) => {
        if (status === 'complete') {
          const list = [];
          const searchResult = result.poiList.pois;
          for (let i = 0; i < (searchResult.length > 5 ? 5 : searchResult.length); i += 1) {
            const poi = searchResult[i];
            list.push(poi.name);
          }
          that.setState({
            searchResult: searchResult,
            list: list,
          });
        }
      });
    }
  };
  // when click result send location
  selectSearchResult = index => {
    const { returnLocation } = this.props;
    const { searchResult } = this.state;
    returnLocation(searchResult[index]);
  };
  // Show first five results from amap
  ShowSearchResults() {
    const { list } = this.state;
    if (list.length > 0) {
      return (
        <List
          bordered
          size="small"
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item
              onClick={() => {
                this.selectSearchResult(index);
              }}
            >
              {item}
            </List.Item>
          )}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const { TabPane } = Tabs;
    const { rangeFlowChange, mixFlowChange, maxFlowChange } = this.props;
    const { rangeFlow, maxFlow } = this.props;
    return (
      <Tabs defaultActiveKey="1" className={styles.hover}>
        <TabPane tab="液位" key="1">
          <Row>
            <Col span={24}>
              <Slider range value={rangeFlow} max={maxFlow} onChange={rangeFlowChange} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <InputNumber min={0} max={maxFlow} value={rangeFlow[0]} onChange={mixFlowChange} />
            </Col>
            <Col span={12}>
              <InputNumber min={0} max={maxFlow} value={rangeFlow[1]} onChange={maxFlowChange} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="位置" key="2">
          <Search placeholder="search place" onSearch={this.searchKey} />

          {this.ShowSearchResults()}
        </TabPane>
      </Tabs>
    );
  }
}

export default HoverPlane;
