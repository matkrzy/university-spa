import {
  PROCESSES_LIST_FETCH_REQUEST,
  PROCESSES_LIST_FETCH_SUCCESS,
  PROCESSES_LIST_FETCH_FAILURE,
} from './processes.action-types';

const initState = {
  list: null,
};

export const processesReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case PROCESSES_LIST_FETCH_REQUEST:
      return {
        list: null,
      };
    case PROCESSES_LIST_FETCH_SUCCESS:
      return {
        list: payload.data,
      };
    case PROCESSES_LIST_FETCH_FAILURE:
      return {
        list: null,
        error: true,
      };
    default:
      return state;
  }
};
