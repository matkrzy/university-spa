import { socket } from '../socket';

import { MARKET_GET, MARKET_UPDATE, MARKET_GOODS_ADD, MARKET_GOODS_REMOVE } from './action-types';

export const marketGet = ({ payload, callback } = {}) => socket.emit(MARKET_GET, payload, callback);

export const marketGoodsUpdate = ({ payload, callback } = {}) => socket.emit(MARKET_UPDATE, payload, callback);

export const marketGoodsAdd = ({ payload, callback } = {}) => socket.emit(MARKET_GOODS_ADD, payload, callback);

export const marketGoodsRemove = ({ payload, callback } = {}) => socket.emit(MARKET_GOODS_REMOVE, payload, callback);
