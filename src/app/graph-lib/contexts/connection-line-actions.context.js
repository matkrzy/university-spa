import React from 'react';

/** Object representing a `ConnectionLineActionsContext`
 */
export const ConnectionLineActionsContext = React.createContext();

export const withConnectionLineActions = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <ConnectionLineActionsContext.Consumer>
      {connectionLineActions => <WrappedComponent {...props} connectionLineActions={connectionLineActions} ref={ref} />}
    </ConnectionLineActionsContext.Consumer>
  ));
