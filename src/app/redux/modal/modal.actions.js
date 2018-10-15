import { createAction } from 'redux-actions';

import { MODAL_TOGGLE, MODAL_REGISTER, MODAL_DESTROY } from './modal.action-types.js';

export const modalRegister = createAction(MODAL_REGISTER, id => id);

export const modalDestroy = createAction(MODAL_DESTROY, id => id);

export const modalToggle = createAction(MODAL_TOGGLE, id => id);
