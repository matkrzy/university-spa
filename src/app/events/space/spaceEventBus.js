import EventEmitter from 'events';

const maxListeners = 100;

export const spaceEventBus = new EventEmitter().setMaxListeners(maxListeners);
