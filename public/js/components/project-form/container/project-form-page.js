// public/js/features/project/project-form/container/project-form-page.js

import React from 'react';
import ProjectForm from '../presentation/project-form';

const ProjectFormPage = React.createClass({
  handleProjectSubmit(item) {
    let id = this.props.params.id ? this.props.params.id : '';

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: data => {
        if ($('#projectPicture')[0].files[0]) {
          this.handleUpload();
        }

        this.context.router.push('/projects');
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  handleUpload() {
    let formData = new FormData();
    let fileObj = $('#projectPicture')[0].files[0];
    formData.append('uploads[]', fileObj , fileObj.name);

    $.ajax({
      url: '/api/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: data => {

      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    })
  },
  loadTagSuggestions() {
    let skillsUrl = 'http://trendyskills.com/service?q=keywords&key=77MGlB3wzQbD9KfZ';

    $.ajax({
      url: skillsUrl,
      method: 'GET',
      dataType: 'jsonp',
      success: res => {
        let suggestionsArr = [];

        res.keywords.map(item => {
          suggestionsArr.push(item.keyName);
        });

        this.setState({suggestions: suggestionsArr});

      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  },
  loadProject(id) {
    this.serverRequest = $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      cache: false,
      success: data => {
        this.setState(data[0]);

        let projectID = this.props.params.id;
        let picName = data[0]['picture'];

        var imgCtr = $('<img/>').prop('src', `/uploads/projects/${projectID}/${picName}`);
        $('#imgContainer').html(imgCtr);
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  componentDidMount() {
    this.loadTagSuggestions();

    if (this.props.params.id) {
      this.loadProject(this.props.params.id);
    }
  },
  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  },
  handleTitleInput(value) {
    this.setState({title: value});
  },
  handleYearInput(value) {
    this.setState({year: value});
  },
  handleDescriptionInput(value) {
    this.setState({description: value});
  },
  handleTechnologyInput(value) {
    this.setState({technologies: value});
  },
  handlePictureInput(value) {
    this.setState({picture: value});
  },
  getInitialState() {
    return {
      title : '',
      year : '',
      picture: '',
      description: '',
      technologies: [],
      suggestions: []
    };
  },
  render() {
    return (
      <div>
        <ProjectForm
          onProjectSubmit={this.handleProjectSubmit}
          data={this.state}
          onTitleChange={this.handleTitleInput}
          onYearChange={this.handleYearInput}
          onDescriptionChange={this.handleDescriptionInput}
          onTechnologyChange={this.handleTechnologyInput}
          onPictureChange={this.handlePictureInput} />
      </div>
    );
  }
});

ProjectFormPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default ProjectFormPage;
