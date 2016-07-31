// public/js/components/modal.js

var Modal = React.createClass({
  displayName: 'Modal',
  render: function() {
    return (
      <div id="modal">
        <div className="modal-backdrop in"></div>
        <div className="modal in" tabIndex="-1" role="dialog" aria-hidden="false" ref="modal" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
});
