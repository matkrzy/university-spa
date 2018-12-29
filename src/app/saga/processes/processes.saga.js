import { takeEvery, put } from 'redux-saga/effects';

import { PROCESSES_LIST_ADD_SUCCESS, PROCESSES_LIST_REMOVE_SUCCESS } from 'app/redux/processes/processes.action-types';
import { processesListFetch } from 'app/redux/processes/processes.actions';

function* afterProcessAdd() {
  yield put(processesListFetch());
}

export function* processesSaga() {
  yield takeEvery([PROCESSES_LIST_ADD_SUCCESS, PROCESSES_LIST_REMOVE_SUCCESS], afterProcessAdd);
}
