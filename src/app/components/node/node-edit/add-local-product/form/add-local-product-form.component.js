import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';

import { TextFieldComponent, Button } from 'app/components/shared';

export class AddLocalProductFormComponent extends Component {
  render() {
    return (
      <Form
        debug={data => console.log(data)}
        initialValues={this.props.initialValues}
        onSubmit={this.props.onSubmit}
        render={({ handleSubmit, pristine, invalid, values }) => (
          <form onSubmit={handleSubmit} name="form" id="form" autoComplete="off">
            <Field component={TextFieldComponent} name="label" placeholder="enter product name" label="Product name" />
            <Button type="submit">Add</Button>
          </form>
        )}
      />
    );
  }
}
