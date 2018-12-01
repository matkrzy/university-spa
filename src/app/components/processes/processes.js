import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { ProcessesListContainer } from './list/processes-list.container';
import { ProcessContainer } from './process/process.container';

export class ProcessesComponent extends Component {
  render() {
    const {
      match: { path },
    } = this.props;

    return (
      <Switch>
        <Route path={`${path}/list`} render={() => <ProcessesListContainer parentPath={path} />} />
        <Route path={`${path}/:id`} component={ProcessContainer} />
        <Redirect to="/process/list" />
      </Switch>
    );
  }
}
