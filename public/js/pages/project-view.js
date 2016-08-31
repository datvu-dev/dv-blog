// public/js/pages/project-view.js

var ProjectViewPage = React.createClass({
  loadProject() {
    let {id} = this.props.params;

    $.ajax({
      url: this.props.route.url + id,
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
    let _this = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      _this.props.onProjectDelete(_this.props.data[0]._id);
    });
  },
  render() {
    let {_id, title, picture, description, technologies} = this.props.data[0];
    let picSrc = `/uploads/projects/${_id}/${picture}`;
    let tagItems;

    if (technologies) {
      let count = 0;
      tagItems = technologies.map(item => {
        return (
          <span key={item._id} className="tag">{item.text}</span>
        );
      });
    }

    return (
      <div>
        <h1>{title}</h1>
        <EditLink path={`/project/${_id}/edit`}
          isModal={false} />
        <DeleteLink onDelete={this.deleteProject} />
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});
