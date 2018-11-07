import React, { Component } from 'react';

import { NodeList } from '../node-list.component';
import { NodeListItem } from '../item/node-list-item.component';

import { NODE_OUTPUT } from '../../../dictionary';

/** Class representing a `NodeListOutputsComponent`
 * Render outputs of node
 *
 * @extends Component
 */
export class NodeListOutputsComponent extends Component {
  static defaultProps = {
    outputs: [],
    label: 'output',
  };

  /**
   * It will create `listRef` object
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.listRef = {};
  }

  componentWillUpdate(nextProps) {
    if (this.props.outputs.length !== nextProps.length) {
      this.listRef = {};
    }
  }

  /**
   * It will returns object of refs
   * @return {Object[]}
   */
  getListRef = () => Object.values(this.listRef);

  /**
   * It will add reference to references object
   * @param {string} id - id of output
   * @param {React.Node} ref - reference to component
   */
  addRef = (id, ref) => {
    if (ref) this.listRef[id] = ref;
  };

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
