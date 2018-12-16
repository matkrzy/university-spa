import createAction from 'redux-actions/es/createAction';

import { PROCESS_UPDATE, PROCESS_GOODS_UPDATE, PROCESS_GOODS_RESET } from './process.action-types';

export const processUpdate = createAction(PROCESS_UPDATE, data => ({ data }));

export const processGoodsUpdate = createAction(PROCESS_GOODS_UPDATE, payload => payload);

export const processGoodsReset = createAction(PROCESS_GOODS_RESET);
