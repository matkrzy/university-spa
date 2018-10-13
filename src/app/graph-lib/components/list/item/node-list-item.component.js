import React, { Component } from 'react';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import { findDOMNode } from 'react-dom';

import styles from './node-list-item.module.scss';

const uuid = require('uuid/v4');

export class NodeListItem extends Component {
  constructor(props) {
    super(props);

    const id = props.id || uuid();

    this.state = {
      id,
      connections: 0,
      maxConnections: props.maxConnections || 1,
    };
  }

  componentDidMount() {
    document.addEventListener('update-connections', this.calculateConnections);
  }

  componentWillUnmount() {
    document.removeEventListener('update-connections', this.calculateConnections);
  }

  calculateConnections = e => {
    this.setState({
      connections: this.props.calculateConnections(this.state.id, this.props.type),
    });
  };

  onMouseDown = e => {
    if (this.state.connections >= this.state.maxConnections) {
      return null;
    }

    this.props.onMouseDown(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  onMouseUp = e => {
    if (this.state.connections >= this.state.maxConnections) {
      return null;
    }

    this.props.onMouseUp(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  renderElement = () => {
    const itemClassNames = classNames(styles[this.props.type], styles.indicator, {
      [styles.disabled]: this.state.connections >= this.state.maxConnections,
    });

    return (
      <li className={styles.item} id={this.state.id} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
        <div className={itemClassNames} />
        <span className={styles.label}>{this.props.label}</span>
      </li>
    );
  };

  render() {
    if (this.state.connections >= this.state.maxConnections) {
      return (
        <Tooltip
          placement={this.props.type === 'input' ? 'left' : 'right'}
          overlay="Maximum connections reached"
          overlayClassName={styles.tooltip}
        >
          {this.renderElement()}
        </Tooltip>
      );
    }

    return this.renderElement();
  }
}
