import { connect } from 'react-redux';
import get from 'lodash/get';

import { ModalComponent } from './modal.component';

import { modalRegister, modalDestroy, modalToggle } from 'app/redux/modal/modal.actions';

const mapStateToProps = ({ modals }, { name, isOpen }) => ({
  isOpen: isOpen || get(modals, `${name}.isOpen`, false),
});

const mapDispatchToProps = {
  register: modalRegister,
  destroy: modalDestroy,
  toggle: modalToggle,
};

export const ModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalComponent);
