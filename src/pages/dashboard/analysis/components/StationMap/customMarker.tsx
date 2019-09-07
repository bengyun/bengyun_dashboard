import React from 'react';
import { Popover, Card, Switch } from 'antd';
import { Row, Col, Alert } from 'antd';
import { Marker } from 'react-amap';
import styles from './index.less';
import { IThing } from '@/pages/dashboard/analysis/data';

const Manhole = ({ thing }: { thing: IThing }) => {
  const { reporting, location, device } = thing.metadata;
  const waterLevelCurrent = reporting.water_level.current ? reporting.water_level.current : 0;
  const dateUpdateTime = reporting.updateTime ? reporting.updateTime : 0;
  const batteryVoltage = reporting.batteryVoltage ? reporting.batteryVoltage : 0;
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
    <Card size="small" title={thing.name} style={{ width: '400px' }}>
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
    </Card>
  );
};

const PumpStation = ({ thing, pumpSwitch }: { thing: IThing, pumpSwitch: Function }) => {
  const { reporting, location, device, pump_ctrl } = thing.metadata;
  const waterLevelCurrent = reporting.water_level.current ? reporting.water_level.current : 0;
  const pumpCurrent = reporting.pump_current ? reporting.pump_current : 0;
  const pumpStatus = reporting.pump_status ? reporting.pump_status : 0;
  const dateUpdateTime = reporting.updateTime ? reporting.updateTime : 0;
  const sendCommand = ({ idx, checked }: { idx: number; checked: boolean; }) => {
    const data = {
      target: thing.metadata.pump_ctrl.control_channel,
      pumpData: {
        p1: (pumpStatus % 10) >= 1 ? 1 : 0,
        p2: (pumpStatus / 10 % 10) >= 1 ? 1 : 0,
        p3: (pumpStatus / 100) >= 1 ? 1 : 0,
      },
    };
    switch (idx) {
      case 0:
        data.pumpData.p1 = checked ? 1 : 0;
        break;
      case 1:
        data.pumpData.p2 = checked ? 1 : 0;
        break;
      case 2:
        data.pumpData.p3 = checked ? 1 : 0;
        break;
      default:
    }
    pumpSwitch(data);
  };
  const pumpStatusArea = [];
  for (let idx = 0; idx < pump_ctrl.pump_number; idx++) {
    const figure = Math.pow(10, idx);
    const pumpOnOff = (pumpStatus / figure % 10) >= 1;
    pumpStatusArea.push(
      <Row type="flex" align="middle" key={idx}>
        <Col span={8}>水泵 {idx} 状态：</Col>
        <Switch checkedChildren="开" unCheckedChildren="关" checked={pumpOnOff} onChange={(checked: boolean) => sendCommand({idx, checked}) }/>
      </Row>,
    );
  }

  return (
    <Card size="small" title={thing.name} style={{ width: '400px' }}>
      <Row type="flex" align="middle">
        <Col span={8}>最新液位：</Col>
        <Col span={16}>{waterLevelCurrent} CM</Col>
      </Row>
      <Row type="flex" align="middle">
        <Col span={8}>水泵电流：</Col>
        <Col span={16}>{pumpCurrent} A</Col>
      </Row>
      {pumpStatusArea}
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
    </Card>
  );
};

/* 根据设备类型渲染不同的弹出框 */
const HoverContent = ({ thing, pumpSwitch }: { thing: IThing, pumpSwitch: Function }) => {
  const thingType = thing.metadata.type;
  switch (thingType) {
    case 'manhole':
      return <Manhole thing={thing} />;
    case 'pump_station':
      return <PumpStation thing={thing} pumpSwitch={pumpSwitch} />;
    default:
      return null;
  }
};

/* 由于Marker标签必须作为Map标签的子标签进行渲染，所以采用函数式组件 */
const CustomMarker = (
  {
    thing,
    onDetailButtonClick,
    pumpSwitch,
  }: {
    thing: IThing;
    onDetailButtonClick: Function;
    pumpSwitch: Function;
  }) => {
  const Bd09ll = thing.metadata.location.gps;
  const Gcj02ll = Bd09llToGcj02ll(Bd09ll);
  return (
    <Marker
      key={thing.key}
      position={Gcj02ll}
      offset={[-15, -40]}
      events={{
        click: () => {
          onDetailButtonClick(thing);
        },
      }}
    >
      <Popover placement="rightTop" content={<HoverContent thing={thing} pumpSwitch={pumpSwitch} />}>
        <div className={styles.markStyle}>
          {thing.metadata.reporting.water_level.current ? thing.metadata.reporting.water_level.current : 0}
        </div>
      </Popover>
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
