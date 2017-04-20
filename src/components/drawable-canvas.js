import React, { Component } from 'react';

class DrawableCanvas extends Component {
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
      const c = this.props.gridColor;
      ctx.strokeStyle = `rgba(0, 0, 0, 0.3)`;
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
    this.setState((state, props) => {
      return { drawing: true };
    });

    this.drawPixel();
  }

  stopDrawing() {
    this.setState((state, props) => {
      return { drawing: false };
    });
  }

  showCursor(show) {
    this.setState((state, props) => {
      return { drawCursor: show };
    });

    setTimeout(function() { this.clearGrid() }.bind(this), 0);
  }

  setColor(r, g, b, a) {
    this.setState((state, props) => {
      return { color: [r, g, b, a] };
    });
  }

  drawPixel() {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return;
    }

    const zoom = this.props.zoom;
    const ctx = this.editorCanvas.ctx;

    const x = this.state.x * zoom;
    const y = this.state.y * zoom;

    ctx.clearRect(x, y, zoom, zoom);

    ctx.fillStyle = this.getColorString(this.props.color);
    ctx.fillRect(x, y, zoom, zoom);
  }

  updatePosition(event) {
    const x = Math.floor(event.layerX / this.props.zoom);
    const y = Math.floor(event.layerY / this.props.zoom);

    this.setState((state, props) => {
      return { x, y };
    });

    if (this.state.drawing) {
      this.drawPixel();
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

    console.log(exportedData);
  }

  exportAsPng() {
    window.location = this.editorCanvas.canvas.toDataURL("image/png");
  }

  getCalculatedWidth() {
    return this.props.width * this.props.zoom;
  }

  getCalculatedHeight() {
    return this.props.height * this.props.zoom;
  }

  getColorString(c, a) {
    const alpha = a ? a : c[3];
    return `rgba(${c[0], c[1], c[2], alpha/255})`;
  }

  render() {
    const editorStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      border: '1px solid black',
      cursor: 'crosshair'
    };
    const gridStyle = { ...editorStyle, zIndex: 2 };

    return (
      <div className="drawable-canvas">
        {this.props.showExport &&
          <div>
            <button onClick={this.exportAsJson.bind(this)}>Export as JSON</button>
            <button onClick={this.exportAsPng.bind(this)}>Export as PNG</button>
          </div>
        }

        <div style={{ position: 'relative' }}>
          {this.props.showCoords &&
            <div>(x: {this.state.x}, y: {this.state.y})</div>
          }
          <canvas ref="editorCanvas" width={this.getCalculatedWidth()} height={this.getCalculatedHeight()} style={editorStyle}></canvas>
          <canvas ref="gridCanvas" width={this.getCalculatedWidth()} height={this.getCalculatedHeight()} style={gridStyle}></canvas>
        </div>
      </div>
    );
  }
}

DrawableCanvas.defaultProps = {
  width: 50,
  height: 50,
  zoom: 10,
  color: [0, 0, 0, 255],
  drawGrid: true,
  gridColor: [0, 0, 0, 100],
  showCoords: false,
  showExport: false,
};

export default DrawableCanvas
