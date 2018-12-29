import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeAddForm } from './node-add-form.component';
import { modalToggle } from 'app/redux/modal/modal.actions';

import { withNodeActions } from 'app/graph/contexts';

import { NODE_TYPES } from 'app/graph';

const uuid = require('uuid/v4');

const nodeBody = type => {
  switch (type) {
    case NODE_TYPES.sell:
    case NODE_TYPES.buy:
      return { inputs: [{}], outputs: [{}] };
    default:
      return {};
  }
};

const mapStateToProps = ({ modals, market, marketLocal }, { modalName, toggle }) => {
  const { addNode } = modals[modalName].params;

  return {
    onSubmit: values => {
      try {
        const additionalBody = nodeBody(values.type);
        addNode({ ...values, ...additionalBody });

        toggle();
      } catch (e) {
        console.log(e);
      }
    },
    initialValues: {
      label: 'Node',
      id: uuid(),
    },
  };
};

const mapDispatchToProps = {
  modalToggle,
};

export const NodeAddFormContainer = compose(
  withNodeActions,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NodeAddForm);
