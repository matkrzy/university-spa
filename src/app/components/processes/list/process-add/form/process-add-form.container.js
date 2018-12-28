import { connect } from 'react-redux';
import { compose } from 'redux';

import { NodeAddForm } from './process-add-form.component';
import { modalToggle } from 'app/redux/modal/modal.actions';

import { processesListAdd } from 'app/redux/processes/processes.actions';

const uuid = require('uuid/v4');

const mapStateToProps = () => ({
  initialValues: {
    id: uuid(),
    nodes: [],
    connections: {},
  },
});

const mapDispatchToProps = (dispatch, { toggle }) => ({
  modalToggle: (name, params) => modalToggle(name, params),
  onSubmit: body => {
    dispatch(processesListAdd(body));
    toggle();
  },
});

export const ProcessAddFormContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NodeAddForm);
