// public/js/pages/projects-list.js

var ProjectsPage = React.createClass({
  loadProjectsList: function() {
    $.ajax({
      url: this.props.route.url,
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
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadProjectsList();
  },
  render: function() {
    return (
      <div>
        <Link to="/project/new" className="btn btn-primary">New Project</Link>
        <ProjectsList data={this.state.data} onProjectEdit={this.goToProjectEdit} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var ProjectsList = React.createClass({
  render: function() {
    var _this =  this;

    var projectItems = this.props.data.map(function(item) {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id} key={item._id} onProjectEdit={_this.props.onProjectEdit} onProjectDelete={_this.props.onProjectDelete} />
      );
    });

    return (
      <div id="projects-list" className="container">
        <div className="row">
          {projectItems}
        </div>
      </div>
    )
  }
});

var ProjectItem = React.createClass({
  editProject: function() {
    this.props.onProjectEdit(this.props.id);
  },
  deleteProject: function() {
    var propsObj = this.props;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function() {
      propsObj.onProjectDelete(propsObj.id);
    });
  },
  render: function() {
    return (
      <div className="box col-md-6 col-lg-4">
        <div className="box-img">
          <img src={'/uploads/projects/' + this.props.id + '/' + this.props.img} alt="Card image cap" />
        </div>
        <div className="box-content">
          <h4 className="box-title"><Link to={'/project/' + this.props.id}>{this.props.title}</Link></h4>
          <p className="box-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          <UtilityLinks onEdit={this.editProject} onDelete={this.deleteProject} />
        </div>
      </div>
    )
  }
});
