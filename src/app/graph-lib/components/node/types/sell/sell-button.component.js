import React, { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { Form, Field } from 'react-final-form';

import { TextFieldComponent, Button } from 'app/components/shared';

import { marketUpdateGoods } from 'app/socket/market/actions';

import styles from './sell-button.module.scss';

export class SellButtonComponent extends Component {
  constructor(props) {
    super(props);

    this.formRef = createRef();
  }

  onSubmit = ({ amount }) => {
    if (!this.canSell()) {
      return;
    }

    const productId = this.getProductId();
    const payload = { amount, productId };
    marketUpdateGoods({
      payload,
    });

    this.formRef.current.form.reset();
  };

  getProductId = () => this.props.outputs?.getListRef()[0].getProductId();

  canSell = () => {
    const input = this.props.outputs?.getListRef()[0];

    return !!input?.getConnections();
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} initialValues={{ amount: 1 }} ref={this.formRef}>
        {({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
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

//export const SellButtonComponent = withMarketActions(SellButton);
