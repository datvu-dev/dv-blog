// public/js/components/popup-form.js

var PopupForm = React.createClass({
  render: function() {
    return React.createElement(Modal, null,
      <div>
        <div className="modal-header">
          <h4 className="modal-title">Add New Thing</h4>
        </div>
        <div className="modal-body">{this.props.children}</div>
      </div>
    )
  }
});

var PopupButtons = React.createClass({
  cancel: function() {
    var component = ReactDOM.findDOMNode(document.getElementById('modal').parentNode);

    ReactDOM.unmountComponentAtNode(component);
  },
  render: function() {
    return (
      <div className="text-right">
        <button type="button" className="btn btn-default" onClick={this.cancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    )
  }
});
