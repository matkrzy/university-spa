import { spaceEventBus } from './spaceEventBus';

import { SPACE_MODEL_SAVE } from './space.action-types';

export const spaceModelSaveEvent = payload => spaceEventBus.emit(SPACE_MODEL_SAVE, payload);
