import { connect } from 'react-redux';
import { compose } from 'redux';

import { modalToggle } from 'app/redux/modal/modal.actions';

import { GraphsComponent } from './graphs.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  modalToggle: (name, params) => modalToggle(name, params),
};

export const GraphsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(GraphsComponent);
