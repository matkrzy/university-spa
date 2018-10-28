import omit from 'lodash/omit';

import { SIDEBAR_TOGGLE, SIDEBAR_REGISTER, SIDEBAR_DESTROY } from './sidebar.action-types.js';

export const sidebarReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case SIDEBAR_REGISTER:
      return {
        ...state,
        [payload]: {
          isOpen: false,
        },
      };
    case SIDEBAR_TOGGLE:
      return {
        ...state,
        [payload.id]: {
          isOpen: !state[payload.id].isOpen,
          params: !state[payload.id].isOpen ? payload.params : null,
        },
      };
    case SIDEBAR_DESTROY:
      return {
        ...omit(state, payload),
      };
    default:
      return state;
  }
};
