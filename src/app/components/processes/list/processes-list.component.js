import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { DotSpinnerComponent } from 'app/components/shared/loading';

import { PROCESS_GOODS_STATE_KEY } from 'app/saga/process/process.saga';

import styles from './processes-list.module.scss';

export class ProcessesListComponent extends Component {
  componentDidMount() {
    this.props.processesListFetch();

    localStorage.removeItem(PROCESS_GOODS_STATE_KEY);
  }

  render() {
    const { processes, parentPath } = this.props;

    if (!processes) {
      return <DotSpinnerComponent />;
    }

    return (
      <div className={styles.container}>
        <h2>Select process</h2>
        <ul className={styles.list}>
          {processes.map(({ name, id }) => (
            <li key={id}>
              <Link to={`${parentPath}/${id}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
