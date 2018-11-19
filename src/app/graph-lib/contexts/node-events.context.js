import React from 'react';

/** Object representing a `NodeEventsContext`
 */
export const NodeEventsContext = React.createContext();

export const withNodeEvents = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <NodeEventsContext.Consumer>
      {nodeEvents => <WrappedComponent {...props} nodeEvents={nodeEvents} ref={ref} />}
    </NodeEventsContext.Consumer>
  ));
