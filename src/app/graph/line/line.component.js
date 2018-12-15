import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';

import { withConnectionLineActions } from '../contexts';
import { NODE_INPUT, NODE_OUTPUT } from '../dictionary';

//import { timeParser } from 'app/utils/time-parser.util';

import styles from './line.module.scss';

const uuid = require('uuid/v4');

/** Class representing a `ConnectionLineComponent`
 * @extends Component
 */
class ConnectionLine extends Component {
  progressCircleId = uuid();
  progressPathId = uuid();

  /**
   * Create default state of `ConnectionLine`
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      position: { x: 0, y: 0 },
      contextMenuOpen: false,
      dotColor: this.getRandomColor(),
      lineColor: this.getRandomColor(),
      animation: false,
    };
  }
  /**
   * It will generate random color in hex for dots shows progress of process
   * @return {string}
   */
  getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  /**
   * It creates context menu of `LineComponent`
   * @param {Event} e
   */
  handleContextMenu = e => {
    e.preventDefault();

    const {
      connectionLineActions: { onContextMenu, onConnectionRemove },
    } = this.props;

    const contextMenu = {
      options: [
        {
          label: 'remove',
          events: {
            onClick: () => {
              this.setState({ contextMenuOpen: false });
              onContextMenu(false);
              onConnectionRemove(this.props.id);
            },
          },
        },
      ],
      onClose: () => this.setState({ contextMenuOpen: false }),
    };

    this.setState({ selected: true, contextMenuOpen: true }, () =>
      onContextMenu(this.state.contextMenuOpen, contextMenu),
    );
  };

  /**
   * Helper for getting position details by element id
   * @param {string} type - key to select start | end
   * @return {DOMRect} - properties of input or output selected by id
   */
  getElementClientRect = type => {
    const id = this.props[type];
    const IO = type === 'start' ? NODE_OUTPUT : NODE_INPUT;

    const element = document.querySelectorAll(`[data-id='${id}'][data-type='${IO}']`)[0];

    return !!element ? element.getBoundingClientRect() : {};
  };

  /**
   * It will set `selected` flag of `LineComponent`
   * @param e
   */
  handleClick = e => {
    this.setState({ selected: true });
  };

  /**
   * Helper for calculate connection path between output and input
   * @param {number} a - `start.x` cord
   * @param {number} b - `start.y` cord
   * @param {number} cp1x - check point 1 x
   * @param {number} cp1y - check point 1 y
   * @param {number} cp2x - check point 2 x
   * @param {number} cp2y - check point 2 y
   * @param {number} x - `end.x` cord
   * @param {number} y - `end.y` cord
   * @return {string} path string
   */
  bezierCurve(a, b, cp1x, cp1y, cp2x, cp2y, x, y) {
    return `M${a},${b} C${cp1x},${cp1y} ${cp2x},${cp2y}  ${x},${y}`;
  }

  /**
   * Helper for calculate distance between output and input
   * @param {number[]} a - start cords
   * @param {number[]} b - end cords
   * @return {number} distance between points
   */
  distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
  }

  /**
   * Handler for click outside of the component.
   * It will set `selected` flag to false
   * @param e
   */
  handleClickOutside(e) {
    if (!this.state.contextMenuOpen) {
      this.setState({ selected: false });

      if (this.props.onClickOutside) {
        this.props.onClickOutside(e);
      }
    }
  }

  render() {
    const startRect = typeof this.props.start === 'string' ? this.getElementClientRect('start') : this.props.start;
    const endRect = typeof this.props.end === 'string' ? this.getElementClientRect('end') : this.props.end;

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

    //const animation = () => {
    //  if (
    //    !this.props.process.duration ||
    //    this.props.machineState !== 'ready' ||
    //    this.props.isMachneBusy.some(state => state === false || !this.state.animation)
    //  ) {
    //    return null;
    //  }
    //
    //  const time = timeParser(this.props.process.duration);
    //
    //  return (
    //    <animateMotion
    //      href={`#${this.progressCircleId}`}
    //      dur={`${time}ms`}
    //      begin="0s"
    //      fill="freeze"
    //      repeatCount="indefinite"
    //      rotate="auto-reverse"
    //    >
    //      <mpath href={`#${this.progressPathId}`} />
    //    </animateMotion>
    //  );
    //};

    return (
      <g>
        {/*<circle r="5" fill={this.state.dotColor} id={this.progressCircleId} />*/}
        <circle cx={start.x} cy={start.y} r="3" fill="#337ab7" />
        <circle cx={end.x} cy={end.y} r="3" fill="#9191A8" />
        <path
          className={lineClassNames}
          d={pathString}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          onContextMenuCapture={this.handleContextMenu}
          stroke={this.state.lineColor || undefined}
        />
        <path
          className={lineClickAreaClassNames}
          d={pathString}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          id={this.progressPathId}
        />

        {/*{!this.props.connecting && animation()}*/}
      </g>
    );
  }
}

export const LineComponent = withConnectionLineActions(onClickOutside(ConnectionLine));
