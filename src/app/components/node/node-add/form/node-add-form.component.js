import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';

import { TextFieldComponent, Button, SelectFieldComponent } from 'app/components/shared';

import { NODE_TYPES, NODE_TYPES_LABELS } from 'app/graph';

import styles from './node-add-form.module.scss';

/** Class representing a node edit form
 * @extends Component
 */
export class NodeAddForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValues: props.initialValues,
    };
  }

  render() {
    const options = Object.values(NODE_TYPES).map(type => ({ id: type, label: NODE_TYPES_LABELS[type] }));

    return (
      <Form
        initialValues={this.state.initialValues}
        onSubmit={this.props.onSubmit}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <Field
                component={TextFieldComponent}
                name="label"
                placeholder="enter node title"
                label="Node title"
                id="test"
              />
              <Field label="Type" component={SelectFieldComponent} name="type" options={options} />
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
