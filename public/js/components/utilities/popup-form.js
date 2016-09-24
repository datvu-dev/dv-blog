// public/js/components/popup-form.js

import React from 'react';

const PopupForm = React.createClass({
  render() {
    return (
      <div>
        <div className="modal-header">
          <h4 className="modal-title">Add New Thing</h4>
        </div>
        <div className="modal-body">{this.props.children}</div>
      </div>
    )
  }
});

export default PopupForm;
