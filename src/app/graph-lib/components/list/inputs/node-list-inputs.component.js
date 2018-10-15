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
            id={id}
            type={NODE_INPUT}
            key={`${label}-${index}`}
            ref={this.addRef}
            nodeId={this.props.nodeId}
            label={label || this.props.label}
            maxConnections={maxConnections}
            disabled={this.props.disabled}
            {...this.props.events}
          />
        ))}
      </NodeList>
    );
  }
}
