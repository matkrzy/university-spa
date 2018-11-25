import React, { Component, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { Form, Field } from 'react-final-form';

import { TextFieldComponent, Button } from 'app/components/shared';
import { withMarketActions } from 'app/graph-lib/contexts';

import styles from './sell-button.module.scss';

class SellButton extends Component {
  constructor(props) {
    super(props);

    this.formRef = createRef();
  }

  onSubmit = ({ amount }) => {
    const { onItemBuy } = this.props.marketActions;

    if (!this.canSell()) {
      return;
    }

    const productId = this.getProductId();
    onItemBuy({ amount, productId });

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

export const SellButtonComponent = withMarketActions(SellButton);
