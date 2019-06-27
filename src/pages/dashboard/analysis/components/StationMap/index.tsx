import React, { Component } from 'react';
import { Tag, Table, List, Button, Input } from 'antd';
import { Map, Marker } from 'react-amap';
import HoverPlane from './hoverPlane';
import DetailPlane from './detailPlane';
import CustomMarker from './customMarker';
import styles from './index.less';

/* Remember
props = {
  stationsData     : object,
  getStationDetail : function,
}
*/

class StationMap extends Component {
  state = {
    maxFlow: 999,
    rangeFlow: [0, 999],
    mapCenter: undefined,
    dateRange: { startTime: undefined, endTime: undefined },
  };

  constructor(props) {
    super(props);
  }

  rangeFlowChange = value => {
    this.setState({
      rangeFlow: value,
    });
  };
  mixFlowChange = value => {
    const { rangeFlow } = this.state;
    this.setState({
      rangeFlow: [value, rangeFlow[1]],
    });
  };
  maxFlowChange = value => {
    const { rangeFlow } = this.state;
    this.setState({
      rangeFlow: [rangeFlow[0], value],
    });
  };
  returnLocation = poi => {
    this.setState({
      mapCenter: poi.location,
    });
  };

  // initialize map markers according to props.stationsData
  initializeMarker() {
    const { stationsData, getStationDetail } = this.props;
    const { rangeFlow } = this.state;
    if (stationsData !== undefined && stationsData.total !== undefined) {
      const res = [];
      for (let i = 0; i < stationsData.stations.length; i += 1) {
        if (stationsData.stations[i].metadata.currLevel < rangeFlow[0]) continue;
        if (stationsData.stations[i].metadata.currLevel > rangeFlow[1]) continue;
        res.push(
          CustomMarker(stationsData.stations[i], id => {
            getStationDetail(id);
          }),
        );
      }
      return res;
    }
    return null;
  }

  render() {
    const { mapCenter, rangeFlow, maxFlow } = this.state;
    const { mapClick } = this.props;
    const events = {
      click: () => {
        mapClick();
      },
    };
    return (
      <Map plugins={['ToolBar']} center={mapCenter} events={events}>
        <HoverPlane
          rangeFlowChange={this.rangeFlowChange}
          mixFlowChange={this.mixFlowChange}
          maxFlowChange={this.maxFlowChange}
          returnLocation={this.returnLocation}
          rangeFlow={rangeFlow}
          maxFlow={maxFlow}
        />

        <DetailPlane loading={false} {...this.props} />

        {this.initializeMarker()}
      </Map>
    );
  }
}

export default StationMap;
