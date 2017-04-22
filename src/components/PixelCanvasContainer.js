import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

PixelCanvasContainer.propTypes = {
  tool: PropTypes.object
};

export default connect(mapStateToProps)(PixelCanvasContainer);
