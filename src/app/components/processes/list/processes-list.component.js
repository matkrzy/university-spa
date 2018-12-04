import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { DotSpinnerComponent } from 'app/components/shared/loading';

export class ProcessesListComponent extends Component {
  componentDidMount() {
    this.props.processesListFetch();
  }

  render() {
    const { processes, parentPath } = this.props;

    if (!processes) {
      return <DotSpinnerComponent />;
    }

    return (
      <>
        <h2>Select process</h2>
        <ul>
          {processes.map(({ name, id }) => (
            <li key={id}>
              <Link to={`${parentPath}/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
