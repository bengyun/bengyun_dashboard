import React, { Component } from 'react';
import { Select, Icon, Cascader } from 'antd';
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
    stType: false,

    data: [],
    value: undefined,

    stDefaultRegion: [],
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

  /*   高德地图的搜索功能   */
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
  RenderMapSearch = () => {
    const { value } = this.state;
    const { placeholder } = this.props;
    return (
      <Select
        showSearch
        value={value}
        placeholder={placeholder}
        className={styles.searchPlaneRight}
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
  };
  /*   高德地图的搜索功能   */

  /*   自定义的区域筛选功能   */
  onRegionSelectChange = region => {
    this.setState({
      stDefaultRegion: region,
    });

    const { FetchStationList } = this.props;
    FetchStationList(region);
  };
  RenderRegionSelect = () => {
    const { stDefaultRegion } = this.state;

    /* ------------未来应从后台获取选项------------ */
    const options = [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'ningbo',
            label: '宁波',
            children: [
              {
                value: 'all',
                label: '全部区域',
              },
              {
                value: 'jiulonghu',
                label: '九龙湖片区',
              },
              {
                value: 'luotuo',
                label: '骆驼片区',
              },
            ],
          },
        ],
      },
    ];

    return (
      <Cascader
        className={styles.searchPlaneRight}
        defaultValue={stDefaultRegion}
        options={options}
        onChange={this.onRegionSelectChange}
      />
    );
  };
  /*   自定义的区域筛选功能   */

  render() {
    const { stType } = this.state;

    const changeType = () => {
      this.setState({ stType: !stType });
    };

    let iconType = null;
    let rightContent = null;
    if (stType === true) {
      iconType = 'ellipsis';
      rightContent = this.RenderRegionSelect();
    } else {
      iconType = 'search';
      rightContent = this.RenderMapSearch();
    }

    return (
      <div className={styles.searchPlane}>
        <Icon type={iconType} className={styles.searchPlaneLeft} onClick={changeType} />
        {rightContent}
      </div>
    );
  }
}

export default SearchPlane;
