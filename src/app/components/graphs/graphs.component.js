import React, { Component } from 'react';

import { GraphSpace, Node } from 'app/graph-lib';

export class GraphsComponent extends Component {
  render() {
    return (
      <GraphSpace>
        <Node
          draggableProps={{ defaultPosition: { x: 200, y: 100 } }}
          inputs={[{ label: 'i' }, {}, {}, {}]}
          outputs={[{ label: 'o' }, {}]}
        />
        <Node
          draggableProps={{ defaultPosition: { x: 400, y: 150 } }}
          inputs={[{ label: 'i' }]}
          outputs={[{ label: 'i' }, {}]}
        />
      </GraphSpace>
    );
  }
}
