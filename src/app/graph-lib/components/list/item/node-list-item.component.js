import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './node-list-item.module.scss';

const uuid = require('uuid/v4');

export class NodeListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id || uuid(),
      connectedInputs: 0,
      connectedOutput: 0,
    };
  }

  onMouseDown = e => {
    this.props.onMouseDown(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  onMouseUp = e => {
    this.props.onMouseUp(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  render() {
    const itemClassNames = classNames(styles[this.props.type], styles.indicator);

    return (
      <li className={styles.item} id={this.state.id} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
        <div className={itemClassNames} />
        <span className={styles.label}>{this.props.label}</span>
      </li>
    );
  }
}
