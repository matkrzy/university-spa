import { createAction } from 'redux-actions';

import { MARKET_LOCAL_UPDATE } from './market-local.action-types';

export const marketLocalUpdate = createAction(MARKET_LOCAL_UPDATE, market => market);
