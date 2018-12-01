import createAction from 'redux-actions/es/createAction';

import { NOTIFICATIONS_ADD, NOTIFICATIONS_TAKE } from './notifications.action-types';

export const notificationsAdd = createAction(NOTIFICATIONS_ADD, notification => notification);

export const notificationsTake = createAction(NOTIFICATIONS_TAKE);
