import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import 'rc-tooltip/assets/bootstrap.css';

import { GraphsContainer } from 'app/components/graphs/graphs.container';

import './app.scss';
import './assets/styles/global.scss';

/**
 * Main component of application. Here is configured the router
 */
export class AppComponent extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route exact path="/" render={() => <div>application</div>} />
          <Route path="/graph" component={GraphsContainer} />
          <Redirect to="/" />
        </Switch>
      </>
    );
  }
}
