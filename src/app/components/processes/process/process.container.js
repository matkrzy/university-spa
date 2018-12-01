import { connect } from 'react-redux';
import { compose } from 'redux';

import { modalToggle } from 'app/redux/modal/modal.actions';
import { sidebarToggle } from 'app/redux/sidebar/sidebar.actions';
import { updateGlobalMarket } from 'app/redux/market-global/market-global.actions';
import { marketLocalUpdate } from 'app/redux/market-local/market-local.actions';
import { processUpdate } from 'app/redux/process/process.actions';

import { ProcessComponent } from './process.component';

const mapStateToProps = ({ market: { data }, localMarket, process: { data: process } }) => ({
  market: data,
  loading: !data,
  localMarket,
  process,
});

const mapDispatchToProps = {
  modalToggle,
  sidebarToggle,
  updateGlobalMarket,
  marketLocalUpdate,
  processUpdate,
};

export const ProcessContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ProcessComponent);
