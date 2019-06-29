import React, { Component } from 'react';
import { Card, Checkbox } from 'antd';
import styles from './index.less';

/* for remember
props = {
  OnlineFilterCallBack : function(){},
};
*/

function CheckStateChange(value, OnlineFilterCallBack) {
  const OnlineFilterCurState = { Online: false, Offline: false };
  for (let idx = 0; idx < value.length; idx++) {
    if (value[idx] === 'Online') OnlineFilterCurState.Online = true;
    if (value[idx] === 'Offline') OnlineFilterCurState.Offline = true;
  }
  let callback = () => {};
  if (typeof OnlineFilterCallBack == 'function') callback = OnlineFilterCallBack;
  callback(OnlineFilterCurState);
}

function OnlineFilter(props) {
  const { OnlineFilterCallBack, OnlineFilterCurState } = props;
  const options = [{ label: 'Online', value: 'Online' }, { label: 'Offline', value: 'Offline' }];
  const defaultValue = [];
  if (OnlineFilterCurState.Online) defaultValue.push('Online');
  if (OnlineFilterCurState.Offline) defaultValue.push('Offline');
  return (
    <Checkbox.Group
      options={options}
      onChange={value => {
        CheckStateChange(value, OnlineFilterCallBack);
      }}
      defaultValue={defaultValue}
    />
  );
}

export default OnlineFilter;
