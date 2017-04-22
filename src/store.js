import {combineReducers, createStore} from 'redux';
import canvasReducer from './reducers/canvas-reducer';

const reducer = combineReducers({
  canvasState: canvasReducer
});

const store = createStore(reducer);
export default store;
