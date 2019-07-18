import React, { Component } from 'react';
import { Select, Icon, Cascader } from 'antd';
import styles from './index.less';

const { Option } = Select;

interface SearchPlaneProps {
  placeholder: string;
  returnPoi: Function;
  FetchStationList: Function;
}

interface SearchPlaneState {
  stType: boolean;
  data: object[];
  value: object | undefined;
  stDefaultRegion: object[];
}

class SearchPlane extends Component<SearchPlaneProps, SearchPlaneState> {
  state = {
    stType: false,

    data: [],
    value: undefined,

    stDefaultRegion: [],
  };
  placeSearch: { search: Function } | null = null;
  constructor(props: SearchPlaneProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
    const that = this;
    // @ts-ignore
    window.AMap.service('AMap.PlaceSearch', function() {
      // @ts-ignore
      that.placeSearch = new window.AMap.PlaceSearch({});
    });
  }

  /*   高德地图的搜索功能   */
  handleSearch = (value: any) => {
    const that = this;
    if (that.placeSearch != null) {
      that.placeSearch.search(value, (status: any, result: any) => {
        if (status === 'complete') {
          const data = result.poiList.pois;
          that.setState({ data });
        }
      });
    }
  };
  handleChange = (value: any) => {
    this.setState({ value });

    const { returnPoi } = this.props;
    const { data } = this.state;
    const poi = data.find((item: { id: any }) => {
      return item.id === value;
    });
    if (returnPoi !== undefined) returnPoi(poi);
  };
  getOptions() {
    const { data } = this.state;
    return data.map((item: { id: any; name: any }) => <Option key={item.id}>{item.name}</Option>);
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
  onRegionSelectChange = (region: any) => {
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
