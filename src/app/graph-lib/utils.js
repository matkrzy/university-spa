export const callbackHelper = (callback, params) => (callback ? (params ? callback(params) : callback()) : null);
