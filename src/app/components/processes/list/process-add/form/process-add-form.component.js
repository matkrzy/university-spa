import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';

import { TextFieldComponent, Button } from 'app/components/shared';

import styles from './process-add-form.module.scss';

/** Class representing a node edit form
 * @extends Component
 */
export class NodeAddForm extends Component {
  render() {
    return (
      <Form
        initialValues={this.props.initialValues}
        onSubmit={this.props.onSubmit}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <Field
                component={TextFieldComponent}
                name="label"
                placeholder="enter process title"
                label="Process title"
              />
            </div>
            <Button className={styles.button} disabled={invalid} type="submit">
              Add
            </Button>
            <Button className={styles.button} onClick={this.props.toggle}>
              cancel
            </Button>
          </form>
        )}
      />
    );
  }
}
