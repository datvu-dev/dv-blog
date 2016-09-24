// public/js/partials/qualification-form.js

import React from 'react';
import PopupForm from '../../utilities/popup-form';
import FormButtons from '../../utilities/form-buttons';
import YearSelect from '../../utilities/year-select';

const QualificationForm = React.createClass({
  getInitialState() {
    return {
      school : '',
      course: '',
      year : '',
      description: ''
    };
  },
  componentDidMount() {
    let {id} = this.props.params ? this.props.params : null;

    if (id) {
      $.ajax({
        url: `/api/resume/qualification/${id}`,
        dataType: 'json',
        cache: false,
        success: data => {
          this.setState(data[0]);
        },
        error: (xhr, status, err) => {
          console.error(this.props.route.url, status, err.toString());
        }
      });
    }
  },
  handleSchoolChange(e) {
    this.setState({school: e.target.value});
  },
  handleCourseChange(e) {
    this.setState({course: e.target.value});
  },
  handleYearChange(value) {
    this.setState({year: value});
  },
  handleDescriptionChange(e) {
    this.setState({description: e.target.value});
  },
  handleValidation(e) {
    e.preventDefault();
    let {school, course, year, description} = this.state;

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!school.trim() || !course.trim() || !year || !description.trim()) {
      $('#qualification-form #form-message').show();
    }

    if (!school.trim()) {
      $('#qualSchool').addClass('required').focus();
      this.setState({formMessage: 'Please provide school.'});
    } else if (!course.trim()) {
      $('#qualCourse').addClass('required').focus();
      this.setState({formMessage: 'Please provide course.'});
    } else if (!year) {
      $('#qualYear').addClass('required').focus();
      this.setState({formMessage: 'Please provide year.'});
    } else if (!description.trim()) {
      $('#qualDescription').addClass('required').focus();
      this.setState({formMessage: 'Please provide description.'});
    } else {
      this.handleSubmit({school, course, year, description});
    }
  },
  handleSubmit(item) {
    let id = this.props.params.id ? this.props.params.id : '';

    $.ajax({
      url: `/api/resume/qualification/${id}`,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: items => {
        this.context.router.push('/resume');
      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  },
  render() {
    return (
      <PopupForm>
        <div id="qualification-form" className="">
            <p id="form-message">{this.state.formMessage}</p>
            <form encType="multipart/form-data" onSubmit={this.handleValidation}>
              <fieldset className="form-group">
                <label htmlFor="qualSchool">School</label>
                <input type="text" className="form-control" id="qualSchool"
                  value={this.state.school} onChange={this.handleSchoolChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="qualCourse">Course</label>
                <input type="text" className="form-control" id="qualCourse"
                  value={this.state.course} onChange={this.handleCourseChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="qualYear">Year of completion</label>
                <YearSelect value={this.state.year}
                  onSelectChange={this.handleYearChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="qualDescription">Description</label>
                <textarea className="form-control" id="qualDescription" rows="4"
                  value={this.state.description}
                  onChange={this.handleDescriptionChange} ></textarea>
              </fieldset>
              <FormButtons />
            </form>
        </div>
      </PopupForm>
    );
  }
});

QualificationForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default QualificationForm;
