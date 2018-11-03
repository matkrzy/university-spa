import React, { Component, Fragment } from 'react';

import { GraphSpace } from 'app/graph-lib';

import { NodeEditModalComponent } from 'app/components/node/node-edit/modal/node-edit-modal.component';
import { SidebarContainer } from 'app/components/shared';
import { NodeSidebarDetailsContainer } from 'app/components/node/node-sidebar-details/node-sidebar-details.container';

const defaultSpace = JSON.parse(localStorage.getItem('space')) || {
  nodes: [
    {
      id: '2bbb00fd-07bf-41d5-bdc1-31af0e8d03f9',
      title: 'Source of metal',
      draggableProps: { defaultPosition: { x: 200, y: 300 } },
      outputs: [{ label: 'o', id: 'output1', maxConnections: 3 }, { id: 'output2' }],
      inputs: [],
    },
    {
      id: 'a49f7dc6-538d-4395-9586-8e654e6b68c6',
      title: 'Cutting machine',
      draggableProps: { defaultPosition: { x: 790, y: 137 } },
      inputs: [
        { label: 'i', id: 'maczeta' },
        { id: '8266ed7d-f302-41df-81f4-0c5c4df2c85a' },
        { id: 'd4a58a6c-b19c-4aa0-9ef9-a01431676fbd' },
      ],
      outputs: [
        { label: 'i', id: 'f220ad90-2c43-428e-96e4-34deecbaf052' },
        { id: 'f45200c6-53b3-4c06-b1a6-380de6c0bfef' },
      ],
    },
    {
      id: 'c2aceb7b-a776-47f2-b118-4a6ff9b432e0',
      title: 'Soldering machine',
      draggableProps: { defaultPosition: { x: 777, y: 425 } },
      inputs: [
        { label: 'i', id: 'input1' },
        { id: '0081820c-180a-4b3b-b69e-b4a17ecd7430' },
        { id: '13888b8c-066a-4a0d-a98c-f3e34a361177' },
      ],
      outputs: [
        { label: 'i', id: 'd6489e2c-c305-4f2f-813a-56ba30b3d2d2' },
        { id: 'fe5093d3-1e38-4394-ad75-d7fca939e1ce' },
      ],
    },
    {
      id: '13e7ecbf-4901-49f8-809a-7031c35e1489',
      draggableProps: { defaultPosition: { x: 100, y: 50 } },
      inputs: [
        { label: 'i', id: 'f52e29c9-2bbe-4fff-adaa-d0aa2f4388bc' },
        { id: '2d5e1de8-5f10-4a45-976c-7f26ef9c7835' },
        { id: 'f9165359-26b4-4d90-9e9e-620ae14dab7a' },
      ],
      outputs: [
        { label: 'i', id: 'a991ed08-fa21-4505-a1d1-049ba63b394f' },
        { id: '7c322f0f-a5f3-489e-82f1-e379e9c5d91a' },
      ],
    },
  ],
  connections: {
    '869a2a9d-1175-4033-b8df-5573a0367e33': { start: 'output1', end: 'maczeta' },
    'faa6c924-67b7-4814-b5f8-729641cbd4dd': { start: 'output2', end: 'input1' },
    '761dd3b4-0a66-4279-a331-2b6bc64cf95f': { start: 'output1', end: '13888b8c-066a-4a0d-a98c-f3e34a361177' },
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
    window.refs = this.space;

    return (
      <Fragment>
        <SidebarContainer name="nodeDetails" component={NodeSidebarDetailsContainer} />
        <GraphSpace
          connections={defaultSpace.connections}
          nodes={defaultSpace.nodes}
          ref={this.space}
          onNodeEdit={this.handleNodeEdit}
          onNodeDoubleClick={this.handleNodeDoubleClick}
        />
        <NodeEditModalComponent />
      </Fragment>
    );
  }
}
