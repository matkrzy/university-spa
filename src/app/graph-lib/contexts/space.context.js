import React from 'react';

export let SpaceContext = undefined;

export const createSpaceContext = params => (SpaceContext = React.createContext(params));
