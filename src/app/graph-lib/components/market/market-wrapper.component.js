import React from 'react';

import { MarketComponent } from './market.component';
import { MarketContext } from '../../contexts/market.context';

export const MarketComponentWrapper = props => (
  <MarketContext.Consumer>{market => <MarketComponent market={market} {...props} />}</MarketContext.Consumer>
);
