import React, { Component } from 'react';

import { Node } from './node.component';
import { SpaceContext } from '../../contexts/space.context';

export class NodeWithContextComponent extends Component {
  render() {
    return <SpaceContext.Consumer>{props => <Node {...{ ...this.props, ...props }} />}</SpaceContext.Consumer>;
  }
}
