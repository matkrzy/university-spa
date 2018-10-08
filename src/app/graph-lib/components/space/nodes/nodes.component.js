import React, { Component } from 'react';

import styles from './nodes.module.scss';

export class NodesComponent extends Component {
  render() {
    return (
      <div id="graphSpaceNodes" ref="nodes" className={styles.nodes}>
        {this.props.children}
      </div>
    );
  }
}
