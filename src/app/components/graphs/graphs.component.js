import React, { Component } from 'react';

import { GraphSpace, Node } from 'app/graph-lib';

const uuid = require('uuid/v4');

export class GraphsComponent extends Component {
  constructor(props) {
    super(props);

    this.space = React.createRef();
  }

  render() {
    window.refs = this.space;

    return (
      <GraphSpace
        connections={{
          [uuid()]: { start: 'output1', end: 'maczeta' },
          [uuid()]: { start: 'output2', end: 'input1' },
        }}
        ref={this.space}
      >
        <Node
          title="Source of metal"
          draggableProps={{ defaultPosition: { x: 200, y: 300 } }}
          outputs={[{ label: 'o', id: 'output1', maxConnections: 3 }, { id: 'output2' }]}
        />
        <Node
          title="Cutting machine"
          draggableProps={{ defaultPosition: { x: 790, y: 137 } }}
          inputs={[{ label: 'i', id: 'maczeta' }, {}, {}]}
          outputs={[{ label: 'i' }, {}]}
        />
        <Node
          title="Soldering machine"
          draggableProps={{ defaultPosition: { x: 777, y: 425 } }}
          inputs={[{ label: 'i', id: 'input1' }, {}, {}]}
          outputs={[{ label: 'i' }, {}]}
        />
        <Node
          draggableProps={{ defaultPosition: { x: 100, y: 50 } }}
          inputs={[{ label: 'i' }, {}, {}]}
          outputs={[{ label: 'i' }, {}]}
        />
      </GraphSpace>
    );
  }
}
