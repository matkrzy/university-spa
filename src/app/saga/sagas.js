import { fork } from 'redux-saga/effects';

import { processSaga } from './process/process.saga';

export function* appSaga() {
  yield fork(processSaga);
}
