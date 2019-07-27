import React from 'react';
import { Popover, Card, Button } from 'antd';
import { Row, Col, Alert } from 'antd';
import { Marker } from 'react-amap';
import styles from './index.less';
import { IThing } from '@/pages/dashboard/analysis/data';

// render map markers while cursor hover
const HoverContent = ({
  stationData,
  onDetailButtonClick,
}: {
  stationData: IThing;
  onDetailButtonClick: Function;
}) => {
  const { metadata, name } = stationData;
  const { reporting, location, device } = metadata;
  const waterLevelCurrent = reporting.water_level.current;
  const dateUpdateTime = reporting.updateTime;
  const batteryVoltage = reporting.batteryVoltage;
  const waterLevelCritical = reporting.water_level.critical;
  const waterLevelOverflow = reporting.water_level.overflow;
  const waterLevelWarning = reporting.water_level.warning;
  const waterLevelDepth = reporting.water_level.depth;
  let AlertType: 'success' | 'info' | 'warning' | 'error' | undefined = undefined;
  if (waterLevelCurrent === undefined || dateUpdateTime === undefined) {
    AlertType = 'success';
  } else if (waterLevelCurrent < waterLevelWarning) {
    AlertType = 'info';
  } else if (waterLevelCurrent < waterLevelOverflow) {
    AlertType = 'warning';
  } else if (waterLevelCurrent < waterLevelCritical) {
    AlertType = 'error';
  } else {
    AlertType = 'error';
  }
  return (
    <Card size="small" title={name} style={{ width: '400px' }}>
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
              onDetailButtonClick(stationData);
            }}
          >
            详细信息
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

// Marker must exist as child of Map
// So can not be made to component
// But can be made as function
const CustomMarker = ({
  stationData,
  onDetailButtonClick,
}: {
  stationData: IThing;
  onDetailButtonClick: Function;
}) => {
  const Bd09ll = stationData.metadata.location.gps;
  const Gcj02ll = Bd09llToGcj02ll(Bd09ll);
  return (
    <Marker key={stationData.key} position={Gcj02ll} offset={[-15, -40]}>
      <div className={styles.markStyle}>
        <Popover
          placement="rightTop"
          content={
            <HoverContent stationData={stationData} onDetailButtonClick={onDetailButtonClick} />
          }
        >
          {stationData.metadata.reporting.water_level.current}
        </Popover>
      </div>
    </Marker>
  );
};

const Bd09llToGcj02ll = (gps: { latitude: number; longitude: number }) => {
  const PI = (3.14159265358979324 * 3000.0) / 180.0;
  const x = gps.longitude - 0.0065;
  const y = gps.latitude - 0.006;
  const k = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI);
  const longitude = k * Math.cos(theta);
  const latitude = k * Math.sin(theta);
  return { latitude, longitude };
};

export default CustomMarker;
