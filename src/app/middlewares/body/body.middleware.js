import { RSAA } from 'redux-api-middleware';

import isString from 'lodash/isString';

export const bodyMiddleware = () => next => action => {
  const apiMiddleware = action[RSAA];

  if (!apiMiddleware) {
    return next(action);
  }

  return next({
    [RSAA]: {
      ...apiMiddleware,
      headers:
        apiMiddleware.body instanceof FormData
          ? apiMiddleware.header
          : {
              ...apiMiddleware.headers,
              'Content-Type': 'application/json',
            },
      body:
        isString(apiMiddleware.body) || apiMiddleware.body instanceof FormData
          ? apiMiddleware.body
          : JSON.stringify(apiMiddleware.body),
    },
  });
};
