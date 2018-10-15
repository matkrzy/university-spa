import React, { Component } from 'react';

import { NodeList } from '../node-list.component';
import { NodeListItem } from '../item/node-list-item.component';

import { NODE_INPUT } from '../../../dictionary';

export class NodeListInputs extends Component {
  static defaultProps = {
    inputs: [],
    label: 'input',
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.listRef = [];
  }

  addRef = ref => ref && this.listRef.push(ref);

  render() {
    return (
      <NodeList>
        {this.props.inputs.map(({ label, id, maxConnections }, index) => (
          <NodeListItem
            label={label || this.props.label}
            type={NODE_INPUT}
            key={`${label}-${index}`}
            onMouseDown={this.props.events.onMouseDown}
            onMouseUp={this.props.events.onMouseUp}
            nodeId={this.props.nodeId}
            id={id}
            maxConnections={maxConnections}
            disabled={this.props.disabled}
            ref={this.addRef}
          />
        ))}
      </NodeList>
    );
  }
}
