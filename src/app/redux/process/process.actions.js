import createAction from 'redux-actions/es/createAction';
import { PROCESS_UPDATE } from './process.action-types';

export const processUpdate = createAction(PROCESS_UPDATE, data => ({ data }));
