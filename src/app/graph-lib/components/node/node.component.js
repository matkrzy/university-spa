import React, { Component } from 'react';
import Draggable from 'react-draggable';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';

import { NodeListInputs } from '../list/inputs/node-list-inputs.component';
import { NodeListOutputsComponent } from '../list/outputs/node-list-outputs.component';

import styles from './node.module.scss';

const uuid = require('uuid/v4');

/** Class representing a `NodeComponent`
 * @extends Component
 */
class NodeComponent extends Component {
  static defaultProps = {
    inputs: [],
    outputs: [],
    title: 'Node',
    draggableProps: {},
  };

  /**
   * It will create state for `NodeComponent` and inputs and outputs ref
   * @param props
   */
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

  /**
   * Getter for position of `NodeComponent`
   * @return {draggableProps.defaultPosition|{x, y}|*}
   */
  getPosition = () => this.state.position;

  /**
   * Getter for `NodeComponent` id
   * @return {string} uuid of node
   */
  getId = () => this.state.id;

  /**
   * Getter for `inputsRef`
   * @return {Object}
   */
  getInputsRefs = () => this.inputsRef.current;

  /**
   * Getter for `outputsRef`
   * @return {null}
   */
  getOutputsRef = () => this.outputsRef.current;

  /**
   * When component is mounted `node` is set by `findDOMNode(this)` and node is registered by `createNodeRef`
   */
  componentDidMount() {
    this.node = findDOMNode(this);
    this.props.createNodeRef(this.state.id, this);
  }

  /**
   * Handler for click on node. It will set flag `selected` to true and call
   * function under `spaceActions.onNodeDoubleClick`
   */
  handleClick = () => {
    this.setState({ selected: true });
    this.props.spaceActions.onNodeDoubleClick(this);
  };

  /**
   * Handler for click outside of component. It will set flag `selected` to `false`
   */
  handleClickOutside() {
    this.setState({ selected: false });
  }

  /**
   * Handler on drag start of `NodeComponent`. It will set flag `dragging` to true
   * and call `draggableEvents.onStart` from `SpaceContext`
   * @param e
   * @param {DraggableData} data - data passed from `Draggable`
   * @param {HTMLElement} data.node - dragged node element
   * @param {number} data.x - x position of node
   * @param {number} data.y - y position of node
   * @param {number} data.deltaX - deltaX position of node
   * @param {number} data.deltaY - deltaY position of node
   */
  onStart = (e, data) => {
    this.setState({ dragging: true });
    this.props.draggableEvents.onStart(e, { ...data, id: this.state.id });
  };

  /**
   * Handler for on drag of `NodeComponent`. It will call `draggableEvents.onDrag` from `SpaceContext`
   * @param e
   * @param {DraggableData} data - data passed from `Draggable`
   * @param {HTMLElement} data.node - dragged node element
   * @param {number} data.x - x position of node
   * @param {number} data.y - y position of node
   * @param {number} data.deltaX - deltaX position of node
   * @param {number} data.deltaY - deltaY position of node
   */
  onDrag = (e, data) => {
    this.props.draggableEvents.onDrag(e, { ...data, id: this.state.id });
  };

  /**
   * Handler for on drag stop of `NodeComponent`. It set flag `dragging` to false and update `
   * position` object in `state` also call `draggableEvents.onStop` from `SpaceContext`
   * @param e
   * @param {DraggableData} data - data passed from `Draggable`
   * @param {HTMLElement} data.node - dragged node element
   * @param {number} data.x - x position of node
   * @param {number} data.y - y position of node
   * @param {number} data.deltaX - deltaX position of node
   * @param {number} data.deltaY - deltaY position of node
   */
  onStop = (e, data) => {
    const { x, y } = data;

    this.setState({ dragging: false, position: { x, y } });

    this.props.draggableEvents.onStop(e, { ...data, id: this.state.id });
  };

  /**
   * Handler for context menu. It will create context menu and open it
   * @param e
   */
  handleContextMenu = e => {
    e.preventDefault();

    const contextMenu = {
      options: [
        {
          label: 'remove',
          events: {
            onClick: () => {
              const params = {
                inputs: this.getInputsRefs().listRef,
                outputs: this.getOutputsRef().listRef,
                id: this.state.id,
              };

              this.props.spaceActions.onContextMenu(false);
              this.props.spaceActions.onNodeRemove(params);
            },
          },
        },
        {
          label: 'edit',
          events: {
            onClick: () => {
              const params = {
                id: this.state.id,
              };

              this.props.spaceActions.onContextMenu(false);
              this.props.spaceActions.onNodeEdit(params);
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
            />
            <NodeListOutputsComponent
              ref={this.outputsRef}
              outputs={this.props.outputs}
              events={this.props.events.nodeOutputs}
              nodeId={this.state.id}
            />
          </div>
        </div>
      </Draggable>
    );
  }
}

export const Node = onClickOutside(NodeComponent);
