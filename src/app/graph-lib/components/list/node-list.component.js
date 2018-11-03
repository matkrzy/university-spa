import React, { Component } from 'react';

import style from './node-list.module.scss';

/** Class representing a `NodeList`
 * @extends Component
 */
export class NodeList extends Component {
  render() {
    return <ul className={style.list}>{this.props.children}</ul>;
  }
}
