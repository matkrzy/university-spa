import { RSAA } from 'redux-api-middleware';

import {
  PROCESSES_LIST_FETCH_REQUEST,
  PROCESSES_LIST_FETCH_SUCCESS,
  PROCESSES_LIST_FETCH_FAILURE,
  PROCESSES_LIST_ADD_REQUEST,
  PROCESSES_LIST_ADD_SUCCESS,
  PROCESSES_LIST_ADD_FAILURE,
  PROCESSES_LIST_REMOVE_REQUEST,
  PROCESSES_LIST_REMOVE_SUCCESS,
  PROCESSES_LIST_REMOVE_FAILURE,
} from './processes.action-types';

export const processesListFetch = () => ({
  [RSAA]: {
    endpoint: '/process',
    types: [PROCESSES_LIST_FETCH_REQUEST, PROCESSES_LIST_FETCH_SUCCESS, PROCESSES_LIST_FETCH_FAILURE],
    method: 'GET',
  },
});

export const processesListAdd = body => ({
  [RSAA]: {
    endpoint: '/process',
    types: [PROCESSES_LIST_ADD_REQUEST, PROCESSES_LIST_ADD_SUCCESS, PROCESSES_LIST_ADD_FAILURE],
    method: 'POST',
    body,
  },
});

export const processesListRemove = id => ({
  [RSAA]: {
    endpoint: `/process/${id}`,
    types: [PROCESSES_LIST_REMOVE_REQUEST, PROCESSES_LIST_REMOVE_SUCCESS, PROCESSES_LIST_REMOVE_FAILURE],
    method: 'DELETE',
  },
});
