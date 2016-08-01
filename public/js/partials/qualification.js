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
  handleSubmit: function(item) {
    $.ajax({
      url: '/api/resume/qualification',
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(items) {
        this.setState({data: items});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  showAddForm: function() {
    var wrapper = document.body.appendChild(document.createElement('div'));
    var props = {
      onSubmit: this.handleSubmit,
      data: this.state.data
    }
    var component = ReactDOM.render(React.createElement(QualificationForm, props), wrapper);

    return component;
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadQualificationList();
  },
  render: function() {
    return (
      <div>
        <div className="section-header">
          <h2>Qualifications</h2>
          <a onClick={this.showAddForm}>Add</a>
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
