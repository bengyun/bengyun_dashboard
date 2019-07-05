import React, { Component } from 'react';
import { Badge, Icon, Card, Tag, Button } from 'antd';
import { Row, Col, Divider } from 'antd';
import { Marker } from 'react-amap';
import styles from './index.less';

const zIndex = 100;
const offsetSmall = { x: -13, y: -32 };
const offsetLarge = { x: -13, y: -260 };

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
  const { metadata, Online, name } = extData;

  const { level, alarmLevel } = metadata;

  let count = level;
  let color = null;
  let borderTop = '10px solid gray';
  if (Online === false) {
    color = 'gray';
    count = <Icon type="disconnect" style={{ backgroundColor: 'transparent' }} />;
  } else
	switch (alarmLevel) {
      case 0:
        color = 'blue';
        borderTop = '10px solid ' + color;
        break;
      case 1:
        color = 'orange';
        borderTop = '10px solid ' + color;
        break;
      case 2:
        color = 'red';
        borderTop = '10px solid ' + color;
        break;
      default:
    }
	
  return (
    <>
      <Badge count={count} overflowCount={9999} style={{ backgroundColor: color }}>
        <Tag className={styles.small} color={color}>
          {name}
        </Tag>
      </Badge>
      <div className={styles.under} style={{ borderTop: borderTop }} />
    </>
  );
};

// render map markers while cursor hover
const renderMarkerHover = extData => {
  const { metadata, Online, name, showDetailOf } = extData;

  const { level, voltage, address, alarmLevel, dataUpdateTime } = metadata;

  let count = level;
  let color = null;
  let borderTop = '10px solid gray';
  if (Online === false) {
    color = 'gray';
    count = <Icon type="disconnect" />;
  } else
    switch (alarmLevel) {
      case 0:
        color = 'blue';
        borderTop = '10px solid ' + color;
        break;
      case 1:
        color = 'orange';
        borderTop = '10px solid ' + color;
        break;
      case 2:
        color = 'red';
        borderTop = '10px solid ' + color;
        break;
      default:
    }

  return (
    <>
      <Card size="small" title={name} className={styles.large}>
        <Row type="flex" justify="end" align="middle">
          <Col span={12}>
            <Tag color={color}>液位： {level} M</Tag>
          </Col>
          <Col span={12}>
            <Tag color="geekblue">电压： {voltage} V</Tag>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" justify="end" align="middle">
          <Col span={8}>地址：</Col>
          <Col span={16}>{address}</Col>
        </Row>
        <Row type="flex" justify="end" align="middle">
          <Col span={8}>更新：</Col>
          <Col span={16}>{dataUpdateTime}</Col>
        </Row>
        <Row type="flex" justify="end" align="middle">
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => {
                showDetailOf(extData);
              }}
              >
              详细
            </Button>
          </Col>
        </Row>
      </Card>
      <div className={styles.under} style={{ borderTop: borderTop }} />
    </>
  );
};
// Marker must exist as child of Map
// So can not be made to component
// But can be made as function
const CustomMarker = (stationData, Online, showDetailOf) => {
  const extData = { ...stationData, Online, showDetailOf };
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
