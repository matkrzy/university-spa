import React, { Component } from 'react';
import classNames from 'classnames';

import { NODE_INPUT, NODE_OUTPUT } from '../dictionary';
import styles from './node-list.module.scss';

/** Class representing a `NodeList`
 * @extends Component
 */
export class NodeList extends Component {
  render() {
    const { type } = this.props;

    const listClassNames = classNames(styles.list, {
      [styles.inputs]: type === NODE_INPUT,
      [styles.outputs]: type === NODE_OUTPUT,
    });
    return <ul className={listClassNames}>{this.props.children}</ul>;
  }
}
