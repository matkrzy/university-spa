import React, { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { Form, Field } from 'react-final-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { TextFieldComponent, Button } from 'app/components/shared';

import { processGoodsUpdate } from 'app/redux/process/process.actions';

import { marketUpdateGoods } from 'app/socket/market/actions';
import { processEventBus } from 'app/events/process/processEventBus';
import { processGoodsEmit } from 'app/events/process/process.actions';

import styles from './sell-button.module.scss';

export class SellButton extends Component {
  constructor(props) {
    super(props);

    this.formRef = createRef();

    this.state = {
      amount: 0,
    };
  }

  componentDidMount() {
    processEventBus.on('producedGood', this.handleGoods);
  }

  handleGoods = payload => {
    if (payload.destination === this.props.inputs[0]?.getId()) {
      this.setState(prev => ({
        amount: prev.amount + payload.amount,
      }));
    }
  };

  componentWillUnmount() {
    processEventBus.removeListener('producedGood', this.handleGoods);
  }

  onSubmit = ({ amount }) => {
    if (!this.canSell()) {
      return;
    }

    const productId = this.getProductId();
    //this.props.processGoodsUpdate({ amount: amount * -1, productId });
    //marketUpdateGoods({
    //  payload: { amount, productId },
    //});

    marketUpdateGoods({
      payload: { amount: amount, productId },
      callback: () => {
        this.props.processGoodsUpdate({ amount: amount * -1, productId });
        processGoodsEmit({ amount: amount * -1, productId });
      },
    });

    this.formRef.current.form.reset();
  };

  getProductId = () => this.props.outputs[0]?.getProductId();

  canSell = () => {
    const input = this.props.inputs[0];
    const output = this.props.outputs[0];

    return !!input?.getConnections() && !!output?.getConnections();
    //return !!input?.getConnections() && !!this.state.amount;
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} initialValues={{ amount: 1 }} ref={this.formRef}>
        {({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>state: {this.props.goods[this.getProductId()] || 0}</div>
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
