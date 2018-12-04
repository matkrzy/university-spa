import { PROCESS_UPDATE, PROCESS_GOODS_UPDATE } from './process.action-types';

const initState = {
  data: null,
  goods: {},
};

export const processReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case PROCESS_UPDATE:
      return {
        ...state,
        data: payload.data,
      };
    case PROCESS_GOODS_UPDATE:
      return {
        ...state,
        goods: {
          ...state.goods,
          [payload.productId]: (Number(state.goods[payload.productId]) || 0) + Number(payload.amount),
        },
      };
    default:
      return state;
  }
};
