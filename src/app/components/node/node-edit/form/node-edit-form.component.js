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

import { NODE_TYPES } from 'app/graph-lib';

import styles from './node-edit-form.module.scss';

const uuid = require('uuid/v4');

/** Class representing a node edit form
 * @extends Component
 */
export class NodeEditForm extends Component {
  handleAddNewField = (push, type) => () => {
    const input = {
      id: uuid(),
      label: type.substring(0, type.length - 1),
      maxConnections: 1,
      connections: 0,
    };

    push(type, input);
  };

  disableInput = (values, index) => {
    if (!values.inputs[index]) {
      return false;
    }

    return Number(values.inputs[index].connections) === Number(values.inputs[index].maxConnections);
  };

  disableRemoveAction = (values, type, index) => values[type][index] && !!Number(values[type][index].connections);

  updateValues = createDecorator({
    field: /inputs\[\d+\].productId/,
    updates: {
      'outputs[0].productId': value => value,
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

    return (
      <Form
        decorators={NODE_TYPES.buy === type ? [this.updateValues] : undefined}
        initialValues={this.props.initialValues}
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
            mutators: { push },
          },
        }) => (
          <form onSubmit={handleSubmit} name="form" id="form" autoComplete="off">
            <Field
              component={TextFieldComponent}
              name="title"
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
                                  onClick={() => fields.remove(index)}
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
                    {Object.entries(this.props.process.products).map(([key, value]) => {
                      const outputProject = this.props.market[key];
                      const { requirements } = value;

                      return (
                        <div>
                          <div>{outputProject.label}</div>
                          <div>
                            <div>Requirements</div>
                            {requirements &&
                              Object.entries(requirements).map(([key, amount]) => {
                                const marketProduct = this.props.market[key];

                                return (
                                  <div>
                                    {marketProduct.label} {amount}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}

                    {/*{Object.keys(this.props.process.products).map(product => {*/}
                    {/*const selectedProduct = this.props.market[product];*/}

                    {/*console.log(this.props.process);*/}

                    {/*return <div>{selectedProduct.label}</div>;*/}
                    {/*})}*/}
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
