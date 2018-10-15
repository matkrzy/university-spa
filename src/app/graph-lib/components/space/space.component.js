import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';

import { SvgComopnent } from './svg/svg.component';
import { NodesComponent } from './nodes/nodes.component';
import { LineComponent } from '../line/line.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { Node } from '../node/node.component';

import { SAVE_SPACE_MODEL, UPDATE_CONNECTIONS_EVENT, MOUSE_MOVE, MOUSE_UP } from '../../dictionary';

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

    this.currentConnection = undefined;
    this.nodeRefs = {};
  }

  componentDidMount() {
    this.updateConnectionsEvent = new CustomEvent(UPDATE_CONNECTIONS_EVENT, {
      detail: { calculateConnections: this.calculateConnections },
    });

    this.saveSpaceModelEvent = new Event(SAVE_SPACE_MODEL);

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

  spaceProps = () => ({
    events: {
      nodeOutputs: { onMouseDown: this.handleOutputMouseDown, onMouseUp: this.handleOutputMouseUp },
      nodeInputs: { onMouseDown: this.handleInputMouseDown, onMouseUp: this.handleInputMouseUp },
    },
    createRef: (id, ref) => (this.nodeRefs[id] = ref),
  });

  draggableProps = () => ({
    onDrag: this.onNodeDrag,
    onStart: this.onNodeDragStart,
    onStop: this.onNodeDragStop,
  });

  prepareNodes = nodes => {
    return nodes.map(node => {
      const props = {
        ...node,
        spaceProps: this.spaceProps(),
        draggableProps: { ...node.draggableProps, ...this.draggableProps() },
        key: node.id,
      };

      return <Node {...props} />;
    });
  };

  handleSaveSpaceModel = () => {
    localStorage.setItem('space', JSON.stringify(this.toJSON()));
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

  onNodeDrag = (event, data, callback) => {};

  onNodeDragStart = (event, data, callback) => {
    this.setState({ dragging: true });
  };

  onNodeDragStop = (event, data, callback) => {
    this.setState({ dragging: false });

    document.dispatchEvent(this.saveSpaceModelEvent);
  };

  handleContextMenuState = (state, params, callback) =>
    this.setState(prev => ({
      isContextMenuOpen: state,
      contextMenuPosition: prev.mousePos,
      contextMenuParams: params,
    }));

  handleConnectionDelete = (id, callback) => {
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
        console.log(node);
        const props = node.props;
        const draggableProps = props.draggableProps;

        const ref = Object.values(this.nodeRefs)[index];
        const componentInputs = ref.getInputRefs().listRef || [];
        const componentOutputs = ref.getOutputsRef().listRef || [];
        const inputs = props.inputs || [];
        const outputs = props.outputs || [];
        const position = ref.getPosition();
        const id = ref.getId();

        const newInputs = inputs.map((input, index) => {
          const id = componentInputs[index].getId();

          return { ...input, id };
        });

        const newOutputs = outputs.map((input, index) => {
          const id = componentOutputs[index].getId();

          return { ...input, id };
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
        ({ eventTypes, excludeScrollbar, outsideClickIgnoreClass, preventDefault, stopPropagation, ...other }) => other,
      );

    const connections = this.state.connections;

    return { nodes, connections };
  };

  addNode = (params = {}) => {
    const props = {
      ...params,
      spaceProps: this.spaceProps(),
      draggableProps: { ...params.draggableProps, ...this.draggableProps() },
      key: uuid(),
    };

    this.setState(
      prev => ({ nodes: [...prev.nodes, <Node {...props} />] }),
      () => document.dispatchEvent(this.saveSpaceModelEvent),
    );
  };

  removeNode = id => {
    const nodes = remove(this.state.nodes, item => item.props.id !== id);

    this.setState({ nodes }, () => document.dispatchEvent(this.saveSpaceModelEvent));
  };

  render() {
    window.space = this;

    let newLine = null;
    if (this.state.connecting) {
      let start = this.state.connections[this.currentConnection].start;

      let end = { x: this.state.mousePos.x, y: this.state.mousePos.y };

      newLine = <LineComponent start={start} end={end} connecting />;
    }

    return (
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
                !!start && !!end ? (
                  <LineComponent
                    id={key}
                    start={start}
                    end={end}
                    key={key}
                    onConnectionDelete={this.handleConnectionDelete}
                    onContextMenu={this.handleContextMenuState}
                  />
                ) : null,
            )}
          {newLine}
        </SvgComopnent>
      </section>
    );
  }
}
