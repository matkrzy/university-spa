import { socket } from '../socket';

import { PROCESS_GET, PROCESS_UPDATE } from './action-types';

export const processGet = ({ payload, callback }) => socket.emit(PROCESS_GET, payload, callback);

export const processUpdate = id => ({ payload, callback }) => socket.emit(PROCESS_UPDATE, { ...payload, id }, callback);
