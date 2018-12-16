/**
 * CallbackHelper checks if callback and parameters exists and fire callback with parameters or without
 * @param callback
 * @param params
 * @return {null}
 */
export const callbackHelper = (callback, params) => (callback ? (params ? callback(params) : callback()) : null);
