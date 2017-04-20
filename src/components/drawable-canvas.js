import React, { Component } from 'react';

class DrawableCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: [0, 0, 0, 255],
      x: 0,
      y: 0,
      drawing: false,
      drawGrid: this.props.drawGrid,
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
    const zoom = this.props.zoom;
    const width = this.props.width * zoom;
    const height = this.props.height * zoom;

    const ctx = this.gridCanvas.ctx;

    this.gridCanvas.ctx.clearRect(0, 0, width, height);

    if (this.state.drawGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      for (let x = 0; x < width; x += zoom) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += zoom) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    if (this.state.drawCursor) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(this.state.x * zoom, this.state.y * zoom, zoom, zoom);
    }
  }

  clearEditor() {
    const zoom = this.props.zoom;
    const width = this.props.width * zoom;
    const height = this.props.height * zoom;
    this.editorCanvas.ctx.clearRect(0, 0, width, height);
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

  toggleGrid() {
    this.setState((state, props) => {
      return { drawGrid: !state.drawGrid };
    });

    setTimeout(function() { this.clearGrid() }.bind(this), 0);
  }

  drawPixel() {
    if (!this.editorCanvas.ctx || !this.imageData) {
      return;
    }

    const c = this.state.color;
    const zoom = this.props.zoom;
    const ctx = this.editorCanvas.ctx;

    const x = this.state.x * zoom;
    const y = this.state.y * zoom;

    ctx.clearRect(x, y, zoom, zoom);

    ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]/255})`;
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
    const zoom = this.props.zoom;
    const width = this.props.width * zoom;
    const height = this.props.height * zoom;

    const exportedData = {
      width: this.props.width,
      height: this.props.height,
      zoom: this.props.zoom,
      data: []
    };

    for (let x = 0; x < width; x += zoom) {
      for (let y = 0; y < height; y += zoom) {
        const id = ctx.getImageData(x, y, 1, 1).data;
        exportedData.data.push([id[0], id[1], id[2], id[3]]);
      }
    }

    console.log(exportedData);
  }

  exportAsPng() {
    window.location = this.editorCanvas.canvas.toDataURL("image/png");
  }

  render() {
    var editorStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      border: '1px solid black',
      cursor: 'crosshair'
    };

    var gridButtonText = this.state.drawGrid ? 'Hide Grid' : 'Show Grid';

    var gridStyle = { ...editorStyle, zIndex: 2 };
    var text = `(x: ${this.state.x}, y: ${this.state.y})`;

    const width = this.props.width * this.props.zoom;
    const height = this.props.height * this.props.zoom;
    return (
      <div className="drawable-canvas">
      <div>{text}</div>
      <button onClick={this.toggleGrid.bind(this)}>{gridButtonText}</button>
        <button onClick={this.exportAsJson.bind(this)}>Export as JSON</button>
        <button onClick={this.exportAsPng.bind(this)}>Export as PNG</button>
        <div style={{ position: 'relative' }}>
          <canvas ref="editorCanvas" width={width} height={height} style={editorStyle}></canvas>
          <canvas ref="gridCanvas" width={width} height={height} style={gridStyle}></canvas>
        </div>
      </div>
    );
  }
}

export default DrawableCanvas
