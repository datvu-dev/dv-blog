var AddLink = React.createClass({
  render: function() {
    if (localStorage.getItem('user')) {
      var linkItem = <Link to={{
          pathname: this.props.path,
          state: {modal: this.props.isModal}
        }}>Add</Link>
    }

    return (
     <span>
        {linkItem} 
     </span>
   );
  }
});
