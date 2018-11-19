import React from 'react';

/** Object representing a `MarketContext`
 */
export const MarketContext = React.createContext({
  state: {},
  products: {},
});

export const withMarket = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <MarketContext.Consumer>
      {market => <WrappedComponent {...props} ref={ref} market={market} />}
    </MarketContext.Consumer>
  ));
