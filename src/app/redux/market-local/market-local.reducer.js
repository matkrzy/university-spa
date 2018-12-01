import { MARKET_LOCAL_UPDATE } from './market-local.action-types';

const initState = {
  data: null,
};

export const marketLocalReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case MARKET_LOCAL_UPDATE:
      return {
        data: payload.data,
      };
    default:
      return state;
  }
};
