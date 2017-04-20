import React, { Component } from 'react';
import DrawableCanvas from './drawable-canvas';

class App extends Component {
  render() {
    return (
      <div>
        <DrawableCanvas showCoords={true} showExport={true} />
      </div>
    );
  }
}

export default App
