var Links = React.createClass({
  render: function() {
    return (
      <span>
        <Link className="utility-link" to={{
          pathname: this.props.path,
          state: {modal: this.props.isModal}
        }}><small>Edit</small></Link>
        <a className="utility-link" onClick={this.props.onDelete}><small>Remove</small></a>
      </span>
    )
  }
});

var UtilityLinks = React.createClass({
  render: function() {
    if (localStorage.getItem('user')) {
      var linkItems = <Links path={this.props.path} onDelete={this.props.onDelete}
        isModal={this.props.isModal} />
    }

    return (
     <p>
        {linkItems}
     </p>
   );
  }
});
