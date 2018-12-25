import { RSAA } from 'redux-api-middleware';

import {
  PROCESSES_LIST_FETCH_REQUEST,
  PROCESSES_LIST_FETCH_SUCCESS,
  PROCESSES_LIST_FETCH_FAILURE,
} from './processes.action-types';

export const processesListFetch = () => ({
  [RSAA]: {
    endpoint: '/process',
    types: [PROCESSES_LIST_FETCH_REQUEST, PROCESSES_LIST_FETCH_SUCCESS, PROCESSES_LIST_FETCH_FAILURE],
    method: 'GET',
  },
});
