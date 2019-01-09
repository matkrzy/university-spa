import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';

import { TextFieldComponent, Button } from 'app/components/shared';

export class AddLocalProductFormComponent extends Component {
  render() {
    return (
      <Form
        initialValues={this.props.initialValues}
        onSubmit={this.props.onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Field component={TextFieldComponent} name="label" placeholder="enter product name" label="Product name" />
            <Button type="submit">add</Button>
          </form>
        )}
      />
    );
  }
}
