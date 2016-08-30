var DeleteLink = React.createClass({
  render: function() {
    var text = this.props.linkText ? this.props.linkText : 'Remove';
    var className = this.props.linkClass ? this.props.linkClass : 'utility-link';

    if (localStorage.getItem('user')) {
      var linkItem = <a className={className}
        onClick={this.props.onDelete}><small>{text}</small></a>
    }

    return (
     <span>
        {linkItem}
     </span>
   );
  }
});
