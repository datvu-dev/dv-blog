// public/js/features/resume/skill/container/skills.js

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
