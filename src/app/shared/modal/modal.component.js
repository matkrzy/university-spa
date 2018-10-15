import React, { Component, Fragment } from 'react';

import { PortalComponent } from 'app/shared/portal/portal.component';

import styles from './modal.module.scss';

const root = document.getElementById('root');

export class ModalComponent extends Component {
  constructor(props) {
    super(props);

    props.register(props.id);
  }

  componentWillUnmount() {
    this.props.destroy(this.props.id);
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <PortalComponent node={root}>
        <div className={styles.modalWrapper}>
          <div className={styles.modal}>
            <div>Title</div>
            <div>Content</div>
            <div>Footer</div>
          </div>
        </div>
      </PortalComponent>
    );
  }
}
