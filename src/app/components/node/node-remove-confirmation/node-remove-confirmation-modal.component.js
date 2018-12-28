import React, { Component } from 'react';

import { ModalContainer } from '../../shared';
import { NodeRemoveFormContainer } from './form/node-remove-form.container';

/** Class representing a node remove modal
 * @extends Component
 */
export class NodeRemoveConfirmationModalComponent extends Component {
  render() {
    return (
      <ModalContainer
        modalClassName={'modal-confirmation'}
        name="nodeRemove"
        component={NodeRemoveFormContainer}
        title="Remove node"
      />
    );
  }
}
