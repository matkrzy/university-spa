import { connect } from 'react-redux';
import { compose } from 'redux';

import { ProcessesListComponent } from './processes-list.component';

import { processesListFetch, processesListRemove } from 'app/redux/processes/processes.actions';
import { modalToggle } from 'app/redux/modal/modal.actions';

const mapStateToProps = ({ processes: { list: processes } }) => ({ processes, loading: !processes });

const mapDispatchToProps = { processesListFetch, modalToggle, processesListRemove };

export const ProcessesListContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ProcessesListComponent);
