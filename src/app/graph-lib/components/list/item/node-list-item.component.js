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
      maxConnections: props.maxConnections || 1,
    };
  }

  componentDidMount() {
    document.addEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }

  componentWillUnmount() {
    document.removeEventListener(UPDATE_CONNECTIONS_EVENT, this.calculateConnections);
  }
  
  getId = ()=>this.state.id;

  calculateConnections = e => {
    this.setState({
      connections: e.detail.calculateConnections(this.state.id, this.props.type),
    });
  };

  onMouseDown = e => {
    if (this.state.connections >= this.state.maxConnections || this.props.disabled) {
      return null;
    }

    this.props.onMouseDown(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  onMouseUp = e => {
    if (this.state.connections >= this.state.maxConnections || this.props.disabled) {
      return null;
    }

    this.props.handleMouseUp(e, { id: this.state.id, nodeId: this.props.nodeId });
  };

  renderElement = () => {
    const itemClassNames = classNames(styles[this.props.type], styles.indicator, {
      [styles.disabled]: this.state.connections >= this.state.maxConnections || this.props.disabled,
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
