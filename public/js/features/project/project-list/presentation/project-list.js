// public/js/features/project/project-list/presentation/project-list.js

var ProjectList = React.createClass({
  render() {
    let projectItems = this.props.data.map(item => {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id}
          key={item._id} onDelete={this.props.onDelete} />
      );
    });

    return (
      <div id="projects-list">
        <div className="row">
          {projectItems}
        </div>
      </div>
    )
  }
});
