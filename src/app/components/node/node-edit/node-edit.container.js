import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeEditComponent } from './node-edit.component';

const mapStateToProps = ({ modals, market: { data } }, { modalName, toggle }) => {
  const node = modals[modalName].params;

  const inputs = node
    .getInputsRefs()
    .getListRef()
    .map(({ props: { label, maxConnections = 1, id, disabled, productId }, state: { connections } }) => ({
      label,
      maxConnections,
      id,
      connections,
      disabled,
      productId,
    }));

  const outputs = node
    .getOutputsRef()
    .getListRef()
    .map(({ props: { label, maxConnections = 1, id, disabled, productId }, state: { connections } }) => ({
      label,
      maxConnections,
      id,
      connections,
      disabled,
      productId,
    }));

  return {
    onSubmit: values => {
      try {
        node.handleNodeUpdate(values);
        toggle();
      } catch (e) {
        console.log(e);
      }
    },
    initialValues: {
      title: node.props.title,
      id: node.getId(),
      inputs,
      outputs,
      process: node.props.process,
    },
    type: node.getType(),
    products: Object.entries(data.products).map(([id, { label }]) => ({ id, label })),
  };
};

export const NodeEditContainer = compose(
  connect(
    mapStateToProps,
    null,
  ),
)(NodeEditComponent);
