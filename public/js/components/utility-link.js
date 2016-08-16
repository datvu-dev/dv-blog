var Links = React.createClass({
  render: function() {
    return (
      <span>
        <a className="utility-link" onClick={this.props.onEdit}><small>Edit</small></a>
        <a className="utility-link" onClick={this.props.onDelete}><small>Remove</small></a>
      </span>
    )    
  }
});

var UtilityLinks = React.createClass({
  render: function() {
    if (localStorage.getItem('user')) {
      var linkItems = <Links onEdit={this.props.onEdit} onDelete={this.props.onDelete} />
    }

    return (
     <p>
        {linkItems}
     </p>
   );
  }
});
