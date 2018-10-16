import React, { Component } from 'react';

import { SpaceContext } from '../../contexts/space.context';
import { LineComponent } from './line.component';

export class LineWithContextComponent extends Component {
  render() {
    return (
      <SpaceContext.Consumer>
        {({ lineActions }) => <LineComponent {...{ ...this.props, ...lineActions }} />}
      </SpaceContext.Consumer>
    );
  }
}
