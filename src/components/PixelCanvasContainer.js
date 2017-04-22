import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PixelCanvas from './PixelCanvas';
import './PixelCanvasContainer.css';

class PixelCanvasContainer extends Component {
  render() {
    return (
      <div className="canvas-container">
        <PixelCanvas width={this.props.canvas.width}
                     height={this.props.canvas.height}
                     zoom={this.props.canvas.zoom}
                     tool={this.props.canvas.tool}
                     color={this.props.canvas.color} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    canvas: store.canvasState
  };
}

PixelCanvasContainer.propTypes = {
  canvas: PropTypes.object
};

export default connect(mapStateToProps)(PixelCanvasContainer);
