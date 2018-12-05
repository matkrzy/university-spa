import { createAction } from 'redux-actions';

import { MARKET_UPDATE } from './market.action-types';

export const updateMarket = createAction(MARKET_UPDATE, payload => payload);
