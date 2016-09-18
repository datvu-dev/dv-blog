// public/js/pages/projects-list.js

var ProjectItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    let {id, img} = this.props;

    return (
      <div className="box col-md-6 col-lg-4">
        <div className="box-img">
          <img src={`/uploads/projects/${id}/${img}`} alt="Card image cap" />
        </div>
        <div className="box-content">
          <h4 className="box-title">
            <Link to={`/project/${id}`}>{this.props.title}</Link>
          </h4>
          <p className="box-text">This is a longer card with supporting text
            below as a natural lead-in to additional content. This content is a
            little bit longer.</p>
          <EditLink path={`/project/${id}/edit`} isModal={false} />
          <DeleteLink onDelete={this.deleteItem} />
        </div>
      </div>
    )
  }
});

var ProjectsList = React.createClass({
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

var ProjectsPage = React.createClass({
  loadProjects() {
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
  handleDelete(id) {
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
    this.loadProjects();
  },
  render() {
    return (
      <div>
        <AddLink path={'/project/new'} isModal={false} />
        <ProjectsList data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

ProjectsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}
