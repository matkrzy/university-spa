import { connect } from 'react-redux';
import { compose } from 'redux';

import { modalToggle } from 'app/redux/modal/modal.actions';
import { sidebarToggle } from 'app/redux/sidebar/sidebar.actions';

import { GraphsComponent } from './graphs.component';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  modalToggle,
  sidebarToggle,
};

export const GraphsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(GraphsComponent);
