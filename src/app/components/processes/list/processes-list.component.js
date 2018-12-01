import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class ProcessesListComponent extends Component {
  componentDidMount() {
    this.props.processesListFetch();
  }

  render() {
    const { processes, parentPath } = this.props;

    if (!processes) {
      return 'Loading';
    }

    return (
      <>
        <h2>Select process</h2>
        <ul>
          {processes.map(({ name, id }) => (
            <li>
              <Link key={id} to={`${parentPath}/${id}`}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
