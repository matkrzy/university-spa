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

    this.listRef = {};
  }

  getListRef = () => Object.values(this.listRef);

  addRef = (id, ref) => (this.listRef[id] = ref);

  render() {
    return (
      <NodeList>
        {this.props.outputs.map(({ label, id, maxConnections, disabled }) => (
          <NodeListItem
            id={id}
            type={NODE_OUTPUT}
            key={id}
            ref={ref => this.addRef(id, ref)}
            nodeId={this.props.nodeId}
            label={label || this.props.label}
            maxConnections={maxConnections || 1}
            disabled={disabled}
            {...this.props.events}
          />
        ))}
      </NodeList>
    );
  }
}
