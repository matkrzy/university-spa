import React, { Component } from 'react';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

import { NODE_INPUT, UPDATE_CONNECTIONS_EVENT } from '../../../dictionary';

import styles from './node-list-item.module.scss';

const uuid = require('uuid/v4');

export class NodeListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id || uuid(),
      connections: 0,
    };
  }

  componentDidMount() {
    document.addEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }

  componentWillUnmount() {
    document.removeEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }

  getId = () => this.state.id;

  calculateConnections = e => {
    this.setState({
      connections: e.detail.calculateConnections(this.state.id, this.props.type),
    });
  };

  handleMouseDown = e => {
    if (this.state.connections >= this.props.maxConnections || this.props.disabled) {
      return null;
    }

    this.props.onMouseDown(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  handleMouseUp = e => {
    if (this.state.connections >= this.props.maxConnections || this.props.disabled) {
      return null;
    }

    this.props.onMouseUp(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  renderElement = () => {
    const indicatorClassNames = classNames(styles[this.props.type], styles.indicator, {
      [styles.disabled]: this.state.connections >= this.props.maxConnections || this.props.disabled,
    });

    const itemClassNames = classNames(styles.item, styles[`item--${this.props.type}`]);

    return (
      <li className={itemClassNames}>
        <div
          className={indicatorClassNames}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          id={this.state.id}
        />
        <span className={styles.label}>{this.props.label}</span>
      </li>
    );
  };

  render() {
    if (this.state.connections >= Number(this.props.maxConnections)) {
      return (
        <Tooltip
          placement={this.props.type === NODE_INPUT ? 'left' : 'right'}
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
