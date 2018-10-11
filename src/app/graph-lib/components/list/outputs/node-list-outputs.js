import React, { Component } from 'react';

import { NodeList } from '../node-list.component';
import { NodeListItem } from '../item/node-list-item.component';

export class NodeListOutputs extends Component {
  static defaultProps = {
    outputs: [],
    label: 'output',
  };

  render() {
    return (
      <NodeList>
        {this.props.outputs.map(({ label, id }, index) => (
          <NodeListItem
            label={label || this.props.label}
            type="output"
            key={`${label}-${index}`}
            onMouseDown={this.props.events.onMouseDown}
            onMouseUp={this.props.events.onMouseUp}
            nodeId={this.props.nodeId}
            id={id}
          />
        ))}
      </NodeList>
    );
  }
}
