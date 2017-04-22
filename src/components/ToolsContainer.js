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

  setEraser() {
    store.dispatch({ type: 'SET_ERASER', payload: { type: 'ERASER' } });
  }

  setPen() {
    store.dispatch({ type: 'SET_PEN', payload: { type: 'PEN' } });
  }

  handleColorChange(color) {
    store.dispatch({ type: 'SET_COLOR', payload: color });
  }

  render() {
    const c = this.props.tool.color;
    const colorString = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
    return (
        <div className="tools-container">
          <DraggablePanel title="Tools" x={10} y={60}>
            <ToolButton icon="pencil" handleClick={this.setPen.bind(this)} active={ this.props.tool.type === 'PEN' } />
            <ToolButton icon="eraser" handleClick={this.setEraser.bind(this)} active={ this.props.tool.type === 'ERASER' } />
            <hr style={{ borderColor: '#666' }} />
            <div style={{ margin: '10px auto', width: '16px', height: '16px', background: colorString, border: '1px solid #222' }}></div>
          </DraggablePanel>
          {this.state.showColorPicker && <DraggablePanel title="Color" x={10} y={200}>
            <ChromePicker onChange={this.handleColorChange.bind(this)} />
          </DraggablePanel>}
        </div>
    );
  }
}

ToolsContainer.propTypes = {
  tool: PropTypes.object
};

function mapStateToProps(store) {
  return {
    tool: store.toolState
  };
}

export default connect(mapStateToProps)(ToolsContainer);
