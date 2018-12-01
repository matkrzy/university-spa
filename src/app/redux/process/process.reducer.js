import { PROCESS_UPDATE } from './process.action-types';

const initState = {
  data: null,
};

export const processReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case PROCESS_UPDATE:
      return {
        data: payload.data,
      };
    default:
      return state;
  }
};
