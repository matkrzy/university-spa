import React, { Component } from 'react';
import Draggable from 'react-draggable';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import { compose } from 'redux';

import { withNodeEvents, withNodeActions, withMarket } from 'app/graph-lib/contexts';

import { NODE_TYPES } from '../../dictionary';
import { NodeListInputsComponent } from '../list/inputs/node-list-inputs.component';
import { NodeListOutputsComponent } from '../list/outputs/node-list-outputs.component';
import { BuyButtonComponent, SellButtonComponent } from './types';

import styles from './node.module.scss';

/** Class representing a `NodeComponent`
 * @extends Component
 */
class Node extends Component {
  static defaultProps = {
    inputs: [],
    outputs: [],
    title: 'Node',
    draggableProps: {},
    type: NODE_TYPES.step,
  };

  /**
   * It will create state for `NodeComponent` and inputs and outputs ref
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
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
  getId = () => this.props.id;

  /**
   * Getter for `NodeComponent` type
   * @return {NODE_TYPES} node type
   */
  getType = () => this.props.type;

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
    const {
      nodeActions: { onCreateRef },
    } = this.props;

    this.node = findDOMNode(this);
    onCreateRef(this.props.id, this);
  }

  /**
   * Handler for click on node. It will set flag `selected` to true and call
   * function under `spaceActions.onNodeDoubleClick`
   */
  handleClick = () => {
    const {
      nodeActions: { onDoubleClick },
    } = this.props;

    this.setState({ selected: true });
    onDoubleClick(this);
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
    const {
      nodeEvents: { onStart },
    } = this.props;

    this.setState({ dragging: true });
    onStart(e, { ...data, id: this.props.id });
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
    const {
      nodeEvents: { onDrag },
    } = this.props;

    onDrag(e, { ...data, id: this.props.id });
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
    const {
      nodeEvents: { onStop },
    } = this.props;

    const { x, y } = data;

    this.setState({ dragging: false, position: { x, y } });

    onStop(e, { ...data, id: this.props.id });
  };

  /**
   * Handler for context menu. It will create context menu and open it
   * @param e
   */
  handleContextMenu = e => {
    e.preventDefault();

    const {
      nodeActions: { onContextMenu, onRemove, onEdit },
    } = this.props;

    const contextMenu = {
      options: [
        {
          label: 'remove',
          events: {
            onClick: () => {
              const params = {
                inputs: this.getInputsRefs().listRef,
                outputs: this.getOutputsRef().listRef,
                id: this.props.id,
              };

              onContextMenu(false);
              onRemove(params);
            },
          },
        },
        {
          label: 'edit',
          events: {
            onClick: () => {
              const params = {
                id: this.props.id,
              };

              onContextMenu(false);
              onEdit(params);
            },
          },
        },
      ],
      onClose: () => this.setState({ contextMenuOpen: false }),
    };

    this.setState({ selected: true, contextMenuOpen: true }, () =>
      onContextMenu(this.state.contextMenuOpen, contextMenu),
    );
  };

  transformProducts = () => {
    const { products, state } = this.props.market;

    return Object.entries(products).map(([key, { label }]) => ({
      productId: key,
      label: `${label} (${state[key]})`,
      id: key,
    }));
  };

  getInputs = () => {
    const { type } = this.props;

    if (type === NODE_TYPES.marketIn) {
      return this.transformProducts();
    }

    return this.props.inputs;
  };

  getOutputs = () => {
    const { type } = this.props;

    if (type === NODE_TYPES.marketOut) {
      return this.transformProducts();
    }

    return this.props.outputs;
  };

  render() {
    const { type } = this.props;

    const inputs = this.getInputs();
    const outputs = this.getOutputs();

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
      <Draggable {...draggableProps} bounds={bounds} disabled={this.props.disabled} cancel=".form-control">
        <div
          id={this.props.id}
          className={nodeClassNames}
          onDoubleClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
        >
          <div className={headerClassNames}>{this.props.title}</div>
          <div className={styles.body}>
            <NodeListInputsComponent ref={this.inputsRef} inputs={inputs} nodeId={this.props.id} />

            {type === NODE_TYPES.buy && <BuyButtonComponent inputs={this.getInputsRefs()} />}

            {type === NODE_TYPES.sell && <SellButtonComponent outputs={this.getOutputsRef()} />}

            <NodeListOutputsComponent ref={this.outputsRef} outputs={outputs} nodeId={this.props.id} />
          </div>
        </div>
      </Draggable>
    );
  }
}

export const NodeComponent = compose(
  withNodeEvents,
  withNodeActions,
  withMarket,
)(onClickOutside(Node));
