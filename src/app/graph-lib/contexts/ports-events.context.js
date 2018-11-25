import React from 'react';

/** Object representing a `SpaceEventsContext`
 */
export const PortsEventsContext = React.createContext();

export const withPortEvents = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <PortsEventsContext.Consumer>
      {portsEvents => <WrappedComponent {...props} portsEvents={portsEvents} ref={ref} />}
    </PortsEventsContext.Consumer>
  ));
