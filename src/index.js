import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { AppComponent } from './app/app.component';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';
import { apiMiddleware } from 'redux-api-middleware';
import createSagaMiddleware from 'redux-saga';

import { endpointMiddleware } from 'app/middlewares/endpoint/endpoint.middleware';
import { bodyMiddleware } from 'app/middlewares/body/body.middleware';
import { errorsMiddleware } from 'app/middlewares/errors/errors.middleware';

import { modalReducer as modals } from 'app/redux/modal/modal.reducer';
import { sidebarReducer as sidebars } from 'app/redux/sidebar/sidebar.reducer';
import { marketReducer as market } from 'app/redux/market/market.reducer';
import { processesReducer as processes } from 'app/redux/processes/processes.reducer';
import { processReducer as process } from 'app/redux/process/process.reducer';
import { notificationsReducer as notifications } from 'app/redux/notifications/notifications.reducer';

import { appSaga } from 'app/saga/sagas';

const reducers = combineReducers({
  modals,
  sidebars,
  market,
  processes,
  process,
  notifications,
});

const history = createHistory();

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  routerMiddleware(history),
  thunkMiddleware,
  bodyMiddleware,
  endpointMiddleware,
  apiMiddleware,
  errorsMiddleware,
  sagaMiddleware,
];

const store = createStore(
  reducers,
  compose(
    applyMiddleware(...middlewares),
    devToolsEnhancer({}),
  ),
);

sagaMiddleware.run(appSaga);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppComponent />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

render();

if (module.hot) {
  module.hot.accept('./app/app.component', () => {
    render();
  });
}
