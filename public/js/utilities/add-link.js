var AddLink = React.createClass({
  render() {
    let linkItem;

    if (localStorage.getItem('user')) {
      linkItem = <Link to={{
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
