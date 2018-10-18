import React, { Component } from 'react';
import Draggable from 'react-draggable';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import { NodeListInputs } from '../list/inputs/node-list-inputs.component';
import { NodeListOutputsComponent } from '../list/outputs/node-list-outputs.component';

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
      dragging: false,
      position: props.draggableProps.defaultPosition,
    };

    this.inputsRef = React.createRef();
    this.outputsRef = React.createRef();
  }

  getPosition = () => this.state.position;

  getId = () => this.state.id;

  getInputRefs = () => this.inputsRef.current;

  getOutputsRef = () => this.outputsRef.current;

  componentDidMount() {
    this.node = findDOMNode(this);
    this.props.createNodeRef(this.state.id, this);
  }

  handleClick = () => this.setState({ selected: true });

  handleClickOutside() {
    this.setState({ selected: false });
  }

  onStart = (e, data) => {
    this.setState({ dragging: true });
    this.props.draggableEvents.onStart(e, { ...data, id: this.state.id });
  };

  onDrag = (e, data) => {
    this.props.draggableEvents.onDrag(e, { ...data, id: this.state.id });
  };

  onStop = (e, data) => {
    const { x, y } = data;

    this.setState({ dragging: false, position: { x, y } });

    this.props.draggableEvents.onStop(e, { ...data, id: this.state.id });
  };

  handleContextMenu = e => {
    e.preventDefault();

    const contextMenu = {
      options: [
        {
          label: 'remove',
          events: {
            onClick: () => {
              const params = {
                inputs: this.getInputRefs().listRef,
                outputs: this.getOutputsRef().listRef,
                id: this.state.id,
              };

              this.props.spaceActions.onContextMenu(false);
              this.props.spaceActions.onNodeRemove(params);
            },
          },
        },
      ],
      onClose: () => this.setState({ contextMenuOpen: false }),
    };

    this.setState({ selected: true, contextMenuOpen: true }, () =>
      this.props.spaceActions.onContextMenu(this.state.contextMenuOpen, contextMenu),
    );
  };

  render() {
    const nodeClassNames = classNames(styles.node, {
      [styles.selected]: this.state.selected,
      [styles.disabled]: this.props.disabled,
      [styles.dragging]: this.state.dragging,
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
        <div
          id={this.state.id}
          className={nodeClassNames}
          onDoubleClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
        >
          <div className={headerClassNames}>{this.props.title}</div>
          <div className={styles.body}>
            <NodeListInputs
              ref={this.inputsRef}
              inputs={this.props.inputs}
              events={this.props.events.nodeInputs}
              nodeId={this.state.id}
              disabled={this.props.disabled}
            />
            <NodeListOutputsComponent
              ref={this.outputsRef}
              outputs={this.props.outputs}
              events={this.props.events.nodeOutputs}
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
