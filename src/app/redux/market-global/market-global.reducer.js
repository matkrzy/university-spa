import { MARKET_GLOBAL_UPDATE } from './market-global.action-types';

const initState = {
  data: null,
};

export const marketGlobalReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case MARKET_GLOBAL_UPDATE:
      return {
        data: payload.data,
      };
    default:
      return state;
  }
};
