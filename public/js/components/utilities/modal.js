// public/js/components/modal.js

import React from 'react';

const Modal = React.createClass({
  displayName: 'Modal',
  render() {
    return (
      <div id="popup">
        <div className="popup-backdrop in"></div>
        <div className="popup in" tabIndex="-1" role="dialog" aria-hidden="false" ref="popup" style={{display: 'block'}}>
          <div className="popup-dialog">
            <div className="popup-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default Modal;
