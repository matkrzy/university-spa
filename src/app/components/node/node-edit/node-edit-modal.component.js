import React, { Component } from 'react';

import { ModalContainer } from '../../shared';
import { NodeEditFormContainer } from './form/node-edit-form.container';

import styles from './node-edit-modal.module.scss';

/** Class representing a node edit modal
 * @extends Component
 */
export class NodeEditModalComponent extends Component {
  render() {
    return (
      <ModalContainer
        modalClassName={styles.modal}
        name="nodeEdit"
        component={NodeEditFormContainer}
        title="Edit node settings"
      />
    );
  }
}
