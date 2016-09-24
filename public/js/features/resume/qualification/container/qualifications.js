// public/js/features/resume/qualification/container/qualifications.js

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
