var DeleteLink = React.createClass({
  render: function() {
    if (localStorage.getItem('user')) {
      var linkItem = <a className="utility-link"
        onClick={this.props.onDelete}><small>Remove</small></a>
    }

    return (
     <span>
        {linkItem}
     </span>
   );
  }
});
