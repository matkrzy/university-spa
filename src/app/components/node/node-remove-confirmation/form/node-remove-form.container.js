import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeRemoveForm } from './node-remove-form.component';
import { modalToggle } from 'app/redux/modal/modal.actions';

const mapStateToProps = ({ modals, market, marketLocal }, { modalName, toggle }) => {
  const { removeNode, label } = modals[modalName].params;

  return {
    onSubmit: () => {
      try {
        removeNode();

        toggle();
      } catch (e) {
        console.log(e);
      }
    },
    label,
  };
};

const mapDispatchToProps = {
  modalToggle,
};

export const NodeRemoveFormContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NodeRemoveForm);
