// public/js/partials/skill.js

var SkillItem = React.createClass({
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this skill?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    return (
      <span className="tag">
        {this.props.skill}
        <DeleteLink onDelete={this.deleteItem} linkText="X" linkClass="tag-remove" />
      </span>
    );
  }
});

var SkillList = React.createClass({
  render() {
    let skillItems = this.props.data.map(item => {
      return (
        <SkillItem skill={item.skill} id={item._id} key={item._id}
          onDelete={this.props.onDelete} />
      );
    });

    return (
      <div>
        {skillItems}
      </div>
    );
  }
});

var Skills = React.createClass({
  loadSkills() {
    $.ajax({
      url: '/api/resume/skill',
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
      url: `/api/resume/skill/${id}`,
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
    this.loadSkills();
  },
  componentWillReceiveProps() {
    this.loadSkills();
  },
  render() {
    let skillForm;

    if (localStorage.getItem('user')) {
      skillForm = <SkillForm />;
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
