import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PixelCanvasContainer from './PixelCanvasContainer';
import store from '../store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <PixelCanvasContainer />
        </div>
      </Provider>
    );
  }
}

export default App
