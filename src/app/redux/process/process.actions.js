import createAction from 'redux-actions/es/createAction';

import { PROCESS_UPDATE, PROCESS_GOODS_UPDATE } from './process.action-types';

export const processUpdate = createAction(PROCESS_UPDATE, data => ({ data }));

export const processGoodsUpdate = createAction(PROCESS_GOODS_UPDATE, payload => payload);
