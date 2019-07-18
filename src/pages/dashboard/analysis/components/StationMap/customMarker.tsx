import React from 'react';
import { Badge, Icon, Card, Tag, Button } from 'antd';
import { Row, Col, Alert } from 'antd';
import { AMapPixel, Marker } from 'react-amap';
import styles from './index.less';
import { IThing } from '@/pages/dashboard/analysis/data';

const zIndex = 100;
class MarkPixel implements AMapPixel {
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  equals() {
    return true;
  }
  toString() {
    return '';
  }
}
const offsetSmall = new MarkPixel(-13, -35);
const offsetLarge = new MarkPixel(-13, -260);

const markerEvents: {
  mouseover: Function;
  mouseout: Function;
} = {
  mouseover: (e: any) => {
    const marker = e.target;
    // Move to top while cursor hover
    marker.setzIndex(zIndex + 1);
    // Set offset
    marker.setOffset(offsetLarge);
    marker.render(renderMarkerHover);
  },
  mouseout: (e: any) => {
    const marker = e.target;
    // Move to default after cursor hover
    marker.setzIndex(zIndex);
    // Reset offset
    marker.setOffset(offsetSmall);
    marker.render(renderMarker);
  },
};
// render map markers while normal style
const renderMarker = (extData: IThing) => {
  const { metadata, name } = extData;
  const { reporting } = metadata;
  const waterLevelCurrent = reporting.water_level.current;
  const waterLevelUpdateTime = reporting.updateTime;
  const waterLevelCritical = reporting.water_level.critical;
  const waterLevelOverflow = reporting.water_level.overflow;
  const waterLevelWarning = reporting.water_level.warning;
  let color: string | undefined = undefined;
  let count = null;
  let borderTop = null;
  if (waterLevelCurrent === undefined || waterLevelUpdateTime === undefined) {
    color = 'gray';
    borderTop = '10px solid ' + color;
    count = <Icon type="disconnect" style={{ backgroundColor: 'transparent' }} />;
  } else if (waterLevelCurrent < waterLevelWarning) {
    color = 'blue';
    borderTop = '10px solid ' + color;
    count = waterLevelCurrent;
  } else if (waterLevelCurrent < waterLevelOverflow) {
    color = 'orange';
    borderTop = '10px solid ' + color;
    count = waterLevelCurrent;
  } else if (waterLevelCurrent < waterLevelCritical) {
    color = 'volcano';
    borderTop = '10px solid ' + color;
    count = waterLevelCurrent;
  } else {
    color = 'red';
    borderTop = '10px solid ' + color;
    count = waterLevelCurrent;
  }

  return (
    <>
      <Badge count={count} overflowCount={9999} showZero style={{ backgroundColor: color }}>
        <Tag className={styles.small} color={color}>
          {name}
        </Tag>
      </Badge>
      <div className={styles.under} style={{ borderTop: borderTop }} />
    </>
  );
};

// render map markers while cursor hover
const renderMarkerHover = (extData: any) => {
  const { metadata, name } = extData;
  const { reporting, location, device } = metadata;
  const { showDetailOf } = extData;
  const waterLevelCurrent = reporting.water_level.current;
  const dateUpdateTime = reporting.updateTime;
  const batteryVoltage = reporting.batteryVoltage;
  const waterLevelCritical = reporting.water_level.critical;
  const waterLevelOverflow = reporting.water_level.overflow;
  const waterLevelWarning = reporting.water_level.warning;
  const waterLevelDepth = reporting.water_level.depth;
  let color: string | undefined = undefined;
  let borderTop = null;
  let AlertType: 'success' | 'info' | 'warning' | 'error' | undefined = undefined;
  if (waterLevelCurrent === undefined || dateUpdateTime === undefined) {
    color = 'gray';
    borderTop = '10px solid ' + color;
    AlertType = 'success';
  } else if (waterLevelCurrent < waterLevelWarning) {
    color = 'blue';
    borderTop = '10px solid ' + color;
    AlertType = 'info';
  } else if (waterLevelCurrent < waterLevelOverflow) {
    color = 'orange';
    borderTop = '10px solid ' + color;
    AlertType = 'warning';
  } else if (waterLevelCurrent < waterLevelCritical) {
    color = 'volcano';
    borderTop = '10px solid ' + color;
    AlertType = 'error';
  } else {
    color = 'red';
    borderTop = '10px solid ' + color;
    AlertType = 'error';
  }
  return (
    <>
      <Card
        size="small"
        title={name}
        className={styles.large}
        style={{ border: '1px solid ' + color }}
      >
        <Row type="flex" align="middle">
          <Col span={8}>最新液位：</Col>
          <Col span={16}>
            <Alert message={waterLevelCurrent} type={AlertType} />
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>窨井深度：</Col>
          <Col span={16}>{waterLevelDepth} CM</Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>电池电压：</Col>
          <Col span={16}>{batteryVoltage} V</Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>设备型号：</Col>
          <Col span={16}>{device}</Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>设备地址：</Col>
          <Col span={16}>{location.address}</Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={8}>更新时间：</Col>
          <Col span={16}>{dateUpdateTime}</Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => {
                showDetailOf(extData);
              }}
            >
              详细信息
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
const CustomMarker = (stationData: IThing, showDetailOf: Function) => {
  const extData = { ...stationData, showDetailOf };
  return (
    <Marker
      key={stationData.key}
      position={stationData.metadata.location.gps}
      render={renderMarker}
      events={markerEvents}
      extData={extData}
      offset={offsetSmall}
      zIndex={zIndex}
    />
  );
};

export default CustomMarker;
