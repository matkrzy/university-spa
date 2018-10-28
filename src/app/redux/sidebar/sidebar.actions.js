import { createAction } from 'redux-actions';

import { SIDEBAR_TOGGLE, SIDEBAR_REGISTER, SIDEBAR_DESTROY } from './sidebar.action-types.js';

export const sidebarRegister = createAction(SIDEBAR_REGISTER, id => id);

export const sidebarDestroy = createAction(SIDEBAR_DESTROY, id => id);

export const sidebarToggle = createAction(SIDEBAR_TOGGLE, (name, params = null) => ({
  id: name,
  params,
}));
