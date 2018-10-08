import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

import styles from './line.module.scss';

class ConnectionLine extends Component {
  handleClick = e => {};

  bezierCurve(a, b, cp1x, cp1y, cp2x, cp2y, x, y) {
    return `M${a},${b} C${cp1x},${cp1y} ${cp2x},${cp2y}  ${x},${y}`;
  }

  distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  }

  handleClickOutside() {}

  render() {
    const start = {
      x: this.props.start.x + 3,
      y: this.props.start.y + 4,
    };

    const end = {
      x: this.props.end.x + 3,
      y: this.props.end.y + 4,
    };

    let dist = this.distance([start.x, start.y], [end.x, end.y]);

    let pathString = this.bezierCurve(
      start.x, // start x
      start.y, // start y
      start.x + dist * 0.25, // cp1 x
      start.y, // cp1 y
      end.x - dist * 0.75, // cp2 x
      end.y, // cp2 y
      end.x, // end x
      end.y,
    ); // end y

    return (
      <g>
        <circle cx={start.x} cy={start.y} r="3" fill="#337ab7" />
        <circle cx={end.x} cy={end.y} r="3" fill="#9191A8" />
        <path
          className={styles.line}
          d={pathString}
          onClick={e => {
            this.handleClick(e);
          }}
        />
        <path
          className={styles.line}
          d={pathString}
          onClick={e => {
            this.handleClick(e);
          }}
        />
      </g>
    );
  }
}

export const LineComponent = ConnectionLine;
