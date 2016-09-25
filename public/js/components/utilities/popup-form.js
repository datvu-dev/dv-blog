// public/js/components/popup-form.js

import React from 'react';

const PopupForm = React.createClass({
  render() {
    return (
      <div>
        <div className="popup-header">
          <h4 className="popup-title">Add New</h4>
        </div>
        <div className="popup-body">{this.props.children}</div>
      </div>
    )
  }
});

export default PopupForm;
