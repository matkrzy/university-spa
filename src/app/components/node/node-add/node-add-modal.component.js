import React, { Component } from 'react';

import { ModalContainer } from '../../shared';
import { NodeAddFormContainer } from './form/node-add-form.container';

/** Class representing a node edit modal
 * @extends Component
 */
export class NodeAddModalComponent extends Component {
  render() {
    return <ModalContainer name="nodeAdd" component={NodeAddFormContainer} title="Add new node" />;
  }
}
