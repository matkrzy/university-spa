import { MARKET_UPDATE } from './market.action-types';

const initState = {
  data: null,
};

export const marketReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case MARKET_UPDATE:
      return {
        data: payload.data,
      };
    default:
      return state;
  }
};
