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
  getInitialState() {
    return {data: {
      title : '',
      year : '',
      picture: '',
      description: '',
      technologies: [],
      suggestions: []
    }};
  },
  render() {
    return (
      <div>
        <ProjectForm onProjectSubmit={this.handleProjectSubmit}
          data={this.state.data} projectID={this.props.params.id} />
      </div>
    );
  }
});

ProjectFormPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default ProjectFormPage;
