import React, { Component } from 'react';
import { Form } from 'react-final-form';

import { Button } from 'app/components/shared';

import styles from './node-remove-form.module.scss';

/** Class representing a node edit form
 * @extends Component
 */
export class NodeRemoveForm extends Component {
  render() {
    return (
      <Form
        initialValues={this.props.initialValues}
        onSubmit={this.props.onSubmit}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <section>
              <div className="form-section__title">
                Are you sure that you want to remove <b>{this.props.label}</b> node?
              </div>
            </section>

            <div className="modal-footer">
              <Button className={styles.button} disabled={invalid} type="submit">
                Yes
              </Button>
              <Button className={styles.button} onClick={this.props.toggle}>
                No
              </Button>
            </div>
          </form>
        )}
      />
    );
  }
}
