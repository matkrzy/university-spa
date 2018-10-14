import React, { Component } from 'react';

import { NodeList } from '../node-list.component';
import { NodeListItem } from '../item/node-list-item.component';

export class NodeListInputs extends Component {
  static defaultProps = {
    inputs: [],
    label: 'input',
    disabled: false,
  };

  render() {
    return (
      <NodeList>
        {this.props.inputs.map(({ label, id, maxConnections }, index) => (
          <NodeListItem
            label={label || this.props.label}
            type="input"
            key={`${label}-${index}`}
            onMouseDown={this.props.events.onMouseDown}
            onMouseUp={this.props.events.onMouseUp}
            nodeId={this.props.nodeId}
            id={id}
            maxConnections={maxConnections}
            disabled={this.props.disabled}
          />
        ))}
      </NodeList>
    );
  }
}
