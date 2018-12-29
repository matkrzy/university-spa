import EventEmitter from 'events';

export const processEventBus = new EventEmitter().setMaxListeners(100);
