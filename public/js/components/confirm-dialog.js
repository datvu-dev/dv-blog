// public/js/components/confirm-dialog.js

var Promise = $.Deferred;

var Confirm = React.createClass({
  displayName: 'Confirm',
  getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    }
  },
  abort() {
    return this.promise.reject();
  },
  confirm() {
    return this.promise.resolve();
  },
  componentDidMount() {
    this.promise = new Promise();
  },
  render() {
    return React.createElement(Modal, null,
      <div>
        <div className="modal-header">
          <h4 className="modal-title">{this.props.message}</h4>
        </div>
        <div className="modal-body">
          {this.props.description ? this.props.description : ''}
        </div>
        <div className="modal-footer">
          <div className="text-right">
            <button role="abort" type="button" className="btn btn-default"
              onClick={this.abort}>{this.props.abortLabel}</button>
            <button role="confirm" type="button" className="btn btn-main"
              ref="confirm" onClick={this.confirm}>{this.props.confirmLabel}</button>
          </div>
        </div>
      </div>
    )
  }
});

var confirmAction = (message, options = {}) => {
  let props = $.extend({message: message}, options);
  let wrapper = document.body.appendChild(document.createElement('div'));
  let component = ReactDOM.render(React.createElement(Confirm, props), wrapper);

  var cleanup = () => {
    ReactDOM.unmountComponentAtNode(wrapper);
    setTimeout(function() {
      wrapper.remove();
    });
  }

  return component.promise.always(cleanup).promise();
}
