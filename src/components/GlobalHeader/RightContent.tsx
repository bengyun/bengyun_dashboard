import { ConnectProps, ConnectState } from '@/models/connect';
import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import Avatar from './AvatarDropdown';
import { connect } from 'dva';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  render() {
    const { theme, layout, menu } = this.props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'topmenu') {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        <Avatar menu={menu} />
        <SelectLang className={styles.action} />
      </div>
    );
  }
}

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
