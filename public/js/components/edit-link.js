var EditLink = React.createClass({
  render() {
    let linkItem;

    if (localStorage.getItem('user')) {
      linkItem = <Link className="utility-link" to={{
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
