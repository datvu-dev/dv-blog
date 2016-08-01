var QualificationForm = React.createClass({
  getInitialState: function() {
    return {
      school : '',
      course: '',
      year : '',
      description: ''
    };
  },
  handleSchoolChange: function(e) {
    this.setState({school: e.target.value});
  },
  handleCourseChange: function(e) {
    this.setState({course: e.target.value});
  },
  handleYearChange: function(value) {
    this.setState({year: value});
  },
  handleDescriptionChange: function(e) {
    this.setState({description: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var school = this.state.school.trim();
    var course = this.state.course.trim();
    var year = this.state.year;
    var description = this.state.description.trim();

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!school || !course || !year || !description) {
      $('#form-message').show();
    }

    if (!school) {
      $('#qualSchool').addClass('required');
      this.setState({formMessage: 'Please provide school.'});
    } else if (!course) {
      $('#qualCourse').addClass('required');
      this.setState({formMessage: 'Please provide course.'});
    } else if (!year) {
      $('#qualYear').addClass('required');
      this.setState({formMessage: 'Please provide year.'});
    } else if (!description) {
      $('#qualDescription').addClass('required');
      this.setState({formMessage: 'Please provide description.'});
    } else {
      this.props.onSubmit({
        school: school,
        course: course,
        year: year,
        description: description,
      });
    }
  },
  render: function() {
    return React.createElement(PopupForm, null,
      <div id="qualification-form" className="">
          <p id="form-message">{this.state.formMessage}</p>
          <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
            <fieldset className="form-group">
              <label htmlFor="qualSchool">School</label>
              <input type="text" className="form-control" id="qualSchool" value={this.state.school} onChange={this.handleSchoolChange} />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="qualCourse">Course</label>
              <input type="text" className="form-control" id="qualCourse" value={this.state.course} onChange={this.handleCourseChange} />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="qualYear">Year of completion</label>
              <YearsSelect value={this.state.year} onSelectChange={this.handleYearChange} />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="qualDescription">Description</label>
              <textarea className="form-control" id="qualDescription" rows="4" value={this.state.description} onChange={this.handleDescriptionChange} ></textarea>
            </fieldset>
            <PopupButtons />
          </form>
      </div>
    );
  }
});
