import { connect } from 'react-redux';
import { compose } from 'redux';

import { sidebarRegister, sidebarToggle, sidebarDestroy } from 'app/redux/sidebar/sidebar.actions';

import { SidebarComponent } from './sidebar.component';

const mapStateToProps = ({ sidebars }, { name }) => ({
  ...sidebars[name],
});

const mapDispatchToProps = (dispatch, { name }) => ({
  register: () => dispatch(sidebarRegister(name)),
  toggle: () => dispatch(sidebarToggle(name)),
  destroy: () => dispatch(sidebarDestroy(name)),
});

export const SidebarContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SidebarComponent);
