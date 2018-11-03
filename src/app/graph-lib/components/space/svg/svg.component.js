import React, { Component } from 'react';

import style from './svg.module.scss';

/** Class representing a `SvgComopnent`. Layer to display all `ConnectionLine`
 * @extends Component
 */
export class SvgComopnent extends Component {
  static defaultProps = {
    width: '100%',
    height: '100%',
  };

  render() {
    return (
      <svg width={this.props.height} height={this.props.height} ref="svg" id="graphSpaceSvg" className={style.svg}>
        {this.props.children}
      </svg>
    );
  }
}
