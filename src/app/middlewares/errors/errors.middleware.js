import { notificationsAdd } from 'app/redux/notifications/notifications.actions';

export const errorsMiddleware = store => next => action => {
  if (action.payload && action.payload.errors) {
    const { errors } = action.payload;
    const { dispatch } = store;

    dispatch(notificationsAdd(errors));

    return;
  }

  next(action);
};
