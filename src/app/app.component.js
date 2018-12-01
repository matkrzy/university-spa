import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import 'rc-tooltip/assets/bootstrap.css';

import { ProcessesComponent } from 'app/components/processes/processes';
import { NotificationsContainer } from 'app/components/shared/notifications/notifications.container';

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
          <Route path="/process" component={ProcessesComponent} />
          <Redirect to="/process/list" />
        </Switch>
        <NotificationsContainer />
      </>
    );
  }
}
