import React, { Component } from 'react';
import debounce from 'lodash/debounce';

import { SvgComopnent } from './svg/svg.component';
import { NodesComponent } from './nodes/nodes.component';
import { LineComponent } from '../line/line.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { NodeComponent } from '../node/node.component';

import {
  MarketContext,
  CurrentConnectionContext,
  PortsEventsContext,
  NodeActionsContext,
  NodeEventsContext,
  ConnectionLineActionsContext,
} from 'app/graph-lib/contexts';

import { MOUSE_MOVE, MOUSE_UP, NODE_TYPES } from '../../dictionary';

import {
  connectionRemoveEvent,
  connectionAddEvent,
  connectionCalculateEvent,
} from 'app/events/connections/connections.actions';

import { spaceEventBus } from 'app/events/space/spaceEventBus';
import { SPACE_MODEL_SAVE } from 'app/events/space/space.action-types';
import { spaceModelSaveEvent } from 'app/events/space/space.actions';

import styles from './space.module.scss';

const uuid = require('uuid/v4');

/** Class representing a graph space
 * @extends Component
 */
export class GraphSpace extends Component {
  /**
   * It will prepare `GraphSpace` state based on passed props, also create `spaceContext` and set-up custom events
   *
   * @param {Object} props - props of component
   * @param {ConnectionLine[]} props.connections - array connections of nodes
   * @param {NodeComponent[]} props.nodes - array of nodes
   */
  constructor(props) {
    super(props);

    //if (process.env.NODE_ENV !== 'production') {
    //  const { whyDidYouUpdate } = require('why-did-you-update');
    //  whyDidYouUpdate(React);
    //}

    this.state = {
      connections: { ...props.connections },
      nodes: this.prepareNodes(props.nodes),
      connecting: false,
      showConnections: false,
      isContextMenuOpen: false,
    };

    this.portsEvents = {
      output: { onMouseDown: this.handleOutputMouseDown, onMouseUp: this.handleOutputMouseUp },
      input: { onMouseDown: this.handleInputMouseDown, onMouseUp: this.handleInputMouseUp },
    };

    this.nodesActions = {
      onAdd: this.handleNodeAdd,
      onConnectionRemove: this.handleConnectionRemove,
      onContextMenu: this.handleContextMenuState,
      onDoubleClick: this.handleNodeDoubleClick,
      onEdit: this.handleNodeEdit,
      onRemove: this.handleNodeRemove,
      onUpdate: this.handleNodeUpdate,
      onCreateRef: this.handleNodeRef,
      getConnectionById: this.getConnectionById,
    };

    this.connectionLineActions = {
      onConnectionRemove: this.handleConnectionRemove,
      onContextMenu: this.handleContextMenuState,
    };

    this.nodeEvents = {
      onDrag: this.handleNodeDrag,
      onStart: this.handleNodeDragStart,
      onStop: this.handleNodeDragStop,
    };

    this.currentConnection = undefined;
    this.nodeRefs = {};

    window.space = this;

    this.debouncedSaveSpaceModel = debounce(this.handleSaveSpaceModel, 500);
  }

  /**
   * When component is mounted it will set up listeners, update connections and set flag to display connections
   */
  componentDidMount() {
    document.addEventListener(MOUSE_MOVE, this.handleMouseMove);
    document.addEventListener(MOUSE_UP, this.handleMouseUp);
    spaceEventBus.on(SPACE_MODEL_SAVE, this.debouncedSaveSpaceModel);

    connectionCalculateEvent({
      calculateConnections: this.calculateConnections,
    });

    this.setState({ showConnections: true });
  }

  /**
   * When component will be unmounted it will remove all listeners
   */
  componentWillUnmount() {
    document.removeEventListener(MOUSE_MOVE, this.handleMouseMove);
    document.removeEventListener(MOUSE_UP, this.handleMouseUp);
    spaceEventBus.removeListener(SPACE_MODEL_SAVE, this.debouncedSaveSpaceModel);
  }

