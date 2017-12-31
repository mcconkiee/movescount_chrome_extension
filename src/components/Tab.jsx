import React, { Component } from 'react';

export class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <li
        onClick={this.props.onClick}
        role="presentation"
        className={this.props.active === this ? 'active' : null}
      >
        <a href="#home" aria-controls="settings" role="tab" data-toggle="tab">
          {this.props.title}
        </a>
      </li>
    );
  }
}

export default Tab;
