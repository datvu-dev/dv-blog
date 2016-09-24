// public/js/features/resume/qualification/presentation/qualification-item.js

var QualificationItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this qualification?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    let {id} = this.props;

    return (
      <div>
        <span>{this.props.school}</span>
        <span>{this.props.course}</span>
        <p>
          <EditLink path={`/resume/qualification/edit/${id}`}
            isModal={true} />
          <DeleteLink onDelete={this.deleteItem} />
        </p>
      </div>
    );
  }
});
