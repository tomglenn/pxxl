import React, { Component } from 'react';
import DrawableCanvas from './drawable-canvas';

class App extends Component {
  render() {
    return (
      <div>
        <DrawableCanvas width={50} height={20} zoom={20} drawGrid={true} />
      </div>
    );
  }
}

export default App
