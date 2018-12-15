import { takeEvery, select } from 'redux-saga/effects';

import { PROCESS_GOODS_UPDATE } from 'app/redux/process/process.action-types';

export const PROCESS_GOODS_STATE_KEY = 'processState';

const goodsSelector = state => state.process.goods;

function* afterProcessGoodsUpdate() {
  const goods = yield select(goodsSelector);

  try {
    yield localStorage.setItem(PROCESS_GOODS_STATE_KEY, JSON.stringify(goods));
  } catch (e) {
    console.error(e);
  }
}

export function* processSaga() {
  yield takeEvery(PROCESS_GOODS_UPDATE, afterProcessGoodsUpdate);
}
