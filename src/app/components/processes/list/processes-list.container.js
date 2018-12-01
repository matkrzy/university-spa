import { connect } from 'react-redux';
import { compose } from 'redux';

import { ProcessesListComponent } from './processes-list.component';

import { processesListFetch } from 'app/redux/processes/processes.actions';

const mapStateToProps = ({ processes: { list: processes } }) => ({ processes, loading: !processes });

const mapDispatchToProps = { processesListFetch };

export const ProcessesListContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ProcessesListComponent);
