import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ToolButton extends Component {
  render() {
    const buttonClassName = `tool-button${this.props.active ? ' active' : ''}`;
    const iconClassName = `fa fa-${this.props.icon}`;
    return (
      <button className={buttonClassName} onClick={this.props.handleClick} title={this.props.title}><i className={iconClassName}></i></button>
    );
  }
}

ToolButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  handleClick: PropTypes.func,
  active: PropTypes.bool
};

export default ToolButton;
