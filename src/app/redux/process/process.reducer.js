import get from 'lodash/get';

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
      const nodeData = get(state.goods, payload.nodeId, {});
      const product = get(nodeData, payload.productId, 0);

      const newState = {
        ...nodeData,
        [payload.productId]: Number(product) + Number(payload.amount),
      };

      return {
        ...state,
        goods: {
          ...state.goods,
          [payload.nodeId]: newState,
        },
      };
    default:
      return state;
  }
};
