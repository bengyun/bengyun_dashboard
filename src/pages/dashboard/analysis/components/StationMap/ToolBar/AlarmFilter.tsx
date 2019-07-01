import React, { Component } from 'react';
import { Card, Checkbox } from 'antd';
import styles from './index.less';

/* for remember
props = {
  AlarmFilterCallBack : function(){},
};
*/

function CheckStateChange(value, AlarmFilterCallBack) {
  const AlarmFilterCurState = { Normal: false, Alarm: false };
  for (let idx = 0; idx < value.length; idx++) {
    if (value[idx] === 'Normal') AlarmFilterCurState.Normal = true;
    if (value[idx] === 'Alarm') AlarmFilterCurState.Alarm = true;
  }
  let callback = () => {};
  if (typeof AlarmFilterCallBack === 'function') callback = AlarmFilterCallBack;
  callback(AlarmFilterCurState);
}

function AlarmFilter(props) {
  const { AlarmFilterCallBack, AlarmFilterCurState } = props;
  const options = [{ label: '正常', value: 'Normal' }, { label: '警报', value: 'Alarm' }];
  const defaultValue = [];
  if (AlarmFilterCurState.Normal) defaultValue.push('Normal');
  if (AlarmFilterCurState.Alarm) defaultValue.push('Alarm');
  return (
    <Checkbox.Group
      options={options}
      onChange={value => {
        CheckStateChange(value, AlarmFilterCallBack);
      }}
      defaultValue={defaultValue}
    />
  );
}

export default AlarmFilter;
