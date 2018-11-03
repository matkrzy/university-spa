import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeEditComponent } from './node-edit.component';

const mapStateToProps = ({ modals }, { modalName, toggle }) => {
  const node = modals[modalName].params;

  const inputs = node
    .getInputsRefs()
    .getListRef()
    .map(({ props: { label, maxConnections = 1, id, disabled }, state: { connections } }) => ({
      label,
      maxConnections,
      id,
      connections,
      disabled: disabled || connections >= maxConnections,
    }));

  const outputs = node
    .getOutputsRef()
    .getListRef()
    .map(({ props: { label, maxConnections = 1, id, disabled }, state: { connections } }) => ({
      label,
      maxConnections,
      id,
      connections,
      disabled: disabled || connections >= maxConnections,
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
  };
};

export const NodeEditContainer = compose(
  connect(
    mapStateToProps,
    null,
  ),
)(NodeEditComponent);
