import { connect } from 'react-redux';
import { compose } from 'redux';

import { modalToggle } from 'app/redux/modal/modal.actions';
import { sidebarToggle } from 'app/redux/sidebar/sidebar.actions';
import { updateMarket } from 'app/redux/market/market.actions';
import { processUpdate } from 'app/redux/process/process.actions';

import { ProcessComponent } from './process.component';

const mapStateToProps = ({ market: { data: market }, process: { data: process } }) => ({
  market,
  process,
});

const mapDispatchToProps = {
  modalToggle,
  sidebarToggle,
  updateMarket,
  processUpdate,
};

export const ProcessContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ProcessComponent);
