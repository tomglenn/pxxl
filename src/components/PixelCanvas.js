import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PixelCanvas.css';

class PixelCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      drawing: false,
      drawCursor: false
    };
  }

  componentDidMount() {
    this.editorCanvas = {
      canvas: this.refs.editorCanvas,
      ctx: this.refs.editorCanvas.getContext('2d')
    };

    this.gridCanvas = {
      canvas: this.refs.gridCanvas,
      ctx: this.refs.gridCanvas.getContext('2d')
    };

    this.imageData = this.editorCanvas.ctx.createImageData(1, 1);

    this.clearEditor();
    this.clearGrid();

    this.gridCanvas.canvas.addEventListener('mousemove', this.updatePosition.bind(this));
    this.gridCanvas.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.gridCanvas.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.gridCanvas.canvas.addEventListener('mouseout', this.showCursor.bind(this, false));
  }

  clearGrid() {
    const width = this.getCalculatedWidth();
    const height = this.getCalculatedHeight();
    const ctx = this.gridCanvas.ctx;

    this.gridCanvas.ctx.clearRect(0, 0, width, height);

    if (this.props.drawGrid) {
      ctx.strokeStyle = this.getColorString(this.props.gridColor);

      for (let x = 0; x < width; x += this.props.zoom) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += this.props.zoom) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    if (this.state.drawCursor) {
      ctx.fillStyle = this.getColorString(this.props.color, 0.5);
      ctx.fillRect(this.state.x * this.props.zoom, this.state.y * this.props.zoom, this.props.zoom, this.props.zoom);
    }
  }

  clearEditor() {
    this.editorCanvas.ctx.clearRect(0, 0, this.getCalculatedWidth(), this.getCalculatedHeight());
  }

  startDrawing() {
    this.setState(() => {
      return { drawing: true };
    });

    this.useActiveTool();
  }

  stopDrawing() {
    this.setState(() => {
      return { drawing: false };
    });
  }

  useActiveTool() {
    if (this.props.tool === 'PEN') {
      this.drawPixel();
    }

    if (this.props.tool === 'ERASER') {
      this.erasePixel();
    }
  }

  showCursor(show) {
    this.setState(() => {
      return { drawCursor: show };
    });

    setTimeout(function() { this.clearGrid(); }.bind(this), 0);
  }

  drawPixel() {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return;
    }

    const zoom = this.props.zoom;
    const ctx = this.editorCanvas.ctx;
    const x = this.state.x * zoom;
    const y = this.state.y * zoom;

    this.erasePixel();

    ctx.fillStyle = this.getColorString(this.props.color);
    ctx.fillRect(x, y, zoom, zoom);
  }

  erasePixel() {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return;
    }

    const zoom = this.props.zoom;
    const ctx = this.editorCanvas.ctx;
    const x = this.state.x * zoom;
    const y = this.state.y * zoom;

    ctx.clearRect(x, y, zoom, zoom);
  }

  updatePosition(event) {
    const x = Math.floor(event.layerX / this.props.zoom);
    const y = Math.floor(event.layerY / this.props.zoom);

    this.setState(() => {
      return { x, y };
    });

    if (this.state.drawing) {
      this.useActiveTool();
    }

    this.showCursor(true);
    this.clearGrid();
  }

  exportAsJson() {
    const ctx = this.editorCanvas.ctx;

    const exportedData = {
      width: this.props.width,
      height: this.props.height,
      zoom: this.props.zoom,
      data: []
    };

    for (let x = 0; x < this.getCalculatedWidth(); x += this.props.zoom) {
      for (let y = 0; y < this.getCalculatedHeight(); y += this.props.zoom) {
        const id = ctx.getImageData(x, y, 1, 1).data;
        exportedData.data.push([id[0], id[1], id[2], id[3]]);
      }
    }
  }

  exportAsPng() {
    window.location = this.editorCanvas.canvas.toDataURL('image/png');
  }

  getCalculatedWidth() {
    return this.props.width * this.props.zoom;
  }

  getCalculatedHeight() {
    return this.props.height * this.props.zoom;
  }

  getColorString(c, a) {
    const alpha = a ? a : c[3];
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
  }

  render() {
    const style = { width: this.getCalculatedWidth(), height: this.getCalculatedHeight() };
    return (
      <div className="canvas-wrapper" style={style}>
        {this.props.showCoords &&
          <div className="canvas-coords">(x: {this.state.x}, y: {this.state.y})</div>
        }
        <canvas className="editor-canvas" ref="editorCanvas" width={this.getCalculatedWidth()} height={this.getCalculatedHeight()}></canvas>
        <canvas className="grid-canvas" ref="gridCanvas" width={this.getCalculatedWidth()} height={this.getCalculatedHeight()}></canvas>
      </div>
    );
  }
}

const colorPropType = PropTypes.shape({
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
  a: PropTypes.number
});

PixelCanvas.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  zoom: PropTypes.number,
  color: colorPropType,
  gridColor: colorPropType,
  drawGrid: PropTypes.bool,
  showCoords: PropTypes.bool,
  showExport: PropTypes.bool,
  tool: PropTypes.string
};

PixelCanvas.defaultProps = {
  width: 50,
  height: 50,
  zoom: 10,
  color: { r: 0, g: 0, b: 0, a: 1 },
  gridColor: { r: 255, g: 255, b: 255, a: 0.1 },
  drawGrid: true,
  showCoords: false,
  showExport: false,
};

export default PixelCanvas;
