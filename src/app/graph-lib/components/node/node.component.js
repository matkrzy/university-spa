import React, { Component } from 'react';
import Draggable from 'react-draggable';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import { NodeListInputs } from '../list/inputs/node-list-inputs.component';
import { NodeListOutputs } from '../list/outputs/node-list-outputs';

import styles from './node.module.scss';

const uuid = require('uuid/v4');

class NodeComponent extends Component {
  static defaultProps = {
    inputs: [],
    outputs: [],
    title: 'Node',
    draggableProps: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      id: props.id || uuid(),
      connectedInputs: 0,
      connectedOutput: 0,
    };
  }

  componentDidMount() {
    this.node = findDOMNode(this);
  }

  handleClick = () => this.setState({ selected: true });

  handleClickOutside() {
    this.setState({ selected: false });
  }

  onStart = (e, data) => this.props.draggableProps.onStart(e, { ...data, id: this.state.id });

  onDrag = (e, data) => this.props.draggableProps.onDrag(e, { ...data, id: this.state.id });

  onStop = (e, data) => this.props.draggableProps.onStop(e, { ...data, id: this.state.id });

  render() {
    const nodeClassNames = classNames(styles.node, {
      [styles.selected]: this.state.selected,
      [styles.disabled]: this.props.disabled,
    });

    const headerClassNames = classNames(styles.header, {
      [styles.disabled]: this.props.disabled,
    });

    const draggableProps = {
      ...this.props.draggableProps,
      onDrag: this.onDrag,
      onStart: this.onStart,
      onStop: this.onStop,
    };

    const bounds = {
      left: 0,
      top: 0,
      right: window.innerWidth - (this.node ? this.node.getBoundingClientRect().width : 0),
      bottom: window.innerHeight - (this.node ? this.node.getBoundingClientRect().height : 0),
    };

    return (
      <Draggable {...draggableProps} bounds={bounds} disabled={this.props.disabled}>
        <div onDoubleClick={this.handleClick} className={nodeClassNames} id={this.state.id}>
          <div className={headerClassNames}>{this.props.title}</div>
          <div className={styles.body}>
            <NodeListInputs
              inputs={this.props.inputs}
              events={this.props.spaceProps.events.nodeInputs}
              nodeId={this.state.id}
              disabled={this.props.disabled}
            />
            <NodeListOutputs
              outputs={this.props.outputs}
              events={this.props.spaceProps.events.nodeOutputs}
              nodeId={this.state.id}
              disabled={this.props.disabled}
            />
          </div>
        </div>
      </Draggable>
    );
  }
}

export const Node = onClickOutside(NodeComponent);
