import React, { Component } from 'react';

import { NodeList } from '../node-list.component';
import { NodeListItemComponent } from '../item/node-list-item.component';

import { NODE_INPUT } from '../../../dictionary';

/** Class representing a `NodeListInputs`
 * Render inputs of node
 *
 * @extends Component
 */
export class NodeListInputsComponent extends Component {
  static defaultProps = {
    inputs: [],
    label: 'input',
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
    if (this.props.inputs.length !== nextProps.inputs.length) {
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
   * @param {string} id - id of input
   * @param {React.Node} ref - reference to component
   */
  addRef = (id, ref) => {
    if (ref) this.listRef[id] = ref;
  };

  render() {
    return (
      <NodeList>
        {this.props.inputs.map(({ label, id, maxConnections, disabled, productId, connectionId }) => (
          <NodeListItemComponent
            connectionId={connectionId}
            disabled={disabled}
            id={id}
            key={id}
            label={label || this.props.label}
            maxConnections={maxConnections || 1}
            nodeId={this.props.nodeId}
            productId={productId}
            ref={ref => this.addRef(id, ref)}
            type={NODE_INPUT}
          />
        ))}
      </NodeList>
    );
  }
}
