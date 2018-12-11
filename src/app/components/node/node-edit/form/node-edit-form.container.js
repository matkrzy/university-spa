import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeEditForm } from './node-edit-form.component';
import { modalToggle } from 'app/redux/modal/modal.actions';

const mapStateToProps = ({ modals, market, marketLocal }, { modalName, toggle }) => {
  const node = modals[modalName].params;

  const inputs = node
    .getInputsRef()
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
    products: Object.values(market.data).map(({ label, id, processId }) => ({
      id,
      label,
      canRemove: !!processId,
    })),
    process: node.props.process,
    market: market.data,
  };
};

const mapDispatchToProps = {
  modalToggle,
};

export const NodeEditFormContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NodeEditForm);
