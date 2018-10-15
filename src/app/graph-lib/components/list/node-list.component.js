import React, { Component } from 'react';

import style from './node-list.module.scss';

export class NodeList extends Component {
  render() {
    return <ul className={style.list}>{this.props.children}</ul>;
  }
}
