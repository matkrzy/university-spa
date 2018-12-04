import { processEventBus } from './processEventBus';

import { PROCESS_GOODS_EMIT } from './process.action-types';

export const processGoodsEmit = payload => processEventBus.emit(PROCESS_GOODS_EMIT, payload);
