import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import createDecorator from 'final-form-calculate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';

import {
  TextFieldComponent,
  Button,
  CheckboxComponent,
  TimePickerComponent,
  ButtonSvg,
  SelectFieldComponent,
} from 'app/components/shared';

import { validateMaxConnections } from 'app/utils/validators';

import { NodeEditCustomSelectOption } from './custom-select-option/node-edit-custom-select-option';

import { NODE_TYPES } from 'app/graph';

import styles from './node-edit-form.module.scss';

const uuid = require('uuid/v4');

/** Class representing a node edit form
 * @extends Component
 */
export class NodeEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValues: props.initialValues,
    };
  }
  handleAddNewField = (push, type) => () => {
    const input = {
      id: uuid(),
      label: type.substring(0, type.length - 1),
      maxConnections: 1,
      connections: 0,
    };

    push(type, input);
  };

  handleAddProcessProduct = (push, field) => () => {
    push(field, {});
  };

  disableInput = (values, index) => {
    if (!values.inputs[index]) {
      return false;
    }

    return Number(values.inputs[index].connections) === Number(values.inputs[index].maxConnections);
  };

  disableRemoveAction = (values, type, index) => values[type][index] && !!Number(values[type][index].connections);

  handlePortRemove = (fields, remove, index) => {
    const { productId } = fields.value[index];

    this.processProductToRemove = productId;

    fields.remove(index);
  };

  updateValues = createDecorator({
    field: /inputs\[\d+\].productId/,
    updates: {
      'outputs[0].productId': value => value,
    },
  });

  updateProcessElements = createDecorator({
    field: 'outputs',
    updates: {
      'process.products': (value, allValues) => {
        if (allValues.process.products) {
          delete allValues.process.products[this.processProductToRemove];

          this.processProductToRemove = undefined;

          return allValues.process.products;
        }

        return allValues.process.products;
      },
    },
  });

  addLocalProductButton = (
    <Button onClick={() => this.props.modalToggle('addLocalProduct')} className={styles.addLocalProductButton}>
      <Tooltip placement="bottom" overlayClassName="tooltip" overlay="Add new local product">
        <FontAwesomeIcon icon={faPlus} />
      </Tooltip>
    </Button>
  );

  render() {
    const { type } = this.props;

    const decorators = () => {
      const arrayOfDecorators = [];

      if (NODE_TYPES.buy === type) {
        arrayOfDecorators.push(this.updateValues);
      }

      if (NODE_TYPES.step === type) {
        arrayOfDecorators.push(this.updateProcessElements);
      }

      return arrayOfDecorators.length ? arrayOfDecorators : undefined;
    };

    return (
      <Form
        decorators={decorators()}
        initialValues={this.state.initialValues}
        onSubmit={this.props.onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        render={({
          handleSubmit,
          pristine,
          invalid,
          values,
          form: {
            mutators: { push, remove },
          },
        }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Field
              component={TextFieldComponent}
              name="label"
              placeholder="enter node title"
              label="Node title"
              id="test"
            />
            {type !== NODE_TYPES.marketOut && (
              <section className="form-section">
                <div className="form-section__title">Inputs</div>
                <div className="form-section__body">
                  <>
                    <FieldArray name="inputs">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div key={name} className="form-group">
                            {fields.length > 1 && (
                              <ButtonSvg
                                icon="✖"
                                className={styles.removeField}
                                overlayClassName={styles.removeFieldTooltip}
                                message="Remove all connections before removing"
                                onClick={() => fields.remove(index)}
                                disabled={this.disableRemoveAction(values, 'inputs', index)}
                              />
                            )}

                            <Field component={TextFieldComponent} name={`${name}.label`} label="Name" />
                            <Field
                              label="Max connections"
                              component={TextFieldComponent}
                              name={`${name}.maxConnections`}
                              validate={validateMaxConnections(index, 'inputs')}
                              type="number"
                              specializedProps={{ min: 1, max: type === NODE_TYPES.buy ? 1 : 5, step: 1 }}
                              asyncErrors
                            />
                            {(type === NODE_TYPES.buy || type === NODE_TYPES.sell || type === NODE_TYPES.step) && (
                              <>
                                <Field
                                  label="Product"
                                  component={SelectFieldComponent}
                                  name={`${name}.productId`}
                                  options={this.props.products}
                                  components={{ Option: NodeEditCustomSelectOption }}
                                />
                                {type === NODE_TYPES.step && this.addLocalProductButton}
                              </>
                            )}
                            <Field
                              className={styles.disabledField}
                              label="Disabled"
                              component={CheckboxComponent}
                              name={`${name}.disabled`}
                              type="checkbox"
                              disabled={this.disableInput(values, index)}
                            />
                          </div>
                        ))
                      }
                    </FieldArray>
                    {type === NODE_TYPES.step && (
                      <Button onClick={this.handleAddNewField(push, 'inputs')}>Add input</Button>
                    )}
                  </>
                </div>
              </section>
            )}

            {type !== NODE_TYPES.marketIn && (
              <section className="form-section">
                <div className="form-section__title">Outputs</div>
                <div className="form-section__body">
                  <>
                    <FieldArray name="outputs">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div key={name} className="form-group">
                            {type !== NODE_TYPES.marketOut &&
                              fields.length > 1 && (
                                <ButtonSvg
                                  icon="✖"
                                  className={styles.removeField}
                                  overlayClassName={styles.removeFieldTooltip}
                                  message="Remove all connections before removing"
                                  //onClick={() => fields.remove(index)}
                                  onClick={() => this.handlePortRemove(fields, remove, index)}
                                  disabled={this.disableRemoveAction(values, 'outputs', index)}
                                />
                              )}
                            ️<Field component={TextFieldComponent} name={`${name}.label`} label="Name" />
                            <Field
                              label="Max connections"
                              component={TextFieldComponent}
                              name={`${name}.maxConnections`}
                              validate={validateMaxConnections(index, 'outputs')}
                              type="number"
                              specializedProps={{ min: 1, max: 5, step: 1 }}
                              asyncErrors
                              disabled={type === NODE_TYPES.marketOut}
                            />
                            {type === NODE_TYPES.buy || type === NODE_TYPES.marketOut ? (
                              <Field
                                label="Product"
                                component={SelectFieldComponent}
                                name={`${name}.productId`}
                                options={this.props.products}
                                value={values?.inputs[index]?.productId}
                                disabled={true}
                              />
                            ) : (
                              <>
                                <Field
                                  label="Product"
                                  component={SelectFieldComponent}
                                  name={`${name}.productId`}
                                  options={this.props.products}
                                  value={values?.inputs[index]?.productId}
                                  components={{ Option: NodeEditCustomSelectOption }}
                                />
                                {this.addLocalProductButton}
                              </>
                            )}
                            <Field
                              className={styles.disabledField}
                              label="Disabled"
                              component={CheckboxComponent}
                              name={`${name}.disabled`}
                              type="checkbox"
                              disabled={this.disableInput(values, index)}
                            />
                          </div>
                        ))
                      }
                    </FieldArray>
                    {type === NODE_TYPES.step && (
                      <Button onClick={this.handleAddNewField(push, 'outputs')}>Add output</Button>
                    )}
                  </>
                </div>
              </section>
            )}

            {type === NODE_TYPES.step && (
              <>
                <section className="form-section">
                  <div className="form-section__title">Process</div>
                  <div className="form-section__body">
                    <Field component={TimePickerComponent} name="process.duration" label="Duration of process" />
                    <Field component={TimePickerComponent} name="process.setup" label="Duration of setup" />
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section__title">Requirements</div>
                  <div className="form-section__body">
                    {values.outputs.map((output, i) => {
                      const { productId } = output;

                      if (!productId) {
                        return null;
                      }

                      const { market } = this.props;

                      const options = Object.values(values.inputs || {}).map(({ label, productId }) => ({
                        id: productId,
                        label: (market[productId] || {}).label,
                      }));

                      const { label } = market[productId];

                      const fieldName = `process.products.${productId}`;

                      return (
                        <section className="form-section" key={i}>
                          <div className="form-section__title">{label}</div>
                          <div className="form-section__body">
                            <FieldArray name={`${fieldName}.requirements`}>
                              {({ fields }) =>
                                fields.map((field, index) => {
                                  return (
                                    <div key={field} className="form-group">
                                      <ButtonSvg
                                        icon="✖"
                                        className={styles.removeField}
                                        overlayClassName={styles.removeFieldTooltip}
                                        message="Remove all connections before removing"
                                        onClick={() => fields.remove(index, index)}
                                      />
                                      <Field
                                        label="Product"
                                        component={SelectFieldComponent}
                                        name={`${field}.productId`}
                                        options={options}
                                        components={{ Option: NodeEditCustomSelectOption }}
                                      />
                                      <Field
                                        label="Required input amount"
                                        component={TextFieldComponent}
                                        name={`${field}.amount`}
                                        type="number"
                                        specializedProps={{ min: 1, step: 1 }}
                                      />
                                    </div>
                                  );
                                })
                              }
                            </FieldArray>
                            <Field
                              label="Recieved output amount"
                              component={TextFieldComponent}
                              name={`${fieldName}.amount`}
                              type="number"
                              specializedProps={{ min: 1, step: 1 }}
                            />
                            <Button onClick={this.handleAddProcessProduct(push, `${fieldName}.requirements`)}>
                              Add product
                            </Button>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            <Button className={styles.button} disabled={invalid} type="submit">
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
