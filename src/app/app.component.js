import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { GraphsComponent } from 'app/components/graphs/graphs.component';

import './app.scss';

export class AppComponent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <div>application</div>} />
        <Route path="/graph" component={GraphsComponent} />
        <Redirect to="/" />
      </Switch>
    );
  }
}
