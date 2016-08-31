// public/js/pages/projects-list.js

var ProjectsPage = React.createClass({
  loadProjectsList() {
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: data => {
        // console.log(data);
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  handleProjectDelete(id) {
    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: data => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: []};
  },
  componentDidMount() {
    this.loadProjectsList();
  },
  render() {
    return (
      <div>
        <Link to="/project/new" className="btn btn-primary">New Project</Link>
        <ProjectsList data={this.state.data} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var ProjectsList = React.createClass({
  render() {
    let _this =  this;

    let projectItems = this.props.data.map(item => {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id}
          key={item._id} onProjectDelete={_this.props.onProjectDelete} />
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
  deleteProject() {
    let _this = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      _this.props.onProjectDelete(_this.props.id);
    });
  },
  render() {
    let id = this.props.id;
    let image = this.props.img;

    return (
      <div className="box col-md-6 col-lg-4">
        <div className="box-img">
          <img src={`/uploads/projects/${id}/${image}`}
            alt="Card image cap" />
        </div>
        <div className="box-content">
          <h4 className="box-title"><Link to={`/project/${id}`}>
            {this.props.title}</Link>
          </h4>
          <p className="box-text">This is a longer card with supporting text
            below as a natural lead-in to additional content. This content is a
            little bit longer.</p>
          <EditLink path={`/project/${id}/edit`}
            isModal={false} />
          <DeleteLink onDelete={this.deleteProject} />
        </div>
      </div>
    )
  }
});
