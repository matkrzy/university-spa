import { NOTIFICATIONS_ADD, NOTIFICATIONS_TAKE } from './notifications.action-types';

const initialState = {
  list: [],
};

export const notificationsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case NOTIFICATIONS_ADD:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case NOTIFICATIONS_TAKE:
      return {
        ...state,
        list: state.list.slice(1, state.list.length),
      };
    default:
      return state;
  }
};
