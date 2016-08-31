// public/js/pages/project-view.js

var ProjectViewPage = React.createClass({
  loadProject() {
    let projectID = this.props.params.project_id;

    $.ajax({
      url: this.props.route.url + projectID,
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
        this.context.router.push('/projects');
      },
      error: (xhr, status, err) => {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: '[]'};
  },
  componentDidMount() {
    this.loadProject();
  },
  render() {
    return (
      <div>
        <Project data={this.state.data} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var Project = React.createClass({
  deleteProject() {
    let propsObj = this.props;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      propsObj.onProjectDelete(propsObj.data[0]._id);
    });
  },
  render() {
    let id = this.props.data[0]._id;
    let title = this.props.data[0].title;
    let picSrc = '/uploads/projects/' + id + '/' + this.props.data[0].picture;
    let description = this.props.data[0].description;
    let tags = this.props.data[0].technologies;
    let tagItems;

    if (tags) {
      let count = 0;
      tagItems = tags.map(item => {
        return (
          <span key={item._id} className="tag">{item.text}</span>
        );
      });
    }

    return (
      <div>
        <h1>{title}</h1>    
        <EditLink path={'/project/' + this.props.data[0]._id + '/edit'}
          isModal={false} />
        <DeleteLink onDelete={this.deleteProject} />
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});
