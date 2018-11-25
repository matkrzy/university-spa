import React, { Component, Fragment } from 'react';

import { GraphSpace } from 'app/graph-lib';

import { NodeEditModalComponent } from 'app/components/node/node-edit/modal/node-edit-modal.component';
import { SidebarContainer, DotSpinnerComponent } from 'app/components/shared';
import { NodeSidebarDetailsContainer } from 'app/components/node/node-sidebar-details/node-sidebar-details.container';

const defaultSpace = JSON.parse(localStorage.getItem('space')) || {
  nodes: [
    {
      id: 'd3fa6165-5106-4ce2-8719-846b2f6e04f3',
      type: 'marketOut',
      process: {},
      inputs: [],
      outputs: [],
      draggableProps: { defaultPosition: { x: 65, y: 175 } },
    },
    {
      id: 'add2d48a-eceb-4de6-8745-5285b4bcdc3e',
      type: 'buy',
      inputs: [
        {
          id: 'eb63878b-c217-430c-b0d3-1ebe792cbf17',
          label: 'input',
          maxConnections: 1,
          connections: 1,
          productId: '9c6beb83-c8f8-4dab-af15-732a4df81cfc',
        },
      ],
      outputs: [
        {
          id: '25b25770-eb14-4c66-ad75-7d658ba1357d',
          label: 'output',
          maxConnections: 1,
          connections: 1,
          productId: '9c6beb83-c8f8-4dab-af15-732a4df81cfc',
          connectionId: '58b5e3b9-8f70-412c-bb18-a7e35355a953',
        },
      ],
      process: {},
      draggableProps: { defaultPosition: { x: 652, y: 23 } },
      title: 'Node',
    },
    {
      id: '267f6c9a-06f5-41d4-84d7-d5968cf94818',
      type: 'marketIn',
      process: {},
      inputs: [],
      outputs: [],
      draggableProps: { defaultPosition: { x: 1197, y: 123 } },
    },
  ],
  connections: {
    'aa11f3e0-13e2-4956-b229-5a62886665c9': {
      start: '407d4deb-ce38-45f8-9aa5-34adfd75b36f',
      startNode: 'd3fa6165-5106-4ce2-8719-846b2f6e04f3',
      productId: '407d4deb-ce38-45f8-9aa5-34adfd75b36f',
      end: 'eb63878b-c217-430c-b0d3-1ebe792cbf17',
      endNode: 'add2d48a-eceb-4de6-8745-5285b4bcdc3e',
    },
    '58b5e3b9-8f70-412c-bb18-a7e35355a953': {
      start: '25b25770-eb14-4c66-ad75-7d658ba1357d',
      startNode: 'add2d48a-eceb-4de6-8745-5285b4bcdc3e',
      productId: '9c6beb83-c8f8-4dab-af15-732a4df81cfc',
      end: '9c6beb83-c8f8-4dab-af15-732a4df81cfc',
      endNode: '267f6c9a-06f5-41d4-84d7-d5968cf94818',
    },
  },
};

/** Class representing a graph preview component
 * @extends Component
 */
export class GraphsComponent extends Component {
  constructor(props) {
    super(props);
    this.space = React.createRef();
  }

  componentDidMount() {
    this.props.fetchMarket();
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

  //
  //const test = resources: [
  //  {
  //    id: uuid(),
  //    type: 'node/machine/orsth'
  //    amount: 1,
  //    operations:{
  //      'raw1>a':{
  //        input: 'input1',
  //        output: 'output1',
  //        time: 28,
  //        setup: 100,
  //        spec:{
  //          'raw1':{
  //            amount: 1, type: 'input'
  //          }
  //        }
  //      }
  //    }
  //  }
  //  ]

  render() {
    if (this.props.loading) return <DotSpinnerComponent />;

    return (
      <Fragment>
        <SidebarContainer name="nodeDetails" component={NodeSidebarDetailsContainer} />
        <GraphSpace
          connections={defaultSpace.connections}
          nodes={defaultSpace.nodes}
          market={this.props.market}
          ref={this.space}
          onNodeEdit={this.handleNodeEdit}
          onNodeDoubleClick={this.handleNodeDoubleClick}
          onItemBuy={this.props.requestMarketGoods}
        />
        <NodeEditModalComponent />
      </Fragment>
    );
  }
}
