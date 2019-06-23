import React from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Charts from '../Charts';
import numeral from 'numeral';
import styles from './style.less';
import Yuan from '../utils/Yuan';
import Trend from '../Trend';
import { IPumpStatu, IpumpMaintain, IPumpPower } from '../data.d';
const { ChartCard, MiniArea, MiniBar, MiniProgress, Field } = Charts;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({
  loadingPumpStatus,
  pumpStatus,
  loadingPumpMaintain,
  pumpMaintain,
  loadingPumpPower,
  pumpPower,
  }: {
  loadingPumpStatus: boolean;
  pumpStatus: IPumpStatu;
  loadingPumpMaintain: boolean;
  pumpMaintain: IpumpMaintain;
  loadingPumpPower: boolean;
  pumpPower: IPumpPower;
  }) => {
  if(pumpStatus == undefined){
	pumpStatus = {
      working: 0,
      total: 0,
      runtime: 0,
    };
	loadingPumpStatus = true;
  }
  if(pumpMaintain == undefined){
	pumpMaintain = {
      breakdownPump: 0,
      breakEveryDay: [],
      repairEveryDay: [],
	  repairPump: 0,
    };
	loadingPumpMaintain = true;
  }
  if(pumpPower == undefined){
	pumpPower = {
      currentPower: 0,
      trendPower: [],
      totalPower: 0,
    };
	loadingPumpPower = true;
  }
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={
            <FormattedMessage
              id="dashboard-analysis.analysis.running-pump"
              defaultMessage="Total Pump"
            />
          }
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loadingPumpStatus}
          total={() => <div>{pumpStatus.working}/{pumpStatus.total}</div>}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="dashboard-analysis.analysis.run-time"
                  defaultMessage="Run Time"
                />
              }
              value={pumpStatus.runtime + 'h'}
            />
          }
          contentHeight={46}
        >
          <MiniBar data={[]} />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loadingPumpMaintain}
          title={
            <FormattedMessage id="dashboard-analysis.analysis.pump-maintain" defaultMessage="Pump Maintain" />
          }
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={pumpMaintain.breakdownPump}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="dashboard-analysis.analysis.daily-Repair"
                  defaultMessage="Daily Repair"
                />
              }
              value={pumpMaintain.repairPump}
            />
          }
          contentHeight={46}
        >
          <MiniBar color="#975FE4" data={pumpMaintain.breakEveryDay} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loadingPumpPower}
          title={
            <FormattedMessage id="dashboard-analysis.analysis.pump-power" defaultMessage="Pump Power" />
          }
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.introduce"
                  defaultMessage="Introduce"
                />
              }
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={pumpPower.currentPower + 'kW'}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="dashboard-analysis.analysis.max-power"
                  defaultMessage="Max Power"
                />
              }
              value={pumpPower.totalPower + 'kW'}
            />
          }
          contentHeight={46}
        >
          <MiniArea data={pumpPower.trendPower} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          //loading={loading}
          bordered={false}
          title={
            <FormattedMessage
              id="dashboard-analysis.analysis.default"
              defaultMessage="Default"
            />
          }
          action={
            <Tooltip
              title={
                <FormattedMessage
                  id="dashboard-analysis.analysis.default"
                  defaultMessage="Default"
                />
              }
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total="0"
          footer={
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Trend flag="up" style={{ marginRight: 16 }}>
                <FormattedMessage
                  id="dashboard-analysis.analysis.default"
                  defaultMessage="Default"
                />
                <span className={styles.trendText}>0</span>
              </Trend>
              <Trend flag="down">
                <FormattedMessage
                  id="dashboard-analysis.analysis.default"
                  defaultMessage="Default"
                />
                <span className={styles.trendText}>0</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <MiniProgress percent={0} strokeWidth={0} target={0} color="#13C2C2" />
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