  /**
   * It will wrap `Node` component to `NodeWithContextComponent` to allow read `spaceContext`
   *
   * @param {NodeComponent[]} nodes - list of nodes read from saved model
   * @return {*}
   */
  prepareNodes = nodes => nodes.map(node => <NodeComponent {...node} key={node.id} />);

  /**
   * Allow to save `GraphSpace` model to local storage as `JSON` string
   */
  handleSaveSpaceModel = () => {
    const { onSpaceModelSave } = this.props;

    const model = this.toJSON();

    onSpaceModelSave({
      payload: model,
      callback: data => console.log(data),
    });
  };

  handleNodeRef = (id, ref) => (this.nodeRefs[id] = ref);

  /**
   * Handler for mouse up event when connection is created. It will remove temporary `ConnectionLine`
   * and update connections list also clear `this.currentConnection` to `undefined`.
   * It happens when user want to create connection but the event is dropped out of node input component
   *
   * @param {MouseEvent} e - event when mouse is up
   * @param params
   * @param callback
   */
  handleMouseUp = (e, params, callback) => {
    if (this.state.connecting) {
      this.setState({ connecting: false }, () => {
        this.setState(
          prev => {
            const { connections } = prev;

            if (connections && this.currentConnection) {
              delete connections[this.currentConnection];

              return {
                connections,
              };
            }
          },
          () => {
            this.currentConnection = undefined;
            connectionCalculateEvent({ calculateConnections: this.calculateConnections });
          },
        );
      });
    }
  };

  /**
   * Handler for mouse move event. When mouse is moving it will update state with current position of cursor.
   * It is used to display contex menu position
   * @param {MouseEvent} e - event when mouse is moving
   * @param params
   * @param callback
   */
  handleMouseMove = (e, params, callback) => {
    this.setState({
      mousePos: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  };

  /**
   * Handler for mouse down event on node output component. It generates new uuid of `ConnectionLine` component.
   * Set start point of connection as output component of node.
   *
   * @param {MouseEvent} e - event when mouse id down on node output component
   * @param params
   * @param callback
   */
  handleOutputMouseDown = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    this.currentConnection = uuid();

    const { id, nodeId, productId } = params;

    this.setState(
      prev => ({
        connecting: true,
        connections: {
          ...prev.connections,
          [this.currentConnection]: {
            start: id,
            startNode: nodeId,
            productId,
          },
        },
      }),
      () => {
        callback(this.currentConnection);
        connectionCalculateEvent({ calculateConnections: this.calculateConnections });
      },
    );
  };

  /**
   * Handler for mouse up event on node output component
   *
   * @param {MouseEvent} e
   * @param params
   * @param callback
   */
  handleOutputMouseUp = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('output mouse up');
  };

  /**
   * Handler for mouse down event on node input component
   *
   * @param {MouseEvent} e
   * @param params
   * @param callback
   */
  handleInputMouseDown = (e, params, callback) => {
    console.log('input mouse down');
  };

