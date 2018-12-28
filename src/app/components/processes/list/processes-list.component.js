import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { DotSpinnerComponent } from 'app/components/shared/loading';

import { PROCESS_GOODS_STATE_KEY } from 'app/saga/process/process.saga';

import { ProcessAddModalComponent } from './process-add/process-add-modal.component';
import { Button } from 'app/components/shared';

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
          {processes.map(({ label, id }) => (
            <li key={id}>
              <Link to={`${parentPath}/${id}`}>{label}</Link>
              <Button onClick={() => this.props.processesListRemove(id)}>✖</Button>
            </li>
          ))}
        </ul>
        <Button onClick={() => this.props.modalToggle('processAdd')}>Add new process</Button>
        <ProcessAddModalComponent />
      </div>
    );
  }
}
