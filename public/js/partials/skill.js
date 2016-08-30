var Skills = React.createClass({
  loadSkills: function() {
    $.ajax({
      url: '/api/resume/skill',
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
  handleDelete: function(id) {
    $.ajax({
      url: '/api/resume/skill/' + id,
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
    this.loadSkills();
  },
  componentWillReceiveProps: function() {
    this.loadSkills();
  },
  render: function() {
    if (localStorage.getItem('user')) {
      var skillForm = <SkillForm />;
    }

    return (
      <div>
        <div className="section-header">
          <h2>Skills</h2>
        </div>
        {skillForm}
        <SkillList data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

var SkillList = React.createClass({
  render: function() {
    var _this = this;

    var skillItems = this.props.data.map(function(item) {
      return (
        <SkillItem skill={item.skill} id={item._id} key={item._id}
          onDelete={_this.props.onDelete} />
      );
    });

    return (
      <div>
        {skillItems}
      </div>
    );
  }
});

var SkillItem = React.createClass({
  deleteItem: function() {
    var _this = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this skill?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function() {
      _this.props.onDelete(_this.props.id);
    });
  },
  render: function() {
    return (
      <span className="tag">
        {this.props.skill}
        <DeleteLink onDelete={this.deleteItem} linkText="X" linkClass="tag-remove" />
      </span>
    );
  }
});
