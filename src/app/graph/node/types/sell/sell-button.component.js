import React, { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { Form, Field } from 'react-final-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { TextFieldComponent, Button } from '../../../../components/shared';

import { processGoodsUpdate } from '../../../../redux/process/process.actions';

import { marketGoodsUpdate } from '../../../../socket/market/actions';

import styles from './sell-button.module.scss';

export class SellButton extends Component {
  constructor(props) {
    super(props);

    this.formRef = createRef();
  }

  onSubmit = async ({ amount }) => {
    if (!this.canSell()) {
      return;
    }

    const productId = this.getProductId();

    marketGoodsUpdate({
      payload: { amount: amount, productId },
    });

    await this.props.processGoodsUpdate({ amount: amount * -1, productId, nodeId: this.props.startNode });

    this.formRef.current.form.reset();
  };

  getProductId = () => this.props.outputs[0]?.getProductId();

  canSell = () => {
    const input = this.props.inputs[0];
    const output = this.props.outputs[0];
    const amount = get(this.props.goods, [this.props.startNode, this.getProductId()], 0);

    return !!input?.getConnections() && !!output?.getConnections() && amount;
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} initialValues={{ amount: 1 }} ref={this.formRef}>
        {({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/*<div>state: {get(this.props.goods, [this.props.startNode, this.getProductId()], 0)}</div>*/}
            <Field component={TextFieldComponent} name="amount" className={styles.input} />
            <Button
              disabled={!this.canSell()}
              onDoubleClick={e => e.stopPropagation()}
              type="submit"
              onClick={e => e.stopPropagation()}
            >
              <Tooltip placement="bottom" overlayClassName="tooltip" overlay="Sell good">
                <FontAwesomeIcon disabled={invalid} icon={faMinus} />
              </Tooltip>
            </Button>
          </form>
        )}
      </Form>
    );
  }
}

const mapStateToProps = ({ process: { goods } }) => ({ goods });

const mapDispatchToProps = { processGoodsUpdate };

export const SellButtonComponent = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SellButton);
