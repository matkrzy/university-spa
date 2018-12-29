import { fork } from 'redux-saga/effects';

import { processSaga } from './process/process.saga';
import { processesSaga } from './processes/processes.saga';

export function* appSaga() {
  yield fork(processSaga);
  yield fork(processesSaga);
}
