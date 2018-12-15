import React, { Component } from 'react';
import Draggable from 'react-draggable';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import { withNodeEvents, withNodeActions, withMarket } from 'app/graph/contexts';

import { timeParser } from 'app/utils/time-parser.util';

import { NODE_TYPES, MACHINE_STATE, NODE_INPUT, NODE_OUTPUT } from '../../dictionary';

import { NodeList } from '../list/node-list.component';
import { BuyButtonComponent, SellButtonComponent } from './types';

import { NodeTitleComponent } from './title/node-title.component';
import { NodeListItemComponent } from 'app/graph/components/list/item/node-list-item.component';

import { processEventBus } from 'app/events/process/processEventBus';
import { PROCESS_GOODS_EMIT } from 'app/events/process/process.action-types';

import { connectionsEventBus } from 'app/events/connections/connectionsEventBus';
import { CONNECTION_REMOVE, CONNECTION_ADD } from 'app/events/connections/connections.action-types';

import { processGoodsUpdate } from 'app/redux/process/process.actions';

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

    const state = props.type === NODE_TYPES.step ? { state: MACHINE_STATE.cold } : {};

    this.state = {
      selected: false,
      connectedInputs: 0,
      connectedOutput: 0,
      dragging: false,
      position: props.draggableProps.defaultPosition,
      inputsRef: {},
      outputsRef: {},
      busy: new Array(Object.keys(props.process?.products || {}).length).fill(false),
      ...state,
      processIndex: 0,
    };

    this.timers = new Array(this.state.busy.length).fill(null);
  }

  static getDerivedStateFromProps(props, state) {
    if (Object.keys(props.process?.products || {}).length !== state.busy.length) {
      return { busy: new Array(Object.keys(props.process?.products || {}).length).fill(false) };
    }

    return null;
  }

  /**
   * When component is mounted `node` is set by `findDOMNode(this)` and node is registered by `createNodeRef`
   */
  componentDidMount() {
    const {
      nodeActions: { onCreateRef },
    } = this.props;

    this.node = findDOMNode(this);
    onCreateRef(this.props.id, this);

    this.setUpNode();

    connectionsEventBus.on(CONNECTION_ADD, this.handleConnectionsChange);
    connectionsEventBus.on(CONNECTION_REMOVE, this.handleConnectionsChange);

    processEventBus.on(PROCESS_GOODS_EMIT, this.handleGoodsEmit);
  }

  handleGoodsEmit = () => {
    const { type } = this.props;

    if (type === NODE_TYPES.step) {
      const {
        process: { products },
        goods,
      } = this.props;

      const { processIndex } = this.state;
      if (this.state.busy[processIndex]) {
        return null;
      }

      const processDescriptions = Object.entries({ ...products } || {});
      const [outputProductId, value] = processDescriptions[processIndex];
      const { requirements = [] } = value;

      //check requirements for one product
      const shouldStartProcess = requirements.map((product, i) => {
        const { productId: requiredProductId, amount: requiredAmount } = product;

        const inputs = this.getInputsRef();
        const connections = inputs
          .map(input => this.props.nodeActions.getConnectionById(input.getConnectionId()))
          .filter(connection => connection !== undefined);

        if (!connections.length) {
          return false;
        }

        const { startNode } = connections.find(connection => requiredProductId === connection.productId) || {};

        return Number(get(goods, [startNode, requiredProductId], 0)) >= Number(requiredAmount);
      });

      if (!shouldStartProcess.some(item => item === false)) {
        if (this.state.state === MACHINE_STATE.ready) {
          this.startProcess(outputProductId, processIndex);
        }
      }
    }
  };

  componentWillUnmount() {
    connectionsEventBus.removeListener(CONNECTION_ADD, this.handleConnectionsChange);
    connectionsEventBus.removeListener(CONNECTION_REMOVE, this.handleConnectionsChange);
    processEventBus.removeListener(PROCESS_GOODS_EMIT, this.handleGoodsEmit);

    this.timers.map(timer => {
      clearTimeout(timer);
    });
  }

  handleConnectionsChange = payload => {
    const { startNode, endNode } = payload;
    const { id } = this.props;

    if (startNode === id || endNode === id) {
      this.setState({ inputsRef: {}, outputsRef: {} }, () => this.forceUpdate());
    }
  };

  preparePorts = ({ ports, type, defaultLabel, refName }) => {
    return ports.map(({ label, id, maxConnections, disabled, productId, connectionId, connections }) => (
      <NodeListItemComponent
        connectionId={connectionId}
        disabled={disabled}
        id={id}
        key={id}
        label={label || defaultLabel}
        maxConnections={maxConnections || 1}
        nodeId={this.props.id}
        productId={productId}
        type={type}
        connections={connections}
        ref={ref => this.addRef(id, ref, refName)}
        goods={this.props.goods}
        nodeType={this.props.type}
      />
    ));
  };

  addRef = (id, ref, refName) => {
    if (ref && refName) {
      const oldRef = this.state[refName][id];

      if (!isEqual(oldRef, ref)) {
        this.setState(prev => ({
          [refName]: {
            ...prev[refName],
            [id]: ref,
          },
        }));
      }
    }
  };

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
   * @return {Array}
   */
  getInputsRef = () => Object.values(this.state.inputsRef);

  /**
   * Getter for `outputsRef`
   * @return {Array}
   */
  getOutputsRef = () => Object.values(this.state.outputsRef);

  getProcess = () => this.props.process;

  getState = () => this.state.state;

  getBusy = () => this.state.busy;

  setUpNode = () => {
    const { process, type } = this.props;

    if (NODE_TYPES.step === type) {
      const { setup } = process;

      if (!setup) {
        console.log('Please set up time machine!');
      } else {
        const time = timeParser(setup);

        this.setState(
          {
            state: MACHINE_STATE.preparing,
          },
          () => {
            setTimeout(() => {
              this.setState({ state: MACHINE_STATE.ready });
            }, time);
          },
        );
      }
    }
  };

  startProcess = (newProductId, processIndex) => {
    this.setState(
      prev => {
        const nextProcessIndex = processIndex + 1 === prev.busy.length ? 0 : processIndex + 1;
        prev.busy[processIndex] = true;

        return {
          busy: [...prev.busy],
          processIndex: nextProcessIndex,
        };
      },
      () => {
        const { process, id } = this.props;
        const { duration, products } = process;
        const time = timeParser(duration);

        products[newProductId].requirements.forEach(async ({ productId, amount }) => {
          const inputs = this.getInputsRef();
          const connections = inputs.map(input => this.props.nodeActions.getConnectionById(input.getConnectionId()));
          const { startNode } = connections.find(connection => productId === connection.productId);

          await this.props.processGoodsUpdate({ productId, amount: amount * -1, nodeId: startNode });
        });
        //start next process
        //this.handleGoodsEmit();//TODO: why doesn't it work?

        this.timers[processIndex] = setTimeout(() => {
          const {
            process: { products },
          } = this.props;

          ///update state and process emit event
          const payload = { productId: newProductId, amount: products[newProductId].amount };

          this.props.processGoodsUpdate({ ...payload, nodeId: id });
          processEventBus.emit(PROCESS_GOODS_EMIT, payload);

          this.setState(prev => {
            prev.busy[processIndex] = false;
            return {
              busy: [...prev.busy],
            };
          });

          this.handleGoodsEmit();
        }, time);
      },
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const { process } = this.props;
    const { state } = this.state;

    if (!!process.setup && process.setup !== prevProps.process.setup && state === MACHINE_STATE.cold) {
      this.setUpNode();
    }

    if (prevState.state === MACHINE_STATE.preparing && this.state.state === MACHINE_STATE.ready) {
      this.handleGoodsEmit();
    }
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
                inputs: this.getInputsRef(),
                outputs: this.getOutputsRef(),
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
    return Object.values(this.props.market)
      .filter(({ processId }) => !processId)
      .map(({ label, amount, id }) => ({
        productId: id,
        label: `${label} (${amount})`,
        id,
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

    const inputs = this.preparePorts({
      ports: this.getInputs(),
      type: NODE_INPUT,
      defaultLabel: 'input',
      refName: 'inputsRef',
    });

    const outputs = this.preparePorts({
      ports: this.getOutputs(),
      type: NODE_OUTPUT,
      defaultLabel: 'output',
      refName: 'outputsRef',
    });

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
          <NodeTitleComponent
            {...this.props}
            state={this.state.state}
            className={headerClassNames}
            busy={this.state.busy}
          />

          <div className={styles.body}>
            <NodeList>{inputs}</NodeList>

            {type === NODE_TYPES.buy && (
              <BuyButtonComponent outputs={this.getOutputsRef()} inputs={this.getInputsRef()} nodeId={this.props.id} />
            )}

            {type === NODE_TYPES.sell && (
              <>
                <SellButtonComponent
                  outputs={this.getOutputsRef()}
                  inputs={this.getInputsRef()}
                  nodeId={this.props.id}
                  startNode={
                    this.props.nodeActions.getConnectionById(this.getInputsRef()[0]?.getConnectionId())?.startNode
                  }
                />
              </>
            )}

            <NodeList>{outputs}</NodeList>
          </div>
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = ({ process: { goods } }) => ({ goods });

const mapDispatchToProps = {
  processGoodsUpdate,
};

export const NodeComponent = compose(
  withNodeEvents,
  withNodeActions,
  withMarket,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(onClickOutside(Node));
