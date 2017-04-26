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
    this.pixels = [];
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.saving && nextProps.saving) {
      this.exportAsPng();
      this.props.onSaved();
    }
  }

  componentDidUpdate(prevProps) {
    const sizeHasChanged = ((this.props.width !== prevProps.width) ||
    (this.props.height !== prevProps.height) ||
    (this.props.zoom !== prevProps.zoom) ||
    (this.props.showGrid !== prevProps.showGrid));

    if (sizeHasChanged) {
      this.copyPixels(prevProps);
      this.redrawEditor();
    }
  }

  componentDidMount() {
    this.editorCanvas = {
      canvas: this.refs.editorCanvas,
      ctx: this.refs.editorCanvas.getContext('2d')
    };

    this.redrawEditor();

    this.editorCanvas.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.editorCanvas.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.editorCanvas.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(event) {
    switch(this.props.tool)
    {
      case 'PEN':
      case 'ERASER':
        this.startDrawing();
        break;
      default:
        break;
    }

    this.useActiveTool(event);
  }

  onMouseUp() {
    this.stopDrawing();
  }

  onMouseMove(event) {
    if (this.state.drawing) {
      this.useActiveTool(event);
    }
  }

  useActiveTool(event) {
    const x = Math.floor(event.layerX / this.props.zoom);
    const y = Math.floor(event.layerY / this.props.zoom);

    switch(this.props.tool)
    {
      case 'PEN':
        this.setPixelImmediate(x, y, this.props.color);
        break;
      case 'ERASER':
        this.setPixelImmediate(x, y, null);
        break;
      case 'FILL':
        this.floodFill(x, y, this.props.color);
        break;
      default:
        break;
    }
  }

  redrawEditor() {
    this.editorCanvas.ctx.clearRect(0, 0, this.getCalculatedWidth(), this.getCalculatedHeight());

    let startY = 0;
    let lastColor = undefined;

    for (let x = 0; x < this.props.width; x++) {
      startY = 0;
      for (let y = 0; y < this.props.height; y++) {
        let newColor = this.pixels[this.props.width * y + x];

        const colorsEqual = this.equalColor(lastColor, newColor);
        if ((!colorsEqual || y === this.props.height - 1) && y !== 0 ) {
          this.editorCanvas.ctx.fillStyle = this.getColorString(lastColor);
          this.editorCanvas.ctx.fillRect(x * this.props.zoom, startY * this.props.zoom, this.props.zoom, this.props.zoom * (1 + y - startY));
          startY = y;
        }

        lastColor = newColor;
      }
    }
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

  setPixelImmediate(x, y, color) {
    if (!this.editorCanvas.ctx) {
      return;
    }

    this.editorCanvas.ctx.clearRect(x * this.props.zoom, y * this.props.zoom, this.props.zoom, this.props.zoom);

    if (color) {
      this.editorCanvas.ctx.fillStyle = this.getColorString(color);
      this.editorCanvas.ctx.fillRect(x * this.props.zoom, y * this.props.zoom, this.props.zoom, this.props.zoom);
    }

    this.setPixel(x, y, color);
  }

  setPixel(x, y, color) {
    this.pixels[this.props.width * y + x] = color;
  }

  getPixel(x, y) {
    return this.pixels[this.props.width * y + x];
  }

  copyPixels(prevProps) {
    const oldPixels = this.pixels;
    this.pixels = [];

    var maxX = prevProps.width > this.props.width ? this.props.width : prevProps.width;
    var maxY = prevProps.height > this.props.height ? this.props.height : prevProps.height;

    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        const oldPixel = oldPixels[prevProps.width * y + x];
        if (oldPixel) {
          this.pixels[this.props.width * y + x] = oldPixel;
        }
      }
    }
  }

  floodFill(x, y, replacementColor) {
    const targetColor = this.getPixel(this.state.x, this.state.y);
    if (this.equalColor(targetColor, replacementColor)) {
      return;
    }

    const queue = [];

    this.setPixel(x, y, replacementColor);
    queue.push({ x: x, y: y });

    while(queue.length > 0) {
      const n = queue[0];
      queue.splice(0, 1);

      if (n.x - 1 >= 0) {
        if (this.equalColor(this.getPixel(n.x - 1, n.y), targetColor)) {
          this.setPixel(n.x - 1, n.y, replacementColor);
          queue.push({ x: n.x - 1, y: n.y });
        }
      }

      if (n.x + 1 < this.props.width) {
        if (this.equalColor(this.getPixel(n.x + 1, n.y), targetColor)) {
          this.setPixel(n.x + 1, n.y, replacementColor);
          queue.push({ x: n.x + 1, y: n.y });
        }
      }

      if (n.y - 1 >= 0) {
        if (this.equalColor(this.getPixel(n.x, n.y - 1), targetColor)) {
          this.setPixel(n.x, n.y - 1, replacementColor);
          queue.push({ x: n.x, y: n.y - 1 });
        }
      }

      if (n.y + 1 < this.props.height) {
        if (this.equalColor(this.getPixel(n.x, n.y + 1), targetColor)) {
          this.setPixel(n.x, n.y + 1, replacementColor);
          queue.push({ x: n.x, y: n.y + 1 });
        }
      }
    }

    this.redrawEditor();
  }

  equalColor(c1, c2) {
    if (!c1 && !c2) {
      return true;
    }

    if ((!c1 && c2) || (c1 && !c2)) {
      return false;
    }

    return (c1.r === c2.r &&
            c1.g === c2.g &&
            c1.b === c2.b &&
            c1.a === c2.a);
  }

  exportAsPng() {
    let data = this.realCanvas.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.setAttribute('download', 'pixels.png');
    a.setAttribute('href', data);
    a.click();
  }

  getCalculatedWidth() {
    return this.props.width * this.props.zoom;
  }

  getCalculatedHeight() {
    return this.props.height * this.props.zoom;
  }

  getColorString(c, a) {
    if (!c) {
      return 'rgba(0, 0, 0, 0)';
    }

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
  showGrid: PropTypes.bool,
  showCoords: PropTypes.bool,
  showExport: PropTypes.bool,
  tool: PropTypes.string,
  saving: PropTypes.bool,
  onSaved: PropTypes.func
};

PixelCanvas.defaultProps = {
  width: 50,
  height: 50,
  zoom: 10,
  color: { r: 0, g: 0, b: 0, a: 1 },
  gridColor: { r: 255, g: 255, b: 255, a: 0.1 },
  showGrid: true,
  showCoords: false,
  showExport: false,
  tool: 'PEN',
  saving: false
};

export default PixelCanvas;
