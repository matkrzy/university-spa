import React, { Component } from 'react';
import Draggable from 'react-draggable';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';

import { NodeListInputs } from '../list/inputs/node-list-inputs.component';
import { NodeListOutputs } from '../list/outputs/node-list-outputs';

import style from './node.module.scss';

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

  handleClick = () => this.setState({ selected: true });

  handleClickOutside() {
    this.setState({ selected: false });
  }
  onStart = (e, data) => this.props.draggableProps.onStart(e, { ...data, id: this.state.id });

  onDrag = (e, data) => this.props.draggableProps.onDrag(e, { ...data, id: this.state.id });

  onStop = (e, data) => this.props.draggableProps.onStop(e, { ...data, id: this.state.id });

  render() {
    const nodeClassNames = classNames(style.node, {
      [style.selected]: this.state.selected,
    });

    const draggableProps = {
      ...this.props.draggableProps,
      onDrag: this.onDrag,
      onStart: this.onStart,
      onStop: this.onStop,
    };

    return (
      <Draggable {...draggableProps}>
        <div onDoubleClick={this.handleClick} className={nodeClassNames} id={this.state.id}>
          <div className={style.header}>{this.props.title}</div>
          <div className={style.body}>
            <NodeListInputs
              inputs={this.props.inputs}
              events={this.props.spaceProps.events.nodeInputs}
              nodeId={this.state.id}
            />
            <NodeListOutputs
              outputs={this.props.outputs}
              events={this.props.spaceProps.events.nodeOutputs}
              nodeId={this.state.id}
            />
          </div>
        </div>
      </Draggable>
    );
  }
}

export const Node = onClickOutside(NodeComponent);
