import React from 'react';

/** Object representing a `NodesActionsContext`
 */
export const NodeActionsContext = React.createContext();

export const withNodeActions = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <NodeActionsContext.Consumer>
      {nodeActions => <WrappedComponent {...props} nodeActions={nodeActions} ref={ref} />}
    </NodeActionsContext.Consumer>
  ));
