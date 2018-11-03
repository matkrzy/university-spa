import React, { Component } from 'react';

import { ModalContainer } from 'app/components/shared/index';
import { NodeEditContainer } from '../node-edit.container';

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
        component={NodeEditContainer}
        title="Edit node settings"
      />
    );
  }
}
