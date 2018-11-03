import React, { Component } from 'react';

import { SpaceContext } from '../../contexts/space.context';
import { LineComponent } from './line.component';

/** Class representing a `LineWithContextComponent`
 * It will wrap `LineComponent` with `SpaceContext`
 * @extends Component
 */
export class LineWithContextComponent extends Component {
  render() {
    return (
      <SpaceContext.Consumer>
        {({ spaceActions: { onContextMenu, onConnectionRemove } }) => (
          <LineComponent {...{ ...this.props, ...{ onContextMenu, onConnectionRemove } }} />
        )}
      </SpaceContext.Consumer>
    );
  }
}
