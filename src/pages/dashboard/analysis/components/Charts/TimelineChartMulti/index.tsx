import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
// @ts-ignore
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

export interface ITimelineChartProps {
  data: Array<{
    x: number;
    y1: number;
    max: number;
    y2: number;
    switch1: number;
    switch2: number;
    switch3: number;
  }>;
  title?: React.ReactNode;
  titleMap: { y1: string; max: string; y2: string };
  titleMap1: { switch1: string; };
  titleMap2: { switch2: string; };
  titleMap3: { switch3: string; };
  padding?: [number, number, number, number];
  height?: number;
  style?: React.CSSProperties;
  borderWidth?: number;
}

class TimelineChartMulti extends React.Component<ITimelineChartProps> {
  render() {
    const {
      title,
      height = 400,
      padding = [30, 30, 40, 40] as [number, number, number, number],
      titleMap = {
        y1: 'y1',
        max: 'max',
        y2: 'y2',
      },
      titleMap1 = {
        switch1: 'switch1',
      },
      titleMap2 = {
        switch2: 'switch2',
      },
      titleMap3 = {
        switch3: 'switch3',
      },
      borderWidth = 2,
      data: sourceData,
    } = this.props;

    const data =
      Array.isArray(sourceData) && sourceData.length > 0 ? sourceData : [{ x: 0, y1: 0, max: 0, y2: 0, switch1: 0, switch2: 0, switch3: 0 }];

    data.sort((a, b) => a.x - b.x);

    const ds = new DataSet({
      state: {
        start: data[0].x,
        end: data[data.length - 1].x,
      },
    });

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: (obj: { x: string }) => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row: { y1: string; max: string; y2: string }) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          newRow[titleMap.max] = row.max;
          newRow[titleMap.y2] = row.y2;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1, titleMap.max, titleMap.y2], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const dv1 = ds.createView();
    dv1.source(data)
      .transform({
        type: 'filter',
        callback: (obj: { x: string }) => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row: { switch1: string }) {
          const newRow = { ...row };
          newRow[titleMap1.switch1] = row.switch1;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap1.switch1], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const dv2 = ds.createView();
    dv2.source(data)
      .transform({
        type: 'filter',
        callback: (obj: { x: string }) => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row: { switch2: string }) {
          const newRow = { ...row };
          newRow[titleMap2.switch2] = row.switch2;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap2.switch2], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const dv3 = ds.createView();
    dv3.source(data)
      .transform({
        type: 'filter',
        callback: (obj: { x: string }) => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row: { switch3: string }) {
          const newRow = { ...row };
          newRow[titleMap3.switch3] = row.switch3;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap3.switch3], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const timeScale = {
      type: 'timeCat',
      nice: true,
      mask: 'MM-DD HH:mm',
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 60, 0, padding[3] + 40]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }: { startValue: number; endValue: number }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );

    return (
      <div className={styles.timelineChart} style={{ height: height * 2.5 + 30 }}>
        <div>
          {title}
          <Chart height={height} padding={padding} data={dv} scale={{ x: timeScale }} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom
              type="line"
              position="x*value"
              size={borderWidth}
              color={['key', ['blue', 'red', 'green']]}
            />
          </Chart>
          <Chart height={height / 2} padding={padding} data={dv1} scale={{ x: timeScale }} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom
              type="line"
              position="x*value"
              size={borderWidth}
              color={['key', ['orange']]}
              shape={"hv"}
            />
          </Chart>
          <Chart height={height / 2} padding={padding} data={dv2} scale={{ x: timeScale }} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom
              type="line"
              position="x*value"
              size={borderWidth}
              color={['key', ['pink']]}
              shape={"hv"}
            />
          </Chart>
          <Chart height={height / 2} padding={padding} data={dv3} scale={{ x: timeScale }} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom
              type="line"
              position="x*value"
              size={borderWidth}
              color={['key', ['purple']]}
              shape={"hv"}
            />
          </Chart>
          <div>
            <SliderGen />
          </div>
        </div>
      </div>
    );
  }
}

export default autoHeight()(TimelineChartMulti);
