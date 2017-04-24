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
    this.state = { showColorPicker: true };
  }

  setTool(tool) {
    store.dispatch({ type: 'SET_TOOL', payload: tool });
  }

  handleColorChange(color) {
    store.dispatch({ type: 'SET_COLOR', payload: color.rgb });
  }

  setSize(width, height) {
    store.dispatch({ type: 'SET_SIZE', payload: { width: width, height: height }});
  }

  toggleGrid() {
    store.dispatch({ type: 'TOGGLE_GRID', payload: null });
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
