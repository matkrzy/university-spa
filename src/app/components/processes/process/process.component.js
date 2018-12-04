import React, { Component, Fragment } from 'react';

import { GraphSpace } from '../../../graph-lib';

import { NodeEditModalComponent } from '../../node/node-edit/node-edit-modal.component';
import { SidebarContainer, DotSpinnerComponent } from '../../shared';
import { NodeSidebarDetailsContainer } from '../../node/node-sidebar-details/node-sidebar-details.container';
import { AddLocalProductModalComponent } from '../../node/node-edit/add-local-product/add-local-product-modal.component';

import { socket } from 'app/socket/socket';

import { processGet, processUpdate } from 'app/socket/process/actions';
import { marketGet, marketLocalGet } from 'app/socket/market/actions';

import { MARKET_UPDATE, MARKET_LOCAL_UPDATE } from 'app/socket/market/action-types';

/** Class representing a graph preview component
 * @extends Component
 */
export class ProcessComponent extends Component {
  constructor(props) {
    super(props);
    this.space = React.createRef();

    this.state = {
      model: undefined,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    marketGet({ callback: this.props.updateGlobalMarket });
    marketLocalGet({
      payload: { processId: id },
      callback: this.props.marketLocalUpdate,
    });
    processGet({
      payload: { id },
      callback: model => this.props.processUpdate(model),
    });

    socket.on(MARKET_UPDATE, this.props.updateGlobalMarket);
    socket.on(MARKET_LOCAL_UPDATE, this.props.marketLocalUpdate);
  }

  componentWillUnmount() {
    socket.removeListener(MARKET_UPDATE, this.props.updateGlobalMarket);
    socket.removeListener(MARKET_LOCAL_UPDATE, this.props.marketLocalUpdate);

    this.props.processUpdate(null);
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
    const { process } = this.props;
    const { id } = this.props.match.params;

    if (this.props.loading || !process) return <DotSpinnerComponent />;

    return (
      <Fragment>
        <SidebarContainer name="nodeDetails" component={NodeSidebarDetailsContainer} />
        <GraphSpace
          connections={process.connections}
          nodes={process.nodes}
          market={this.props.market}
          ref={this.space}
          onNodeEdit={this.handleNodeEdit}
          onNodeDoubleClick={this.handleNodeDoubleClick}
          onSpaceModelSave={processUpdate(id)}
        />
        <NodeEditModalComponent />
        <AddLocalProductModalComponent />
      </Fragment>
    );
  }
}
