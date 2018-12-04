import EventEmitter from 'events';

export const connectionsEventBus = new EventEmitter().setMaxListeners(100);
