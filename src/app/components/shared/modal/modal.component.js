import React, { Component } from 'react';
import classNames from 'classnames';

import { PortalComponent } from 'app/components/shared/portal/portal.component';
import { ModalContentComponent } from './content/modal-content.component';

import styles from './modal.module.scss';

const root = document.getElementById('root');

export class ModalComponent extends Component {
  constructor(props) {
    super(props);

    props.register(props.name);
    console.log('registred');
  }

  componentWillUnmount() {
    console.log('unmount');
    this.props.destroy(this.props.name);
  }

  handleModalToggle = () => this.props.toggle(this.props.name);

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const { title, component: Component, modalClassName } = this.props;

    const modalClassNames = classNames(styles.modal, modalClassName);

    return (
      <PortalComponent node={root}>
        <div className={styles.modalWrapper}>
          <ModalContentComponent handleClickOutside={this.handleModalToggle}>
            <div className={modalClassNames}>
              {!!title && <div className={styles.title}>{title}</div>}
              <div className={styles.body}>
                {<Component modalName={this.props.name} toggle={this.handleModalToggle} />}
              </div>
            </div>
          </ModalContentComponent>
        </div>
      </PortalComponent>
    );
  }
}
