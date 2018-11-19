import React from 'react';

/** Object representing a `SpaceContext`
 */
export const SpaceContext = React.createContext();

export const withSpace = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <SpaceContext.Consumer>{space => <WrappedComponent {...props} space={space} ref={ref} />}</SpaceContext.Consumer>
  ));
