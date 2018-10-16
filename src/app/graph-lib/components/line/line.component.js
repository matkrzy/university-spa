import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';

import styles from './line.module.scss';

const uuid = require('uuid/v4');

class ConnectionLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      position: { x: 0, y: 0 },
      contextMenuOpen: false,
      process: {
        buildTime: Math.floor(Math.random() * 10) + 4,
      },
      dotColor: this.getRandomColor(),
    };
  }

  getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  handleContextMenu = e => {
    e.preventDefault();

    const contextMenu = {
      options: [
        {
          label: 'remove',
          events: {
            onClick: () => {
              this.setState({ contextMenuOpen: false });
              this.props.onContextMenu(false);
              this.props.onConnectionRemove(this.props.id);
            },
          },
        },
      ],
      onClose: () => this.setState({ contextMenuOpen: false }),
    };

    this.setState({ selected: true, contextMenuOpen: true }, () =>
      this.props.onContextMenu(this.state.contextMenuOpen, contextMenu),
    );
  };

  getElementClientRect = id => {
    const element = document.getElementById(id);

    return !!element ? element.getBoundingClientRect() : {};
  };

  handleClick = e => {
    this.setState({ selected: true });
  };

  bezierCurve(a, b, cp1x, cp1y, cp2x, cp2y, x, y) {
    return `M${a},${b} C${cp1x},${cp1y} ${cp2x},${cp2y}  ${x},${y}`;
  }

  distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  }

  handleClickOutside(e) {
    if (!this.state.contextMenuOpen) {
      this.setState({ selected: false });

      if (this.props.onClickOutside) {
        this.props.onClickOutside(e);
      }
    }
  }

  render() {
    const startRect =
      typeof this.props.start === 'string' ? this.getElementClientRect(this.props.start) : this.props.start;
    const endRect = typeof this.props.end === 'string' ? this.getElementClientRect(this.props.end) : this.props.end;

    if (!startRect || !endRect) {
      console.error('One line is skipped');
      return null;
    }

    const start = {
      x: startRect.x + 3,
      y: startRect.y + 4,
    };

    const end = {
      x: endRect.x + 3,
      y: endRect.y + 4,
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

    const lineClassNames = classNames(styles.line, {
      [styles.selected]: this.state.selected,
    });

    const lineClickAreaClassNames = classNames(styles.lineClickArea, {});

    const progressCircleId = uuid();
    const progressPathId = uuid();

    return (
      <g>
        <circle r="5" fill={this.state.dotColor} id={progressCircleId} />
        <circle cx={start.x} cy={start.y} r="3" fill="#337ab7" />
        <circle cx={end.x} cy={end.y} r="3" fill="#9191A8" />
        <path
          className={lineClassNames}
          d={pathString}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          onContextMenuCapture={this.handleContextMenu}
        />
        <path
          className={lineClickAreaClassNames}
          d={pathString}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          id={progressPathId}
        />

        {!this.props.connecting && (
          <animateMotion
            href={`#${progressCircleId}`}
            dur={`${this.state.process.buildTime}s`}
            begin="0s"
            fill="freeze"
            repeatCount="indefinite"
            rotate="auto-reverse"
          >
            <mpath href={`#${progressPathId}`} />
          </animateMotion>
        )}
      </g>
    );
  }
}

export const LineComponent = onClickOutside(ConnectionLine);
