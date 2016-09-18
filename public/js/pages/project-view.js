// public/js/pages/project-view.js

var Project = React.createClass({
  deleteProject() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.data._id);
    });
  },
  render() {
    let {_id, title, picture, description, technologies} = this.props.data;
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
        <EditLink path={`/project/${_id}/edit`} isModal={false} />
        <DeleteLink onDelete={this.deleteProject} />
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});

var ProjectViewPage = React.createClass({
  loadProject() {
    let {id} = this.props.params;

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      cache: false,
      success: data => {    
        this.setState({data: data[0]});
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
        this.context.router.push('/projects');
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: {}};
  },
  componentWillMount() {
    this.loadProject();
  },
  render() {
    return (
      <div>
        <Project data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}
