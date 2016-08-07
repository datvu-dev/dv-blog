var QualificationForm = React.createClass({
  getInitialState: function() {
    return {
      school : '',
      course: '',
      year : '',
      description: ''
    };
  },
  componentDidMount: function() {
    var id = this.props.params.id ? this.props.params.id : null;

    if (id) {
      $.ajax({
        url: '/api/resume/qualification/' + id,
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState(data[0]);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.route.url, status, err.toString());
        }.bind(this)
      });
    }
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
  handleValidation: function(e) {
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
      this.handleSubmit({
        school: school,
        course: course,
        year: year,
        description: description,
      });
    }
  },
  handleSubmit: function(item) {
    var id = this.props.params.id ? this.props.params.id : '';

    $.ajax({
      url: '/api/resume/qualification/' + id,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(items) {
        this.context.router.push('/resume');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div id="qualification-form" className="">
          <p id="form-message">{this.state.formMessage}</p>
          <form encType="multipart/form-data" onSubmit={this.handleValidation}>
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

QualificationForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}
