import React, { Component } from 'react';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

import { PortalComponent } from 'app/components/shared/portal/portal.component';

import styles from './sidebar.module.scss';

const root = document.getElementById('root');

export const SidebarComponent = onClickOutside(
  class extends Component {
    static defaultProps = {
      placement: 'right',
    };

    componentDidMount() {
      this.props.register();
    }

    handleClickOutside() {
      this.props.toggle();
    }

    render() {
      if (!this.props.isOpen) {
        return null;
      }

      const {
        placement,
        component: Component,
        params: { title },
        name,
      } = this.props;

      const sidebarClassNames = classNames(styles.sidebar, styles[placement]);

      return (
        <PortalComponent node={root}>
          <div className={sidebarClassNames}>
            <div className={styles.header}>
              <div className={styles.title}>{title}</div>
              <div className={styles.close} onClick={this.props.toggle}>
                x
              </div>
            </div>
            <div className={styles.body}>
              <Component name={name} params={this.props.params} />
            </div>
          </div>
        </PortalComponent>
      );
    }
  },
);
