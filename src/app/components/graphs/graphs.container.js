import { connect } from 'react-redux';
import { compose } from 'redux';

import { modalToggle } from 'app/redux/modal/modal.actions';
import { sidebarToggle } from 'app/redux/sidebar/sidebar.actions';

import { GraphsComponent } from './graphs.component';

import { fetchMarket, requestMarketGoods } from 'app/redux/market/market.actions';

const mapStateToProps = ({ market: { data } }) => ({ market: data, loading: !data });

const mapDispatchToProps = {
  modalToggle,
  sidebarToggle,
  requestMarketGoods,
  fetchMarket,
};

export const GraphsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(GraphsComponent);
