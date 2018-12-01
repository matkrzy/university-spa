import { RSAA } from 'redux-api-middleware';

const prefixesExcludedFromAPI = ['http://', 'https://'];

const prepareEndpoint = endpoint => {
  if (prefixesExcludedFromAPI.some(prefix => endpoint.startsWith(prefix))) {
    return endpoint;
  } else {
    return process.env.REACT_APP_API_URL + endpoint;
  }
};

export const endpointMiddleware = () => next => action => {
  const apiMiddleware = action[RSAA];

  if (!apiMiddleware) {
    return next(action);
  }

  return next({
    [RSAA]: {
      ...apiMiddleware,
      endpoint: prepareEndpoint(apiMiddleware.endpoint),
    },
  });
};
