import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Nav from './Nav';
import DraggablePanel from './DraggablePanel';
import PixelCanvasContainer from './PixelCanvasContainer';
import ToolsContainer from './ToolsContainer';
import store from '../store';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Nav />
          <ToolsContainer />
          <PixelCanvasContainer />
          <DraggablePanel title="About" x={10} y={450} width={200} >
            <p>PXXL is an experimental React powered Pixel Editor developed by <a href="http://twitter.com/tomeglenn">Tom Glenn</a></p>
            <p>Checkout the repository on <a href="http://github.com/tomeglenn/pxxl">GitHub</a></p>
          </DraggablePanel>
        </div>
      </Provider>
    );
  }
}

export default App;