  /**
   * Handler form mouse up event on node input component. It will update `currentConnection` end point with id where connection was dropped.
   * It will clear `currentConnection`, fire `updateConnectionsEvent` and `saveSpaceModelEvent` events.
   *
   * @param {MouseEvent} e - event when mouse is up on node input component
   * @param {Object} params - input node props passed from node component
   * @param {String} params.id - input uuid
   * @param callback
   * @return {null}
   */
  handleInputMouseUp = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.currentConnection) return null;

    const connection = this.state.connections[this.currentConnection];

    const { id, nodeId } = params;

    this.setState(
      prev => ({
        connections: {
          ...prev.connections,
          [this.currentConnection]: {
            ...connection,
            end: id,
            endNode: nodeId,
          },
        },
      }),
      () => {
        callback(this.currentConnection);
        const connection = this.state.connections[this.currentConnection];
        this.currentConnection = undefined;

        connectionAddEvent({ calculateConnections: this.calculateConnections, ...connection });
        spaceModelSaveEvent();
      },
    );
  };

  /**
   * Handler for node drag. It is passed to `Draggable` component
   * @param {Event} event
   * @param {DraggableData} data - data passed from `Draggable`
   * @param {HTMLElement} data.node - dragged node element
   * @param {number} data.x - x position of node
   * @param {number} data.y - y position of node
   * @param {number} data.deltaX - deltaX position of node
   * @param {number} data.deltaY - deltaY position of node
   * @param {Function} callback
   */
  handleNodeDrag = (event, data, callback) => {};

  /**
   * Handler for node drag start. It is passed to `Draggable` component
   * It will set flag `dragging` to true
   *
   * @param {Event} event
   * @param {DraggableData} data - data passed from `Draggable`
   * @param {HTMLElement} data.node - dragged node element
   * @param {number} data.x - x position of node
   * @param {number} data.y - y position of node
   * @param {number} data.deltaX - deltaX position of node
   * @param {number} data.deltaY - deltaY position of node
   * @param {Function} callback
   */
  handleNodeDragStart = (event, data, callback) => {
    this.setState({ dragging: true });
  };

  /**
   * Handler for node drag start. It is passed to `Draggable` component
   * It will set flag `dragging` to false
   *
   * @param {Event} event
   * @param {DraggableData} data - data passed from `Draggable`
   * @param {HTMLElement} data.node - dragged node element
   * @param {number} data.x - x position of node
   * @param {number} data.y - y position of node
   * @param {number} data.deltaX - deltaX position of node
   * @param {number} data.deltaY - deltaY position of node
   * @param {Function} callback
   */
  handleNodeDragStop = (event, data, callback) => {
    this.setState({ dragging: false });

    spaceModelSaveEvent();
  };

  /**
   * Handler for `contextMenuState`. It will set parameters for context menu
   *
   * @param {boolean} state - determine state if context menu is open or closed
   * @param {Object} params - params of context menu
   * @param {Object[]} params.options - array of context menu options
   * @param {Function} params.onClose - function called when context menu is closed
   * @param {Function} callback
   */
  handleContextMenuState = (state, params, callback) =>
    this.setState(prev => ({
      isContextMenuOpen: state,
      contextMenuPosition: prev.mousePos,
      contextMenuParams: params,
    }));

  /**
   * This method remove connection by connection ID.
   * It will remove connection from connections object and update GraphSpace state with new list of connections
   *
   * @param {string} id - connection uuid
   * @param {Function} callback - callback when function is fired
   *
   */
  handleConnectionRemove = (id, callback) => {
    const connection = this.getConnectionById(id);

    this.setState(this.removeConnection(id), () => {
      !!callback && callback();

      connectionRemoveEvent({ ...connection, calculateConnections: this.calculateConnections });

      spaceModelSaveEvent();
    });
  };

  removeConnection = id => state => {
    const connections = { ...state.connections };

    if (connections[id]) {
      delete connections[id];
    }

    return { connections };
  };

  /**
   * This method update connections counter for specific node based on node ID
   * @param {string} id - node uuid
   * @param {string} type - input type 'input' || 'output'
   * @param {Function} callback - callback when function is fired
   *
   * @return {number} - amount of connections
   */
  calculateConnections = (id, type, callback) => {
    const results =
      type === 'input'
        ? Object.values(this.state.connections).filter(connection => connection.end === id)
        : Object.values(this.state.connections).filter(connection => connection.start === id);

    return results.length;
  };

  /**
   * This method export GraphSpace state to json format based on reference to all components
   * (Nodes,Input and Output list) and connections from state. It will export positions and all Node props
   *
   * @return {Object} - simple space model
   */
  toJSON = () => {
    const nodes = this.state.nodes
      .map((node, index) => {
        const props = node.props;
        const draggableProps = props.draggableProps;

        const ref = Object.values(this.nodeRefs)[index];
        const componentInputs = ref.getInputsRef() || [];
        const componentOutputs = ref.getOutputsRef() || [];
        const inputs = props.inputs || [];
        const outputs = props.outputs || [];
        const position = ref.getPosition();
        const id = ref.getId();
        const type = ref.getType();

        const newInputs = () => {
          if (type === NODE_TYPES.marketIn || type === NODE_TYPES.marketOut) {
            return [];
          }

          return inputs.map((input, index) => {
            const item = componentInputs[index];
            const id = item.getId();
            const connectionId = item.getConnectionId();
            const connections = item.getConnections();

            return { ...input, id, connectionId, connections };
          });
        };

        const newOutputs = () => {
          return outputs.map((output, index) => {
            if (type === NODE_TYPES.marketIn || type === NODE_TYPES.marketOut) {
              return [];
            }

            const item = componentOutputs[index];
            const id = item.getId();
            const connectionId = item.getConnectionId();
            const connections = item.getConnections();

            return { ...output, id, connectionId, connections };
          });
        };

        return {
          ...props,
          id,
          type,
          inputs: newInputs(),
          outputs: newOutputs(),
          draggableProps: {
            ...draggableProps,
            defaultPosition: position,
          },
        };
      })
      .map(
        ({
          eventTypes,
          excludeScrollbar,
          outsideClickIgnoreClass,
          preventDefault,
          stopPropagation,
          spaceProps,
          ...other
        }) => other,
      );

    const connections = this.state.connections;

    return { nodes, connections };
  };

  /**
   * This method handle node add. It will create new node from parameters (if they are exist) or with defaults parameters.
   * It will update GraphSpace state with new list of nodes. New node is created from NodeWithContextComponent.
   *
   * @param {Object} params - node properties
   * @param {Object[]} params.inputs - list of node inputs
   * @param {Object[]} params.outputs - list of node outputs
   */
  handleNodeAdd = (params = {}) => {
    const id = uuid();
    const inputs = (params.inputs || []).map(input => ({ id: uuid(), ...input }));
    const outputs = (params.outputs || []).map(input => ({ id: uuid(), ...input }));

    const props = {
      id,
      ...params,
      process: {},
      key: id,
      inputs,
      outputs,
    };

    this.setState(prev => ({ nodes: [...prev.nodes, <NodeComponent {...props} />] }), () => spaceModelSaveEvent());
  };

  /**
   * This method handle node remove.
   * When node is removed all connections related to node input or output are removed too based on node ID
   *
   * @param {Object} node properties
   * @param {string} node.id - uuid of node
   * @param {Object} node.inputs - reference to the list of node inputs
   * @param {Object} node.outputs - reference to the list of node outputs
   */
  handleNodeRemove = ({ id, inputs, outputs }) => {
    const nodes = this.state.nodes.filter(item => item.props.id !== id);
    const connections = { ...this.state.connections };

    delete this.nodeRefs[id];

    const removeConnectionByIOId = id => {
      for (const key in connections) {
        const { start, end } = connections[key];

        if (start === id || end === id) {
          delete connections[key];
        }
      }
    };

    Object.values(inputs).map(({ props: { id } }) => removeConnectionByIOId(id));
    Object.values(outputs).map(({ props: { id } }) => removeConnectionByIOId(id));

    this.setState({ nodes, connections }, () => {
      connectionCalculateEvent({ calculateConnections: this.calculateConnections });
      spaceModelSaveEvent();
    });
  };

  /**
   * This method handle start node editing. It pass node parameters to function passed to onNodeEdit prop of GraphSpace
   * @param {Object} node properties
   * @param {string} node.id - uuid of node
   * @param {Object} node.inputs - reference to the list of node inputs
   * @param {Object} node.outputs - reference to the list of node outputs
   */
  handleNodeEdit = ({ id }) => {
    const node = this.nodeRefs[id];
    if (node && this.props.onNodeEdit) this.props.onNodeEdit(node);
  };

  /**
   * This method handle node update
   * @param {Object} node - new node state when it is editing in modal
   * @param {string} node.id - uuid of node
   * @param {Object[]} node.inputs - list of node inputs
   * @param {Object[]} node.outputs - list of node outputs
   * @param {Object} node.params - rest params after node destructing
   */
  handleNodeUpdate = ({ id, inputs = [], outputs = [], ...params }) => {
    const nodes = [...this.state.nodes];
    const nodeIndex = nodes.findIndex(node => node.props.id === id);
    const node = nodes[nodeIndex];

    inputs = inputs.map((input, index) => {
      const oldInput = node.props.inputs[index] || {};

      return { ...oldInput, ...input };
    });

    outputs = outputs.map((output, index) => {
      const oldOutput = node.props.outputs[index] || {};

      return { ...oldOutput, ...output };
    });

    const props = {
      ...params,
      inputs,
      outputs,
    };

    const newNode = React.cloneElement(node, props);

    nodes[nodeIndex] = newNode;

    this.setState({ nodes }, () => {
      connectionCalculateEvent({ calculateConnections: this.calculateConnections });
      spaceModelSaveEvent();
    });
  };

  /**
   * This method handle external double click on node
   */
  handleNodeDoubleClick = node => {
    if (this.props.onNodeDoubleClick) this.props.onNodeDoubleClick(node);
  };

  /**
   * This method reset all connections and update nodes connections and save model state
   */
  resetConnections = () =>
    this.setState({ connections: [] }, () => {
      connectionCalculateEvent({ calculateConnections: this.calculateConnections });
      spaceModelSaveEvent();
    });

  getConnectionById = connectionId => {
    return this.state.connections[connectionId];
  };

  getNodeById = nodeId => {
    return this.nodeRefs[nodeId];
  };

  render() {
    const currentConnectionContext = this.currentConnection
      ? this.getConnectionById(this.currentConnection)
      : undefined;

    let newLine = null;

    if (this.state.connecting) {
      let start = this.state.connections[this.currentConnection].start;

      let end = { x: this.state.mousePos.x, y: this.state.mousePos.y };

      newLine = <LineComponent start={start} end={end} connecting />;
    }

    return (
      <NodeEventsContext.Provider value={this.nodeEvents}>
        <NodeActionsContext.Provider value={this.nodesActions}>
          <PortsEventsContext.Provider value={this.portsEvents}>
            <MarketContext.Provider value={this.props.market}>
              <CurrentConnectionContext.Provider value={currentConnectionContext}>
                <ConnectionLineActionsContext.Provider value={this.connectionLineActions}>
                  <section id="graphSpace" className={styles.space}>
                    <ContextMenuComponent
                      position={this.state.contextMenuPosition}
                      isOpen={this.state.isContextMenuOpen}
                      onContextMenu={this.handleContextMenuState}
                      {...this.state.contextMenuParams}
                    />
                    <NodesComponent>{this.state.nodes}</NodesComponent>
                    <SvgComopnent ref="svgComponent">
                      {this.state.showConnections &&
                        Object.entries(this.state.connections).map(
                          ([key, { start, end, startNode }]) =>
                            !!start && !!end ? (
                              <LineComponent
                                id={key}
                                start={start}
                                end={end}
                                key={key}
                                process={this.getNodeById(startNode).getProcess()}
                                machineState={this.getNodeById(startNode).getState()}
                                isMachneBusy={this.getNodeById(startNode).getBusy()}
                              />
                            ) : null,
                        )}
                      {newLine}
                    </SvgComopnent>
                  </section>
                </ConnectionLineActionsContext.Provider>
              </CurrentConnectionContext.Provider>
            </MarketContext.Provider>
          </PortsEventsContext.Provider>
        </NodeActionsContext.Provider>
      </NodeEventsContext.Provider>
    );
  }
}
