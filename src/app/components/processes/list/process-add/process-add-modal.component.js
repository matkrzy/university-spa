import React, { Component } from 'react';

import { ModalContainer } from 'app/components/shared';
import { ProcessAddFormContainer } from './form/process-add-form.container';

/** Class representing a node edit modal
 * @extends Component
 */
export class ProcessAddModalComponent extends Component {
  render() {
    return <ModalContainer name="processAdd" component={ProcessAddFormContainer} title="Add new process" />;
  }
}
