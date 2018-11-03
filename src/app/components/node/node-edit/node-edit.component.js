import React, { Component } from 'react';

import { NodeEditForm } from './form/node-form.component';

/** Class representing a node edit component. It wraps `NodeEditForm`
 * @extends Component
 */
export class NodeEditComponent extends Component {
  render() {
    return <NodeEditForm {...this.props} />;
  }
}
