import React, { Component, ReactNode } from 'react';
import styles from './index.less';

interface DetailContainerProps {
  children?: ReactNode | null;
}

interface DetailContainerState {}

class DetailContainer extends Component<DetailContainerProps, DetailContainerState> {
  constructor(props: DetailContainerProps) {
    // when need to use props in constructor, use super(props)
    // when need not to use props in constructor, use super()
    super(props);
    this.state = {};
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(newProps: DetailContainerProps) {}
  shouldComponentUpdate(newProps: DetailContainerProps, newState: DetailContainerState) {
    return true;
  }
  componentWillUpdate(nextProps: DetailContainerProps, nextState: DetailContainerState) {}
  componentDidUpdate(prevProps: DetailContainerProps, prevState: DetailContainerState) {}
  componentWillUnmount() {}

  render() {
    const { children = null } = this.props;
    return (
      <div>
        <div className={styles.detailPlaneContainer}>{children}</div>
      </div>
    );
  }
}

export default DetailContainer;
