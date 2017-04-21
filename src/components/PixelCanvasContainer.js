import React, { Component } from 'react';
import { connect } from 'react-redux';
import PixelCanvas from './PixelCanvas';
import './PixelCanvasContainer.css';

class PixelCanvasContainer extends Component {
  render() {
    return (
      <div className="canvas-container">
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
