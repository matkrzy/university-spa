import omit from 'lodash/omit';

import { MODAL_TOGGLE, MODAL_REGISTER, MODAL_DESTROY } from './modal.action-types.js';

export const modalReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case MODAL_REGISTER:
      return {
        ...state,
        [payload]: {
          isOpen: false,
        },
      };
    case MODAL_TOGGLE:
      return {
        ...state,
        [payload.id]: {
          isOpen: !state[payload.id].isOpen,
          params: !state[payload.id].isOpen ? payload.params : null,
        },
      };
    case MODAL_DESTROY:
      return {
        ...omit(state, payload),
      };
    default:
      return state;
  }
};
