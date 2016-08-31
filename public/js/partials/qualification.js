var Qualifications = React.createClass({
  loadQualifications() {
    $.ajax({
      url: '/api/resume/qualification',
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  handleDelete(id) {
    $.ajax({
      url: `/api/resume/qualification/${id}`,
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
    this.loadQualifications();
  },
  componentWillReceiveProps() {
    this.loadQualifications();
  },
  render() {
    return (
      <div>
        <div className="section-header">
          <h2>Qualifications</h2>
          <AddLink path={'/resume/qualification/add'}
            isModal={true} />
        </div>
        <QualificationList data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

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

var QualificationItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this qualification?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    let {id} = this.props;

    return (
      <div>
        <span>{this.props.school}</span>
        <span>{this.props.course}</span>
        <p>
          <EditLink path={`/resume/qualification/edit/${id}`}
            isModal={true} />
          <DeleteLink onDelete={this.deleteItem} />
        </p>
      </div>
    );
  }
});
