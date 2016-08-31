var DeleteLink = React.createClass({
  render() {
    let linkItem;
    let text = this.props.linkText ? this.props.linkText : 'Remove';
    let className = this.props.linkClass ? this.props.linkClass : 'utility-link';

    if (localStorage.getItem('user')) {
      linkItem = <a className={className}
        onClick={this.props.onDelete}><small>{text}</small></a>
    }

    return (
     <span>
        {linkItem}
     </span>
   );
  }
});
