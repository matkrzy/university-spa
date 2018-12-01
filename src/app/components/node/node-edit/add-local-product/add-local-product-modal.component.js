import React, { Component } from 'react';

import { ModalContainer } from '../../../shared';
import { AddLocalProductFormContainer } from './form/add-local-product-form.container';

/** Class representing a node edit modal
 * @extends Component
 */
export class AddLocalProductModalComponent extends Component {
  render() {
    return <ModalContainer name="addLocalProduct" component={AddLocalProductFormContainer} title="Add local product" />;
  }
}
