import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import PixelCanvas from './PixelCanvas';

class PixelCanvasContainer extends Component {
  setEraser() {
    store.dispatch({ type: 'SET_ERASER', payload: { type: 'ERASER', color: [255, 255, 255] } });
  }

  setPen() {
    store.dispatch({ type: 'SET_PEN', payload: { type: 'PEN', color: [255, 0, 0, 1] } });
  }

  render() {
    return (
      <div className="canvas-container">
      <button onClick={this.setEraser.bind(this)}>Eraser</button>
      <button onClick={this.setPen.bind(this)}>Pen</button>
        <PixelCanvas tool={this.props.tool.type} color={this.props.tool.color} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    tool: store.toolState
  };
}

export default connect(mapStateToProps)(PixelCanvasContainer)
