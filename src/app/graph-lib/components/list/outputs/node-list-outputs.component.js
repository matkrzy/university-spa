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
            label={label || this.props.label}
            type={NODE_OUTPUT}
            key={`${label}-${index}`}
            onMouseDown={this.props.events.onMouseDown}
            onMouseUp={this.props.events.handleMouseUp}
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
