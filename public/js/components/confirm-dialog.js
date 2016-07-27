var Modal = React.createClass({
  displayName: 'Modal',
  render: function() {
    return (
      <div>
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

var Promise = $.Deferred;

var Confirm = React.createClass({
  displayName: 'Confirm',
  getDefaultProps: function() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    }
  },
  abort: function() {
    return this.promise.reject();
  },
  confirm: function() {
    return this.promise.resolve();
  },
  componentDidMount: function() {
    this.promise = new Promise();
  },
  render: function() {
    return React.createElement(Modal, null,
      <div>
        <div className="modal-header">
          <h4 className="modal-title">{this.props.message}</h4>
        </div>
        <div className="modal-body">{this.props.description ? this.props.description : ''}</div>
        <div className="modal-footer">
          <div className="text-right">
            <button role="abort" type="button" className="btn btn-default" onClick={this.abort}>{this.props.abortLabel}</button>
            <button role="confirm" type="button" className="btn btn-primary" ref="confirm" onClick={this.confirm}>{this.props.confirmLabel}</button>
          </div>
        </div>
      </div>
    )
  }
});

var confirmAction = function(message, options) {
  if (options == null) {
    options = {};
  }

  var props = $.extend({message: message}, options);
  var wrapper = document.body.appendChild(document.createElement('div'));
  var component = ReactDOM.render(React.createElement(Confirm, props), wrapper);

  var cleanup = function() {
    ReactDOM.unmountComponentAtNode(wrapper);
    setTimeout(function() {
      wrapper.remove();
    });
  }

  return component.promise.always(cleanup).promise();
}
