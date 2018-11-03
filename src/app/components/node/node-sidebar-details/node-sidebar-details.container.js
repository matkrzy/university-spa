import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeSidebarDerails } from './node-sidebar-details.component';

const mapStateToProps = (state, { params: node }) => {
  const inputs = node
    .getInputsRefs()
    .getListRef()
    .map(({ props: { label, maxConnections = 1, id, disabled }, state: { connections } }) => ({
      label,
      maxConnections,
      connections,
      id,
    }));

  const outputs = node
    .getOutputsRef()
    .getListRef()
    .map(({ props: { label, maxConnections = 1, id, disabled }, state: { connections } }) => ({
      label,
      maxConnections,
      connections,
      id,
    }));

  return { inputs, outputs, process: node.props.process };
};

const mapDispatchToProps = {};

export const NodeSidebarDetailsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NodeSidebarDerails);
