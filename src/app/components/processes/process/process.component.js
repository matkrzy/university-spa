import React, { Component, Fragment } from 'react';

import { SpaceComponent } from 'app/graph/space/space.component';

import { NodeEditModalComponent } from '../../node/node-edit/node-edit-modal.component';
import { SidebarContainer, DotSpinnerComponent } from '../../shared';
import { NodeSidebarDetailsContainer } from '../../node/node-sidebar-details/node-sidebar-details.container';
import { AddLocalProductModalComponent } from '../../node/node-edit/add-local-product/add-local-product-modal.component';

import { socket } from 'app/socket/socket';

import { processGet, processUpdate } from 'app/socket/process/actions';
import { marketGet } from 'app/socket/market/actions';

import { MARKET_UPDATE } from 'app/socket/market/action-types';

/** Class representing a graph preview component
 * @extends Component
 */
export class ProcessComponent extends Component {
  constructor(props) {
    super(props);
    this.space = React.createRef();
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    marketGet({ payload: { processId: id }, callback: this.props.updateMarket });
    processGet({
      payload: { id },
      callback: this.props.processUpdate,
    });

    socket.on(MARKET_UPDATE, this.props.updateMarket);
  }

  componentWillUnmount() {
    socket.removeListener(MARKET_UPDATE, this.props.updateMarket);

    this.props.processUpdate(null);
    this.props.processGoodsReset();
  }

  /**
   * Handler for node edition passed to `GraphSpace`. It will open modal to edit node details
   * @param {NodeComponent} node
   */
  handleNodeEdit = node => {
    this.props.modalToggle('nodeEdit', { ...node, handleNodeUpdate: this.space.current.handleNodeUpdate });
  };

  /**
   * Handler for node on click passed to `GraphSpace`. It will open sidebar with node details
   * @param {NodeComponent} node
   */
  handleNodeDoubleClick = node => {
    this.props.sidebarToggle('nodeDetails', { ...node, title: node.props.title });
  };

  render() {
    const { process, market } = this.props;
    const { id } = this.props.match.params;

    if (!process || !market) return <DotSpinnerComponent />;

    return (
      <Fragment>
        <SidebarContainer name="nodeDetails" component={NodeSidebarDetailsContainer} />
        <SpaceComponent
          connections={process.connections}
          market={market}
          nodes={process.nodes}
          onNodeDoubleClick={this.handleNodeDoubleClick}
          onNodeEdit={this.handleNodeEdit}
          onSpaceModelSave={processUpdate(id)}
          ref={this.space}
        />
        <NodeEditModalComponent />
        <AddLocalProductModalComponent />
      </Fragment>
    );
  }
}
