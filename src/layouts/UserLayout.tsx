import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'dva';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { MenuDataItem, getPageTitle, getMenuData, DefaultFooter } from '@ant-design/pro-layout';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes, props);

  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>中国泵云</span>
              </Link>
            </div>
            <div className={styles.desc}>中国泵云是宁波最具影响力的水泵管理平台</div>
          </div>
          {children}
        </div>
        <DefaultFooter />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
