import React, { Component } from 'react';
import './DraggablePanel.css';

class DraggablePanel extends Component {
  constructor(props) {
    super(props);
    this.state ={
      x: this.props.x,
      y: this.props.y,
      dragging: false,
      previousMouseX: 0,
      previousMouseY: 0
    };
  }

  onMouseDown(event) {
    this.setState({
      dragging: true,
      previousMouseX: event.pageX,
      previousMouseY: event.pageY
    });
  }

  onMouseMove(event) {
    if (!this.state.dragging) {
      return;
    }

    this.setState({
      x: this.state.x + (event.pageX - this.state.previousMouseX),
      y: this.state.y + (event.pageY - this.state.previousMouseY),
      previousMouseX: event.pageX,
      previousMouseY: event.pageY
    });
  }

  onMouseOut(event) {
    console.log('out');
    if (!this.state.dragging) {
      return;
    }

    this.setState({
      x: this.state.x + (event.pageX - this.state.previousMouseX),
      y: this.state.y + (event.pageY - this.state.previousMouseY),
      previousMouseX: event.pageX,
      previousMouseY: event.pageY
    });
  }

  onMouseUp(event) {
    console.log('foo');
    this.setState({ dragging: false });
  }

  render() {
    const style = {
      top: this.state.y,
      left: this.state.x,
      width: this.props.width ? this.props.width : 'auto',
      height: this.props.height ? this.props.height : 'auto'
    };

    return (
        <div className="panel" style={style}>
          <div className="panel-header" onMouseDown={this.onMouseDown.bind(this)} onMouseMove={this.onMouseMove.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
            {this.props.title}
          </div>
          {this.props.children}
        </div>
    )
  }
}

export default DraggablePanel
