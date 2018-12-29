import React, { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { Form, Field } from 'react-final-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { TextFieldComponent, Button } from '../../../../components/shared';
import { withMarket } from '../../../contexts';

import { marketGoodsUpdate } from '../../../../socket/market/actions';

import { processGoodsUpdate } from '../../../../redux/process/process.actions';

import { processGoodsEmit } from '../../../../events/process/process.actions';

import styles from './buy-button.module.scss';

export class BuyButton extends Component {
  constructor(props) {
    super(props);

    this.formRef = createRef();

    this.state = {
      amount: 0,
    };
  }

  getProductId = () => this.props.inputs[0]?.getProductId();

  onSubmit = async ({ amount }) => {
    if (!this.canBuy()) {
      return;
    }

    const productId = this.getProductId();

    marketGoodsUpdate({
      payload: { amount: amount * -1, productId },
      callback: async () => {
        await this.props.processGoodsUpdate({ amount: amount, productId, nodeId: this.props.nodeId });
        await processGoodsEmit({ amount: amount, productId });
      },
    });

    this.formRef.current.form.reset();
  };

  checkProductState = id => {
    const { market } = this.props;

    return !!market[id].amount;
  };

  canBuy = () => {
    const input = this.props.inputs[0];
    const output = this.props.outputs[0];

    return !!input?.getConnections() && !!output?.getConnections() && this.checkProductState(this.getProductId());
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} initialValues={{ amount: 1 }} ref={this.formRef}>
        {({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field component={TextFieldComponent} name="amount" className={styles.input} />
            <Button
              disabled={!this.canBuy()}
              onDoubleClick={e => e.stopPropagation()}
              type="submit"
              onClick={e => e.stopPropagation()}
            >
              <Tooltip placement="bottom" overlayClassName="tooltip" overlay="Buy good">
                <FontAwesomeIcon disabled={invalid} icon={faPlus} />
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

export const BuyButtonComponent = compose(
  withMarket,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(BuyButton);
