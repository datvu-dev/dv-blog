var Qualifications = React.createClass({
  loadQualificationList: function() {
    $.ajax({
      url: '/api/resume/qualification',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadQualificationList();
  },
  componentWillReceiveProps: function() {
    this.loadQualificationList();
  },
  render: function() {
    return (
      <div>
        <div className="section-header">
          <h2>Qualifications</h2>
          <Link to={{
            pathname: '/resume/qualification/add',
            state: {modal: true, returnTo: '/resume'}
          }}>Add</Link>
        </div>
        <QualificationList data={this.state.data} />
      </div>
    );
  }
});

var QualificationList = React.createClass({
  render: function() {
    var qualificationItems = this.props.data.map(function(item) {
      return (
        <QualificationItem school={item.school} course={item.course} id={item._id} key={item._id} />
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
  render: function() {
    return (
      <p>
        <span>{this.props.school}</span>
        <span>{this.props.course}</span>
      </p>
    );
  }
});
