import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../store';
import DraggablePanel from './DraggablePanel';
import ToolButton from './ToolButton';
import { ChromePicker } from 'react-color';
import './ToolsContainer.css';

class ToolsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showColorPicker: true,
      width: this.props.canvas.width,
      height: this.props.canvas.height
    };
  }

  setTool(tool) {
    store.dispatch({ type: 'SET_TOOL', payload: tool });
  }

  handleColorChange(color) {
    store.dispatch({ type: 'SET_COLOR', payload: color.rgb });
  }

  handleZoomChange(event) {
    store.dispatch({ type: 'SET_ZOOM', payload: parseInt(event.target.value) });
  }

  handleWidthChange(event) {
    this.setState({ width: parseInt(event.target.value) });
  }

  handleHeightChange(event) {
    this.setState({ height: parseInt(event.target.value) });
  }

  setNewSize() {
    console.log('hi');
    store.dispatch({ type: 'SET_SIZE', payload: { width: this.state.width, height: this.state.height }});
  }

  toggleGrid() {
    store.dispatch({ type: 'TOGGLE_GRID', payload: null });
  }

  save() {
    store.dispatch({ type: 'TRIGGER_SAVING', payload: null });
  }

  render() {
    const c = this.props.canvas.color;
    const colorStyle = {
      margin: '10px auto',
      width: '32px',
      height: '32px',
      background: `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`,
      border: '1px solid #222'
    };

    const zooms = [1, 5, 10, 20, 30, 40, 50].map((z) => {
      return <option key={z} value={z}>{z}x</option>;
    });

    const sizeInput = {
      display: 'inline-block',
      width: '50px'
    };

    return (
        <div className="tools-container">
          <DraggablePanel title="Tools" x={10} y={60}>
            <ToolButton title="Pencil" icon="pencil" handleClick={this.setTool.bind(this, 'PEN')} active={this.props.canvas.tool === 'PEN'} />
            <ToolButton title="Eraser" icon="eraser" handleClick={this.setTool.bind(this, 'ERASER')} active={this.props.canvas.tool === 'ERASER'} />
            <br />
            <ToolButton title="Flood Fill" icon="tint" handleClick={this.setTool.bind(this, 'FILL')} active={this.props.canvas.tool === 'FILL'} />
            <hr style={{ borderColor: '#666' }} />
            <div style={colorStyle}></div>
            <hr style={{ borderColor: '#666' }} />
            <ToolButton title="Toggle Grid" icon="th-large" handleClick={this.toggleGrid.bind(this)} active={this.props.canvas.showGrid} />

            <ToolButton title="Save" icon="save" handleClick={this.save.bind(this)} />

            <hr style={{ borderColor: '#666' }} />

            <label><i className="fa fa-search-plus"></i> </label>
            <select onChange={this.handleZoomChange.bind(this)} value={this.props.canvas.zoom}>
              {zooms}
            </select>

            <hr style={{ borderColor: '#666' }} />

            <label>Canvas Size</label><br />
            <input type="number" value={this.state.width} onChange={this.handleWidthChange.bind(this)} style={sizeInput} />
            x
            <input type="number" value={this.state.height} onChange={this.handleHeightChange.bind(this)} style={sizeInput} />
            <br />
            <br />
            <button onClick={this.setNewSize.bind(this)}>Set Size</button>
          </DraggablePanel>

          {this.state.showColorPicker && <DraggablePanel title="Color" x={10} y={320}>
            <ChromePicker color={this.props.canvas.color} onChangeComplete={this.handleColorChange.bind(this)} />
          </DraggablePanel>}
        </div>
    );
  }
}

ToolsContainer.propTypes = {
  canvas: PropTypes.object
};

function mapStateToProps(store) {
  return {
    canvas: store.canvasState
  };
}

export default connect(mapStateToProps)(ToolsContainer);
