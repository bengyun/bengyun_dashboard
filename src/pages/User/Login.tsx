import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Checkbox } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import { IAnalysisData } from '@/pages/dashboard/analysis/data';
import { Dispatch } from 'redux';

// @ts-ignore
const { UserName, Password, Submit } = Login;

interface LoginPageProps {
  login: IAnalysisData;
  dispatch: Dispatch<any>;
  submitting: boolean;
}

interface LoginPageState {
  type: 'account';
  autoLogin: boolean;
}

@connect(
  ({
    login,
    loading,
  }: {
    login: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    login,
    submitting: loading.effects['login/login'],
  }),
)
class LoginPage extends Component<LoginPageProps, LoginPageState> {
  state: LoginPageState = {
    type: 'account',
    autoLogin: true,
  };

  loginForm: any;

  handleSubmit = (err: any, values: {}) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = (e: any) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    const { submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="userName"
            placeholder={formatMessage({ id: 'app.login.userName' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.userName.required' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={formatMessage({ id: 'app.login.password' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.password.required' }),
              },
            ]}
            onPressEnter={(e: any) => {
              e.preventDefault();
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
