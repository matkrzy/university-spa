import React, { Component } from 'react';
import findKey from 'lodash/findKey';
import get from 'lodash/get';

import { SvgComopnent } from './svg/svg.component';
import { NodesComponent } from './nodes/nodes.component';
import { LineComponent } from '../line/line.component';

import styles from './space.module.scss';

const uuid = require('uuid/v4');

export class GraphSpace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connections: {},
      dragging: false,
    };

    this.currentConnection = undefined;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp = e => {
    this.setState({ dragging: false });
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

  onOutputMouseDown = (e, params) => {
    e.preventDefault();
    e.stopPropagation();

    this.currentConnection = uuid();

    this.setState(prev => ({
      connections: {
        ...prev.connections,
        [this.currentConnection]: {
          start: params,
        },
      },
    }));
  };

  onOutputMouseUp = (e, params) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('output mouse up');
  };

  onInputMouseDown = (e, params) => {
    console.log('input mouse down');
  };

  onInputMouseUp = (e, params) => {
    e.preventDefault();
    e.stopPropagation();

    const connection = this.state.connections[this.currentConnection];

    this.setState(prev => ({
      connections: {
        ...prev.connections,
        [this.currentConnection]: {
          ...connection,
          end: params,
        },
      },
    }));
  };

  onNodeDrag = (event, data) => {
    const { id, deltaY, deltaX } = data;

    const connectionKey = this.findConnectionbyNodeId(id);
    const connection = this.state.connections[connectionKey];

    const newStart = {
      ...connection.start,
      x: connection.start.x + deltaX,
      y: connection.start.y + deltaY,
    };

    const connections = {
      ...this.state.connections,
      [connectionKey]: {
        ...connection,
        start: newStart,
      },
    };

    this.setState({ connections });
  };

  onNodeDragStart = (event, data) => {
    this.setState({ dragging: true });
  };

  onNodeDragStop = (event, data) => {
    this.setState({ dragging: false });
  };

  findConnectionbyNodeId = id =>
    findKey(this.state.connections, element => element.end.nodeId === id || element.start.nodeId === id);

  render() {
    window.state = this.state;

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
    if (!!this.state.connections[this.currentConnection] && !this.state.connections[this.currentConnection].end) {
      let start = this.state.connections[this.currentConnection].start;
      let end = { x: this.state.mousePos.x, y: this.state.mousePos.y };

      newLine = <LineComponent start={start} end={end} />;
    }

    return (
      <section id="graphSpace" className={styles.space}>
        <NodesComponent>{nodes}</NodesComponent>
        <SvgComopnent ref="svgComponent">
          {Object.entries(this.state.connections).map(
            ([key, { start, end }]) => (!!start && !!end ? <LineComponent start={start} end={end} key={key} /> : null),
          )}
          {newLine}
        </SvgComopnent>
      </section>
    );
  }
}
