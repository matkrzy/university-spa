import React, { Component } from 'react';

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

    const { id } = params;

    this.setState(prev => ({
      connections: {
        ...prev.connections,
        [this.currentConnection]: {
          start: id,
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
      () => (this.currentConnection = undefined),
    );
  };

  onNodeDrag = (event, data) => {};

  onNodeDragStart = (event, data) => {
    this.setState({ dragging: true });
  };

  onNodeDragStop = (event, data) => {
    this.setState({ dragging: false });
  };

  getElementClientRect = id => {
    const element = document.getElementById(id);

    return element.getBoundingClientRect();
  };

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
      let startId = this.state.connections[this.currentConnection].start;
      const start = this.getElementClientRect(startId);

      let end = { x: this.state.mousePos.x, y: this.state.mousePos.y };

      newLine = <LineComponent start={start} end={end} />;
    }

    return (
      <section id="graphSpace" className={styles.space}>
        <NodesComponent>{nodes}</NodesComponent>
        <SvgComopnent ref="svgComponent">
          {Object.entries(this.state.connections).map(([key, { start, end }]) => {
            if (!!start && !!end) {
              const startRect = this.getElementClientRect(start);
              const endRect = this.getElementClientRect(end);

              return <LineComponent start={startRect} end={endRect} key={key} />;
            }

            return null;
          })}
          {newLine}
        </SvgComopnent>
      </section>
    );
  }
}
