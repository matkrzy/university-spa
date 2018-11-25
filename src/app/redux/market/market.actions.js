import { MARKET_FETCH_SUCCESS, MARKET_BUY_GOODS_SUCCESS } from './market-action-types';

export const fetchMarket = () => {
  const response = {
    data: {
      state: {
        '9c6beb83-c8f8-4dab-af15-732a4df81cfc': 10,
        '407d4deb-ce38-45f8-9aa5-34adfd75b36f': 20,
        'd0baebfb-681d-40da-a136-f92cb94fe249': 0,
        '7b9ee948-202b-4686-bc29-3637477c929b': 0,
        'f7750b1d-9778-4f7c-85c7-ddab1ce59c60': 0,
        'e3e48d22-7078-4e45-bb54-4ed99d18ada1': 0,
      },
      products: {
        '9c6beb83-c8f8-4dab-af15-732a4df81cfc': { label: 'pszenica' },
        '407d4deb-ce38-45f8-9aa5-34adfd75b36f': { label: 'jeczmien' },
        'd0baebfb-681d-40da-a136-f92cb94fe249': { label: 'slod monachiński' },
        '7b9ee948-202b-4686-bc29-3637477c929b': { label: 'slod jasny' },
        'f7750b1d-9778-4f7c-85c7-ddab1ce59c60': { label: 'slod pszeniczny' },
        'e3e48d22-7078-4e45-bb54-4ed99d18ada1': { label: 'slod karmelowy' },
      },
    },
  };

  return { type: MARKET_FETCH_SUCCESS, payload: response };
};

export const requestMarketGoods = ({ amount, productId }) => {
  return (dispatch, getState) => {
    const {
      market: { data },
    } = getState();

    const { state } = data;

    return new Promise((resolve, reject) => {
      if (+state[productId] + +amount >= 0) {
        dispatch({
          type: MARKET_BUY_GOODS_SUCCESS,
          payload: { data: { ...data, state: { ...state, [productId]: +state[productId] + +amount } } },
        });
        resolve();
      }

      reject();
    });
  };
};
