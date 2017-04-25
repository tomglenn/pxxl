import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../store';
import PixelCanvas from './PixelCanvas';
import './PixelCanvasContainer.css';

class PixelCanvasContainer extends Component {
  onSaved() {
    store.dispatch({ type: 'TRIGGER_SAVED', payload: null });
  }

  render() {
    return (
      <div className="canvas-container">
        <PixelCanvas width={this.props.canvas.width}
                     height={this.props.canvas.height}
                     zoom={this.props.canvas.zoom}
                     tool={this.props.canvas.tool}
                     color={this.props.canvas.color}
                     showGrid={this.props.canvas.showGrid}
                     showExport={this.props.canvas.showExport}
                     saving={this.props.canvas.saving}
                     onSaved={this.onSaved.bind(this)} />
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
