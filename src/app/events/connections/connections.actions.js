import { connectionsEventBus } from './connectionsEventBus';

import { CONNECTION_ADD, CONNECTION_REMOVE, CONNECTION_CALCULATE } from './connections.action-types';

export const connectionAddEvent = payload => connectionsEventBus.emit(CONNECTION_ADD, payload);

export const connectionRemoveEvent = payload => connectionsEventBus.emit(CONNECTION_REMOVE, payload);

export const connectionCalculateEvent = payload => connectionsEventBus.emit(CONNECTION_CALCULATE, payload);
