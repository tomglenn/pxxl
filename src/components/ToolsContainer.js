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

  render() {
    const c = this.props.canvas.color;
    const colorStyle = {
      margin: '10px auto',
      width: '16px',
      height: '16px',
      background: `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`,
      border: '1px solid #222'
    };

    return (
        <div className="tools-container">
          <DraggablePanel title="Tools" x={10} y={60}>
            <ToolButton title="Pencil" icon="pencil" handleClick={this.setTool.bind(this, 'PEN')} active={ this.props.canvas.tool === 'PEN' } />
            <ToolButton title="Eraser" icon="eraser" handleClick={this.setTool.bind(this, 'ERASER')} active={ this.props.canvas.tool === 'ERASER' } />
            <ToolButton title="Flood Fill" icon="tint" handleClick={this.setTool.bind(this, 'FILL')} active={ this.props.canvas.tool === 'FILL' } />
            <hr style={{ borderColor: '#666' }} />
            <div style={colorStyle}></div>

            <button onClick={this.setSize.bind(this, 10, 10)}>Set Size to 10x10</button>
            <button onClick={this.setSize.bind(this, 20, 20)}>Set Size to 20x20</button>
          </DraggablePanel>

          {this.state.showColorPicker && <DraggablePanel title="Color" x={10} y={200}>
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
