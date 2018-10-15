import omit from 'lodash/omit';

import { MODAL_TOGGLE, MODAL_REGISTER, MODAL_DESTROY } from './modal.action-types.js';

export const modalReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case MODAL_REGISTER:
      return {
        ...state,
        [payload]: false,
      };
    case MODAL_TOGGLE:
      return {
        ...state,
        [payload]: !state[payload],
      };
    case MODAL_DESTROY:
      return {
        ...omit(state, payload),
      };
    default:
      return state;
  }
};
