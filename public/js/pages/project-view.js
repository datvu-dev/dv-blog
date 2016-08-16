// public/js/pages/project-view.js

var ProjectViewPage = React.createClass({
  loadProject: function() {
    var projectID = this.props.params.project_id;

    $.ajax({
      url: this.props.route.url + projectID,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  goToProjectEdit: function(id) {
    this.context.router.push('/project/' + id + '/edit');
  },
  handleProjectDelete: function(id) {
    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        this.context.router.push('/projects');
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: '[]'};
  },
  componentDidMount: function() {
    this.loadProject();
  },
  render: function() {
    return (
      <div>
        <Project data={this.state.data} onProjectEdit={this.goToProjectEdit} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var Project = React.createClass({
  editProject: function() {
    this.props.onProjectEdit(this.props.data[0]._id);
  },
  deleteProject: function() {
    var propsObj = this.props;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function() {
      propsObj.onProjectDelete(propsObj.data[0]._id);
    });
  },
  render: function() {
    var id = this.props.data[0]._id;
    var title = this.props.data[0].title;
    var picSrc = '/uploads/projects/' + id + '/' + this.props.data[0].picture;
    var description = this.props.data[0].description;
    var tags = this.props.data[0].technologies;

    if (tags) {
      var count = 0;
      var tagItems = tags.map(function(item) {
        return (
          <span key={item._id} className="tag">{item.text}</span>
        );
      });
    }

    return (
      <div>
        <h1>{title}</h1>
        <UtilityLinks onEdit={this.editProject} onDelete={this.deleteProject} />
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});
