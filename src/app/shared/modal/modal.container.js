import { connect } from 'react-redux';
import { v4 } from 'uuid';
import get from 'lodash/get';

import { ModalComponent } from './modal.component';

import { modalRegister, modalDestroy, modalToggle } from 'app/redux/modal/modal.actions';

const id = v4();
const mapStateToProps = ({ modals }, props) => {
  const modal = get(modals, id, false);

  return {
    id,
    isOpen: modal,
  };
};

const mapDispatchToProps = {
  register: modalRegister,
  destroy: modalDestroy,
  toggle: modalToggle,
};

export const ModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalComponent);
