import React, { Component } from 'react';
import isEqual from 'react-fast-compare';

import { SvgComopnent } from './svg/svg.component';
import { NodesComponent } from './nodes/nodes.component';
import { LineComponent } from '../line/line.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

import { SAVE_SPACE_MODEL, UPDATE_CONNECTIONS_EVENT } from '../../dictionary';

import styles from './space.module.scss';

const uuid = require('uuid/v4');

export class GraphSpace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connections: { ...props.connections },
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

    this.saveSpaceModel = new Event(SAVE_SPACE_MODEL);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener(SAVE_SPACE_MODEL, this.handleSaveSpaceModel);

    document.dispatchEvent(this.updateConnectionsEvent);

    this.setState({ showConnections: true });
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener(SAVE_SPACE_MODEL, this.handleSaveSpaceModel);
  }

  handleSaveSpaceModel = () => {
    localStorage.setItem('space', JSON.stringify(this.toJSON()));
  };

  onMouseUp = e => {
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

  onMouseMove = e => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      mousePos: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  };

  onOutputMouseDown = (e, params, callback) => {
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
        if (callback) {
          callback();
        }

        document.dispatchEvent(this.updateConnectionsEvent);
      },
    );
  };

  onOutputMouseUp = (e, params, callback) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('output mouse up');
  };

  onInputMouseDown = (e, params, callback) => {
    console.log('input mouse down');
  };

  onInputMouseUp = (e, params, callback) => {
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
        if (callback) {
          callback();
        }

        document.dispatchEvent(this.updateConnectionsEvent);
        document.dispatchEvent(this.saveSpaceModel);
      },
    );
  };

  onNodeDrag = (event, data) => {};

  onNodeDragStart = (event, data) => {
    this.setState({ dragging: true });
  };

  onNodeDragStop = (event, data) => {
    this.setState({ dragging: false });
  };

  toJSON = () => {
    const nodes = React.Children.map(
      this.props.children,
      (child, index) => {
        const props = child.props;
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
      },
      this.context,
    ).map(
      ({ eventTypes, excludeScrollbar, outsideClickIgnoreClass, preventDefault, stopPropagation, ...other }) => other,
    );
    const connections = this.state.connections;

    return { nodes, connections };
  };

  handleContextMenuState = (state, params) =>
    this.setState(prev => ({
      isContextMenuOpen: state,
      contextMenuPosition: prev.mousePos,
      contextMenuParams: params,
    }));

  handleConnectionDelete = id => {
    const connections = { ...this.state.connections };
    if (connections[id]) {
      delete connections[id];
    }

    this.setState({ connections }, () => {
      document.dispatchEvent(this.updateConnectionsEvent);
      document.dispatchEvent(this.saveSpaceModel);
    });
  };

  calculateConnections = (id, type) => {
    const results =
      type === 'input'
        ? Object.values(this.state.connections).filter(connection => connection.end === id)
        : Object.values(this.state.connections).filter(connection => connection.start === id);

    return results.length;
  };

  render() {
    window.space = this;

    const spaceProps = {
      events: {
        nodeOutputs: {
          onMouseDown: this.onOutputMouseDown,
          onMouseUp: this.onOutputMouseUp,
        },
        nodeInputs: {
          onMouseDown: this.onInputMouseDown,
          onMouseUp: this.onInputMouseUp,
        },
      },
      createRef: (id, ref) => (this.nodeRefs[id] = ref),
    };

    const draggableProps = {
      onDrag: this.onNodeDrag,
      onStart: this.onNodeDragStart,
      onStop: this.onNodeDragStop,
    };

    const nodes = React.Children.map(
      this.props.children,
      child => {
        const childProps = child.props;
        return React.cloneElement(child, {
          spaceProps,
          draggableProps: { ...childProps.draggableProps, ...draggableProps },
        });
      },
      this.context,
    );

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
        <NodesComponent>{nodes}</NodesComponent>
        <SvgComopnent ref="svgComponent">
          {this.state.showConnections &&
            Object.entries(this.state.connections).map(
              ([key, { start, end }]) =>
                !!start && !!end ? (
                  <LineComponent
                    end={end}
                    id={key}
                    key={key}
                    onConnectionDelete={this.handleConnectionDelete}
                    onContextMenu={this.handleContextMenuState}
                    start={start}
                  />
                ) : null,
            )}
          {newLine}
        </SvgComopnent>
      </section>
    );
  }
}
