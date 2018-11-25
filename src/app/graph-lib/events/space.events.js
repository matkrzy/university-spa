import { SAVE_SPACE_MODEL, UPDATE_CONNECTIONS_EVENT } from '../dictionary';

export const updateConnectionsEvent = fn =>
  new CustomEvent(UPDATE_CONNECTIONS_EVENT, {
    detail: { calculateConnections: fn },
  });

export const saveSpaceModelEvent = new Event(SAVE_SPACE_MODEL);
