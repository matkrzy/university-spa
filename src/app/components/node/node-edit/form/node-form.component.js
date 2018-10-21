import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

import { TextFieldComponent, Button, CheckboxComponent } from 'app/components/shared';
import { validateMaxConnections } from 'app/utils/validators';

import styles from './node-form.module.scss';

export class NodeEditForm extends Component {
  render() {
    return (
      <Form
        initialValues={this.props.initialValues}
        onSubmit={this.props.onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        render={({ handleSubmit, pristine, invalid, values }) => (
          <form onSubmit={handleSubmit} name="form" id="form" autoComplete="off">
            {console.log(values)}
            <Field
              component={TextFieldComponent}
              name="title"
              placeholder="enter node title"
              label="Node title"
              id="test"
            />

            <section className="form-section">
              <div className="form-section__title">Inputs</div>
              <div className="form-section__body">
                <FieldArray name="inputs">
                  {({ fields }) =>
                    fields.map((name, index) => (
                      <div key={name} className="form-group">
                        <Field component={TextFieldComponent} name={`${name}.label`} label="Name" />
                        <Field
                          label="Max connections"
                          component={TextFieldComponent}
                          name={`${name}.maxConnections`}
                          validate={validateMaxConnections(index, 'inputs')}
                          type="number"
                          specializedProps={{ min: 1, max: 5, step: 1 }}
                          asyncErrors
                        />
                        <Field
                          className={styles.disabledField}
                          label="Disabled"
                          component={CheckboxComponent}
                          name={`${name}.disabled`}
                          type="checkbox"
                          disabled={
                            Number(values.inputs[index].connections) <= Number(values.inputs[index].maxConnections)
                          }
                        />
                      </div>
                    ))
                  }
                </FieldArray>
              </div>
            </section>

            <section className="form-section">
              <div className="form-section__title">Outputs</div>
              <div className="form-section__body">
                <FieldArray name="outputs">
                  {({ fields }) =>
                    fields.map((name, index) => (
                      <div key={name} className="form-group">
                        <Field component={TextFieldComponent} name={`${name}.label`} label="Name" />
                        <Field
                          label="Max connections"
                          component={TextFieldComponent}
                          name={`${name}.maxConnections`}
                          validate={validateMaxConnections(index, 'outputs')}
                          type="number"
                          specializedProps={{ min: 1, max: 5, step: 1 }}
                          asyncErrors
                        />
                        <Field
                          className={styles.disabledField}
                          label="Disabled"
                          component={CheckboxComponent}
                          name={`${name}.disabled`}
                          type="checkbox"
                          disabled={
                            Number(values.outputs[index].connections) <= Number(values.outputs[index].maxConnections)
                          }
                        />
                      </div>
                    ))
                  }
                </FieldArray>
              </div>
            </section>

            <Button className={styles.button} disabled={invalid}>
              save
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
