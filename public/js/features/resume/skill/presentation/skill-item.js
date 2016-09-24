// public/js/features/resume/skill/presentation/skill-item.js

var SkillItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this skill?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    return (
      <span className="tag">
        {this.props.skill}
        <DeleteLink onDelete={this.deleteItem} linkText="X" linkClass="tag-remove" />
      </span>
    );
  }
});
