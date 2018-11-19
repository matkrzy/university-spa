import {
  MARKET_FETCH_REQUEST,
  MARKET_FETCH_SUCCESS,
  MARKET_FETCH_FAILURE,
  MARKET_BUY_GOODS_SUCCESS,
} from './market-action-types';

const initState = {
  data: null,
};

export const marketReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case MARKET_FETCH_REQUEST:
      return {
        data: null,
      };
    case MARKET_FETCH_SUCCESS:
    case MARKET_BUY_GOODS_SUCCESS:
      return {
        data: payload.data,
      };
    case MARKET_FETCH_FAILURE:
      return {
        data: null,
        error: true,
      };
    default:
      return state;
  }
};
