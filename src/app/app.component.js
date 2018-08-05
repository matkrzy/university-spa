import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

export class AppComponent extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <div>application</div>} />
        <Redirect to="/" />
      </Switch>
    );
  }
}
