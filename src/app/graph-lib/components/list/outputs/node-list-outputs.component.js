import React, { Component } from 'react';

import { NodeList } from '../node-list.component';
import { NodeListItem } from '../item/node-list-item.component';

import { NODE_OUTPUT } from '../../../dictionary';

export class NodeListOutputsComponent extends Component {
  static defaultProps = {
    outputs: [],
    label: 'output',
  };

  constructor(props) {
    super(props);

    this.listRef = [];
  }

  addRef = ref => ref && this.listRef.push(ref);

  render() {
    return (
      <NodeList>
        {this.props.outputs.map(({ label, id, maxConnections }, index) => (
          <NodeListItem
            id={id}
            type={NODE_OUTPUT}
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
