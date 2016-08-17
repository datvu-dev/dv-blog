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
  handleQualificationDelete: function(id) {
    $.ajax({
      url: '/api/resume/qualification/' + id,
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
        <QualificationList data={this.state.data}
        onQualificationDelete={this.handleQualificationDelete} />
      </div>
    );
  }
});

var QualificationList = React.createClass({
  render: function() {
    var _this = this;

    var qualificationItems = this.props.data.map(function(item) {
      return (
        <QualificationItem school={item.school} course={item.course}
        id={item._id} key={item._id} onItemDelete={_this.props.onQualificationDelete} />
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
  deleteItem: function() {
    var _this = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this qualification?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function() {
      _this.props.onItemDelete(_this.props.id);
    });
  },
  render: function() {
    return (
      <div>
        <span>{this.props.school}</span>
        <span>{this.props.course}</span>
        <UtilityLinks path={'/resume/qualification/edit/' + this.props.id}
          isModal={true} onDelete={this.deleteItem} />
      </div>
    );
  }
});
