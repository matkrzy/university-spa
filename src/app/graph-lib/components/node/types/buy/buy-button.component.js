import React, { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { Form, Field } from 'react-final-form';
import { compose } from 'redux';

import { TextFieldComponent, Button } from 'app/components/shared';
import { withMarketActions, withMarket } from 'app/graph-lib/contexts';

import styles from './buy-button.module.scss';

export class BuyButton extends Component {
  constructor(props) {
    super(props);

    this.formRef = createRef();

    this.state = {
      amount: 0,
    };
  }

  getProductId = () => this.props.inputs?.getListRef()[0].getProductId();

  onSubmit = ({ amount }) => {
    const { onItemBuy } = this.props.marketActions;

    if (!this.canBuy()) {
      return;
    }

    const productId = this.getProductId();

    onItemBuy({ amount: amount * -1, productId }).then(() => {
      this.setState(prev => ({ amount: +prev.amount + +amount }));
    });

    this.formRef.current.form.reset();
  };

  checkProductState = id => {
    const {
      market: { state },
    } = this.props;

    return !!state[id];
  };

  canBuy = () => {
    const input = this.props.inputs?.getListRef()[0];

    return !!input?.getConnections() && this.checkProductState(this.getProductId());
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

export const BuyButtonComponent = compose(
  withMarketActions,
  withMarket,
)(BuyButton);
