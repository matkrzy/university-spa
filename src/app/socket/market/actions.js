import { socket } from '../socket';

import { MARKET_GET, MARKET_UPDATE, MARKET_ADD_GOODS, MARKET_LOCAL_GET } from './action-types';

export const marketGet = ({ payload, callback } = {}) => socket.emit(MARKET_GET, payload, callback);

export const marketLocalGet = ({ payload, callback } = {}) => socket.emit(MARKET_LOCAL_GET, payload, callback);

export const marketUpdateGoods = ({ payload, callback } = {}) => socket.emit(MARKET_UPDATE, payload, callback);

export const marketAddGoods = ({ payload, callback } = {}) => socket.emit(MARKET_ADD_GOODS, payload, callback);
