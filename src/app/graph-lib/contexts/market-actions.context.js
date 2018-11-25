import React from 'react';

/** Object representing a `MarketContext`
 */
export const MarketActionsContext = React.createContext();

export const withMarketActions = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <MarketActionsContext.Consumer>
      {marketActions => <WrappedComponent {...props} ref={ref} marketActions={marketActions} />}
    </MarketActionsContext.Consumer>
  ));
