// public/js/features/resume/qualification/presentation/qualification-list.js

var QualificationList = React.createClass({
  render() {
    let qualificationItems = this.props.data.map(item => {
      return (
        <QualificationItem school={item.school} course={item.course}
        id={item._id} key={item._id} onDelete={this.props.onDelete} />
      );
    });

    return (
      <div>
        {qualificationItems}
      </div>
    );
  }
});
