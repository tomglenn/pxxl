import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import DraggablePanel from './DraggablePanel';
import ToolButton from './ToolButton';
import './ToolsContainer.css';

class ToolsContainer extends Component {
  setEraser() {
    store.dispatch({ type: 'SET_ERASER', payload: { type: 'ERASER', color: [255, 255, 255] } });
  }

  setPen() {
    store.dispatch({ type: 'SET_PEN', payload: { type: 'PEN', color: [0, 255, 0, 1] } });
  }

  render() {
    const c = this.props.tool.color;
    const colorString = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3] * 255})`;
    return (
        <DraggablePanel title="Tools" x={10} y={60}>
          <ToolButton icon="pencil" handleClick={this.setPen.bind(this)} active={ this.props.tool.type === 'PEN' } />
          <ToolButton icon="eraser" handleClick={this.setEraser.bind(this)} active={ this.props.tool.type === 'ERASER' } />
          <hr style={{ borderColor: '#666' }} />
          <div style={{ margin: '10px auto', width: '16px', height: '16px', background: colorString, border: '1px solid #222' }}></div>
        </DraggablePanel>
    )
  }
}

function mapStateToProps(store) {
  return {
    tool: store.toolState
  };
}

export default connect(mapStateToProps)(ToolsContainer);
