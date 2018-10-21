import React, { Component } from 'react';

import { NodeEditForm } from './form/node-form.component';

export class NodeEditComponent extends Component {
  render() {
    return <NodeEditForm {...this.props} />;
  }
}
