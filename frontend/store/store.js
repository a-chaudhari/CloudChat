import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/root_reducer.js';
import thunk from 'redux-thunk';

const configureStore=(preloadedState = {})=>(
  createStore(rootReducer, preloadedState, applyMiddleware(thunk))
);

export default configureStore;
