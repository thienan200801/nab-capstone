import { createGlobalState } from 'react-hooks-global-state';

const {setGlobalState, useGlobalState } = createGlobalState({ customerID: null });

export {setGlobalState, useGlobalState };