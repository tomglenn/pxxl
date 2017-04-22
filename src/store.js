import {combineReducers, createStore} from 'redux';
import toolReducer from './reducers/tool-reducer';

const reducer = combineReducers({
  toolState: toolReducer
});

const store = createStore(reducer);
export default store;
