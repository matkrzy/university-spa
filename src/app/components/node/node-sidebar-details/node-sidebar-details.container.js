import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeSidebarDerails } from './node-sidebar-details.component';

const mapStateToProps = ({ market: { data: market } }, { params: node }) => {
  const inputs = node
    .getInputsRef()
    .map(({ props: { label, maxConnections = 1, id, disabled }, state: { connections } }) => ({
      label,
      maxConnections,
      connections,
      id,
    }));

  const outputs = node
    .getOutputsRef()
    .map(({ props: { label, maxConnections = 1, id, disabled }, state: { connections } }) => ({
      label,
      maxConnections,
      connections,
      id,
    }));

  return { inputs, outputs, process: node.props.process, market };
};

const mapDispatchToProps = {};

export const NodeSidebarDetailsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NodeSidebarDerails);
