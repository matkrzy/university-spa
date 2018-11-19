import React from 'react';

/** Object representing a `currentConnectionContext`
 */
export const CurrentConnectionContext = React.createContext(undefined);

export const withCurrentConnection = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <CurrentConnectionContext.Consumer>
      {currentConnection => <WrappedComponent {...props} currentConnection={currentConnection} ref={ref} />}
    </CurrentConnectionContext.Consumer>
  ));
