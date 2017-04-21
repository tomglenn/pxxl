import React, { Component } from 'react';

class ToolButton extends Component {
  render() {
    const buttonClassName = `tool-button${this.props.active ? ' active' : ''}`;
    const iconClassName = `fa fa-${this.props.icon}`;
    return (
      <button className={buttonClassName} onClick={this.props.handleClick}><i className={iconClassName}></i></button>
    );
  }
}

export default ToolButton
