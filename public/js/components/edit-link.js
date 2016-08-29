var EditLink = React.createClass({
  render: function() {
    if (localStorage.getItem('user')) {
      var linkItem = <Link className="utility-link" to={{
        pathname: this.props.path,
        state: {modal: this.props.isModal}
      }}><small>Edit</small></Link>
    }

    return (
     <span>
        {linkItem} 
     </span>
   );
  }
});
