import React, { Component } from 'react';
import remove from 'lodash/remove';
import findKey from 'lodash/findKey';

import { SvgComopnent } from './svg/svg.component';
import { NodesComponent } from './nodes/nodes.component';
import { LineWithContextComponent } from '../line/line-with-context.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { NodeWithContextComponent } from '../node/node-with-context.component';

import { SpaceContext } from '../../contexts/space.context';

import {
  SAVE_SPACE_MODEL,
  UPDATE_CONNECTIONS_EVENT,
  MOUSE_MOVE,
  MOUSE_UP,
  LOCAL_STORAGE_SPACE_KEY,
} from '../../dictionary';

import styles from './space.module.scss';

const uuid = require('uuid/v4');

export class GraphSpace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connections: { ...props.connections },
      nodes: this.prepareNodes(props.nodes),
      connecting: false,
      showConnections: false,
      isContextMenuOpen: false,
    };

    this.spaceContext = {
      events: {
        nodeOutputs: { onMouseDown: this.handleOutputMouseDown, onMouseUp: this.handleOutputMouseUp },
        nodeInputs: { onMouseDown: this.handleInputMouseDown, onMouseUp: this.handleInputMouseUp },
      },
      spaceActions: {
        onNodeAdd: this.handleNodeAdd,
        onNodeRemove: this.handleNodeRemove,
        onConnectionRemove: this.handleConnectionRemove,
        onContextMenu: this.handleContextMenuState,
      },
      draggableEvents: {
        onDrag: this.handleNodeDrag,
        onStart: this.handleNodeDragStart,
        onStop: this.handleNodeDragStop,
      },
      createNodeRef: (id, ref) => (this.nodeRefs[id] = ref),
    };

    this.updateConnectionsEvent = new CustomEvent(UPDATE_CONNECTIONS_EVENT, {
      detail: { calculateConnections: this.calculateConnections },
    });

    this.saveSpaceModelEvent = new Event(SAVE_SPACE_MODEL);

    this.currentConnection = undefined;
    this.nodeRefs = {};
  }

  componentDidMount() {
    document.addEventListener(MOUSE_MOVE, this.handleMouseMove);
    document.addEventListener(MOUSE_UP, this.handleMouseUp);
    document.addEventListener(SAVE_SPACE_MODEL, this.handleSaveSpaceModel);

    document.dispatchEvent(this.updateConnectionsEvent);
    this.setState({ showConnections: true });
  }

  componentWillUnmount() {
    document.removeEventListener(MOUSE_MOVE, this.handleMouseMove);
    document.removeEventListener(MOUSE_UP, this.handleMouseUp);
    document.removeEventListener(SAVE_SPACE_MODEL, this.handleSaveSpaceModel);
  }

  prepareNodes = nodes => nodes.map(node => <NodeWithContextComponent {...node} key={node.id} />);

  handleSaveSpaceModel = () => {
    localStorage.setItem(LOCAL_STORAGE_SPACE_KEY, JSON.stringify(this.toJSON()));
  };

  handleMouseUp = (e, params, callback) => {
    if (this.state.connecting) {
      this.setState({ connecting: false });

      const connections = { ...this.state.connections };

      if (connections && this.currentConnection) {
        delete connections[this.currentConnection];
        this.setState({ connections });
        this.currentConnection = undefined;
        document.dispatchEvent(this.updateConnectionsEvent);
      }
    }
  };

  handleMouseMove = (e, params, callback) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      mousePos: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  };

  handleOutputMouseDown = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    this.currentConnection = uuid();

    const { id } = params;

    this.setState(
      prev => ({
        connecting: true,
        connections: {
          ...prev.connections,
          [this.currentConnection]: {
            start: id,
          },
        },
      }),
      () => {
        document.dispatchEvent(this.updateConnectionsEvent);
      },
    );
  };

  handleOutputMouseUp = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('output mouse up');
  };

  handleInputMouseDown = (e, params, callback) => {
    console.log('input mouse down');
  };

  handleInputMouseUp = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.currentConnection) return null;

    const connection = this.state.connections[this.currentConnection];

    const { id } = params;

    this.setState(
      prev => ({
        connections: {
          ...prev.connections,
          [this.currentConnection]: {
            ...connection,
            end: id,
          },
        },
      }),
      () => {
        this.currentConnection = undefined;

        document.dispatchEvent(this.updateConnectionsEvent);
        document.dispatchEvent(this.saveSpaceModelEvent);
      },
    );
  };

  handleNodeDrag = (event, data, callback) => {};

  handleNodeDragStart = (event, data, callback) => {
    this.setState({ dragging: true });
  };

  handleNodeDragStop = (event, data, callback) => {
    this.setState({ dragging: false });

    document.dispatchEvent(this.saveSpaceModelEvent);
  };

  handleContextMenuState = (state, params, callback) =>
    this.setState(prev => ({
      isContextMenuOpen: state,
      contextMenuPosition: prev.mousePos,
      contextMenuParams: params,
    }));

  handleConnectionRemove = (id, callback) => {
    const connections = { ...this.state.connections };
    if (connections[id]) {
      delete connections[id];
    }

    this.setState({ connections }, () => {
      document.dispatchEvent(this.updateConnectionsEvent);
      document.dispatchEvent(this.saveSpaceModelEvent);
    });
  };

  calculateConnections = (id, type, callback) => {
    const results =
      type === 'input'
        ? Object.values(this.state.connections).filter(connection => connection.end === id)
        : Object.values(this.state.connections).filter(connection => connection.start === id);

    return results.length;
  };

  toJSON = () => {
    const nodes = this.state.nodes
      .map((node, index) => {
        const props = node.props;
        const draggableProps = props.draggableProps;

        const ref = Object.values(this.nodeRefs)[index];
        const componentInputs = ref.getInputRefs().listRef || [];
        const componentOutputs = ref.getOutputsRef().listRef || [];
        const inputs = props.inputs || [];
        const outputs = props.outputs || [];
        const position = ref.getPosition();
        const id = ref.getId();

        console.log({ ref, componentOutputs, componentInputs, inputs, outputs });

        const newInputs = inputs.map((input, index) => {
          const id = componentInputs[index].getId();

          return { ...input, id };
        });

        const newOutputs = outputs.map((output, index) => {
          const id = componentOutputs[index].getId();

          return { ...output, id };
        });

        return {
          ...props,
          id,
          inputs: newInputs,
          outputs: newOutputs,
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

  handleNodeAdd = (params = {}) => {
    const props = {
      ...params,
      key: uuid(),
    };

    this.setState(
      prev => ({ nodes: [...prev.nodes, <NodeWithContextComponent {...props} />] }),
      () => document.dispatchEvent(this.saveSpaceModelEvent),
    );
  };

  handleNodeRemove = params => {
    const { id, inputs, outputs } = params;
    const nodes = remove([...this.state.nodes], item => item.props.id !== id);
    const connections = { ...this.state.connections };

    delete this.nodeRefs[id];

    const removeConnectionByIOId = id => {
      const result = findKey(connections, ({ start, end }) => start === id || end === id);

      delete connections[result];
    };

    inputs.map(({ props: { id } }) => removeConnectionByIOId(id));
    outputs.map(({ props: { id } }) => removeConnectionByIOId(id));

    this.setState({ nodes, connections }, () => document.dispatchEvent(this.saveSpaceModelEvent));
  };

  render() {
    window.space = this;

    let newLine = null;
    if (this.state.connecting) {
      let start = this.state.connections[this.currentConnection].start;

      let end = { x: this.state.mousePos.x, y: this.state.mousePos.y };

      newLine = <LineWithContextComponent start={start} end={end} connecting />;
    }

    return (
      <SpaceContext.Provider value={this.spaceContext}>
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
                ([key, { start, end }]) =>
                  !!start && !!end ? <LineWithContextComponent id={key} start={start} end={end} key={key} /> : null,
              )}
            {newLine}
          </SvgComopnent>
        </section>
      </SpaceContext.Provider>
    );
  }
}
