import React, { Component } from 'react';
import { Tag, List, Button } from 'antd';
import { Marker } from 'react-amap';
import styles from './index.less';

const zIndex = 100;
const offsetSmall = { x: -55, y: -37 };
const offsetLarge = { x: -114, y: -332 };

const markerEvents = {
  mouseover: e => {
    const marker = e.target;
    // Move to top while cursor hover
    marker.setzIndex(zIndex + 1);
    // Set offset
    marker.setOffset(offsetLarge);
    marker.render(renderMarkerHover);
  },
  mouseout: e => {
    const marker = e.target;
    // Move to default after cursor hover
    marker.setzIndex(zIndex);
    // Reset offset
    marker.setOffset(offsetSmall);
    marker.render(renderMarker);
  },
};
// render map markers while normal style
const renderMarker = extData => {
  const { currLevel, rateLevel, maxLevel } = extData.metadata;
  const flowrate = (currLevel / maxLevel) * 100;
  const rateflowrate = (rateLevel / maxLevel) * 100;
  let background;
  let color;
  if (flowrate <= rateflowrate) {
    background = 'green';
    color = 'white';
  } else if (flowrate <= 100) {
    background = 'yellow';
    color = 'black';
  } else {
    background = 'red';
    color = 'white';
  }
  const Style = {
    color: color,
    background: background,
  };
  return (
    <>
      <div className={styles.small} style={Style}>
        {extData.name}
      </div>
      <div className={styles.under} />
    </>
  );
};
// render map markers while cursor hover
const renderMarkerHover = extData => {
  const { currLevel, rateLevel, maxLevel, pumps } = extData.metadata;
  const pumpTable = [];
  for (let i = 0; i < pumps.length; i += 1) {
    pumpTable.push(
      '泵' +
        pumps[i].name +
        ' 功率' +
        pumps[i].power +
        ' 扬程' +
        pumps[i].lift +
        ' 流量' +
        pumps[i].flow,
    );
  }
  return (
    <>
      <div className={styles.large}>
        {extData.name}
        <div>
          <Tag color="magenta">瞬时：{currLevel.toString()}</Tag>
          <Tag color="blue">额定：{rateLevel.toString()}</Tag>
          <Tag color="red">最大：{maxLevel.toString()}</Tag>
        </div>
        <List
          size="small"
          header={<div>Pumps</div>}
          bordered
          dataSource={pumpTable}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
        <Button
          type="link"
          onClick={() => {
            extData.showDetailOf(extData.id);
          }}
        >
          详细
        </Button>
      </div>
      <div className={styles.under} />
    </>
  );
};
// Marker must exist as child of Map
// So can not be made to component
const CustomMarker = (stationData, showDetailOf) => {
  const extData = { ...stationData, showDetailOf };
  return (
    <Marker
      key={stationData.key}
      position={stationData.metadata.position}
      render={renderMarker}
      events={markerEvents}
      extData={extData}
      offset={offsetSmall}
      zIndex={zIndex}
    />
  );
};

export default CustomMarker;
