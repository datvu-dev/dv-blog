// public/js/features/resume/skill/presentation/skill-list.js

var SkillList = React.createClass({
  render() {
    let skillItems = this.props.data.map(item => {
      return (
        <SkillItem skill={item.skill} id={item._id} key={item._id}
          onDelete={this.props.onDelete} />
      );
    });

    return (
      <div>
        {skillItems}
      </div>
    );
  }
});
