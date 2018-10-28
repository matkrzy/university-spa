import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { AppComponent } from './app/app.component';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';

import { modalReducer as modals } from 'app/redux/modal/modal.reducer';
import { sidebarReducer as sidebars } from 'app/redux/sidebar/sidebar.reducer';

const reducers = combineReducers({
  modals,
  sidebars,
});

const history = createHistory();
const middlewares = [routerMiddleware(history), thunkMiddleware];
const store = createStore(
  reducers,
  compose(
    applyMiddleware(...middlewares),
    devToolsEnhancer({}),
  ),
);

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
