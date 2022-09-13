import { applyMiddleware, compose, createStore, Store } from 'redux';
import customMiddleWares from './middlewares';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import appReducers from './reducers';
import { Action } from './types';
import { RootState } from './state';

const reducer = (state: any, action: Action) => {
  if (action.type === HYDRATE) {
    return {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
  } else {
    return appReducers(state, action);
  }
};

// add the middleWares
const middleWares = [...customMiddleWares];

// Redux DevTools
let composeEnhancers = compose;
if (typeof window !== 'undefined') {
  composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

// enhancers
const enhancers = composeEnhancers(applyMiddleware(...middleWares));

export const store = () => createStore(reducer, enhancers);

// export an assembled wrapper
export const wrapper = createWrapper<Store<RootState>>(store, { debug: true });
