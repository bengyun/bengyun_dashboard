import React, { Component } from 'react';
import { Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

/* for remember
props = {
  returnPoi       : Function,
  placeholder     : string
  className       : object
};
*/

class SearchPlane extends Component {
  state = {
    data: [],
    value: undefined,
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

  handleSearch = value => {
    const that = this;
    this.placeSearch.search(value, (status, result) => {
      if (status === 'complete') {
        const searchResult = result.poiList.pois;
        const data = searchResult;
        that.setState({ data });
      }
    });
  };

  handleChange = value => {
    this.setState({ value });

    let callback = () => {};
    const { returnPoi } = this.props;
    if (returnPoi !== undefined) callback = returnPoi;

    const { data } = this.state;
    const poi = data.find(item => {
      return item.id === value;
    });

    callback(poi);
  };

  getOptions() {
    const { data } = this.state;
    return data.map(item => <Option key={item.id}>{item.name}</Option>);
  }

  render() {
    const { value } = this.state;
    const { placeholder, className } = this.props;
    return (
      <Select
        showSearch
        value={value}
        placeholder={placeholder}
        className={className}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {this.getOptions()}
      </Select>
    );
  }
}

export default SearchPlane;
