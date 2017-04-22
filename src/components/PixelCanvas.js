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
    this.redrawGrid();

    this.gridCanvas.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.gridCanvas.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.gridCanvas.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.gridCanvas.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
  }

  onMouseDown() {
    this.useActiveTool();
  }

  onMouseUp() {
    this.stopDrawing();
  }

  onMouseMove(event) {
    const x = Math.floor(event.layerX / this.props.zoom);
    const y = Math.floor(event.layerY / this.props.zoom);

    this.setState(() => { return { x, y }; });

    if (this.state.drawing) {
      this.useActiveTool();
    }

    this.showCursor(true);
    this.redrawGrid();
  }

  onMouseOut() {
    this.showCursor(false);
  }

  useActiveTool() {
    switch(this.props.tool)
    {
      case 'PEN':
        this.startDrawing();
        this.setPixel(this.state.x, this.state.y, this.props.color);
        break;
      case 'ERASER':
        this.startDrawing();
        this.setPixel(this.state.x, this.state.y, null);
        break;
      case 'FILL':
        this.startFloodFill(this.state.x, this.state.y, this.props.color);
        break;
      default:
        break;
    }
  }

  redrawGrid() {
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

  showCursor(show) {
    this.setState(() => {
      return { drawCursor: show };
    });

    setTimeout(function() { this.redrawGrid(); }.bind(this), 0);
  }

  startDrawing() {
    if (this.state.drawing) {
      return;
    }

    this.setState(() => {
      return { drawing: true };
    });
  }

  stopDrawing() {
    if (!this.state.drawing) {
      return;
    }

    this.setState(() => {
      return { drawing: false };
    });
  }

  setPixel(x, y, color) {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return;
    }

    this.editorCanvas.ctx.clearRect(x * this.props.zoom, y * this.props.zoom, this.props.zoom, this.props.zoom);

    if (color) {
      this.editorCanvas.ctx.fillStyle = this.getColorString(color);
      this.editorCanvas.ctx.fillRect(x * this.props.zoom, y * this.props.zoom, this.props.zoom, this.props.zoom);
    }
  }

  getPixel(x, y) {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return null;
    }

    if (x < 0 || x > this.props.width - 1 || y < 0 || y > this.props.height - 1) {
      return null;
    }

    const c = this.editorCanvas.ctx.getImageData(x * this.props.zoom, y * this.props.zoom, 1, 1).data;
    return { r: c[0], g: c[1], b: c[2], a: c[3]/255 };
  }

  startFloodFill(x, y, color) {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return;
    }

    const targetColor = this.getPixel(this.state.x, this.state.y);
    this.floodFill(this.state.x, this.state.y, targetColor, color);
  }

  floodFill(x, y, targetColor, replacementColor) {
    const pixelColor = this.getPixel(x, y);
    if (this.equalColor(targetColor, replacementColor) || !this.equalColor(pixelColor, targetColor)) {
      return;
    }

    const queue = [];
    this.setPixel(x, y, replacementColor);
    queue.push({ x: x, y: y });

    while(queue.length > 0) {
      const n = queue[0];
      queue.splice(0, 1);

      let westColor = this.getPixel(n.x - 1, n.y);
      let eastColor = this.getPixel(n.x + 1, n.y);
      let northColor = this.getPixel(n.x, n.y - 1);
      let southColor = this.getPixel(n.x, n.y + 1);

      if (westColor !== null && this.equalColor(westColor, targetColor)) {
        this.setPixel(n.x - 1, n.y, replacementColor);
        queue.push({ x: n.x - 1, y: n.y });
      }

      if (eastColor !== null && this.equalColor(eastColor, targetColor)) {
        this.setPixel(n.x + 1, n.y, replacementColor);
        queue.push({ x: n.x + 1, y: n.y });
      }

      if (northColor !== null && this.equalColor(northColor, targetColor)) {
        this.setPixel(n.x, n.y - 1, replacementColor);
        queue.push({ x: n.x, y: n.y - 1 });
      }

      if (southColor != null && this.equalColor(southColor, targetColor)) {
        this.setPixel(n.x, n.y + 1, replacementColor);
        queue.push({ x: n.x, y: n.y + 1 });
      }
    }
  }

  equalColor(c1, c2) {
    return (c1.r === c2.r &&
            c1.g === c2.g &&
            c1.b === c2.b &&
            c1.a === c2.a);
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
        exportedData.data.push([id[0], id[1], id[2], id[3]/255]);
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
    const alpha = a ? a : c.a;
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
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
