import { MARKET_GLOBAL_UPDATE } from './market-global.action-types';

export const updateGlobalMarket = market => {
  return { type: MARKET_GLOBAL_UPDATE, payload: market };
};
