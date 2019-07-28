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
  }>;
  title?: string;
  titleMap: { y1: string };
  padding?: [number, number, number, number];
  height?: number;
  style?: React.CSSProperties;
  borderWidth?: number;
}

class TimelineChart extends React.Component<ITimelineChartProps> {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 20, 40, 40] as [number, number, number, number],
      titleMap = {
        y1: 'y1',
      },
      borderWidth = 2,
      data: sourceData,
    } = this.props;

    const data =
      Array.isArray(sourceData) && sourceData.length > 0 ? sourceData : [{ x: 0, y1: 0 }];

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
        callback(row: { y1: string }) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1], // 展开字段集
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
        padding={[0, padding[1] + 20, 0, padding[3]]}
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
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} scale={{ x: timeScale }} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom type="line" position="x*value" size={borderWidth} color="key" />
          </Chart>
          <div style={{ marginRight: -20 }}>
            <SliderGen />
          </div>
        </div>
      </div>
    );
  }
}

export default autoHeight()(TimelineChart);
