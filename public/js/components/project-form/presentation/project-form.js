// public/js/features/project/project-form/presentation/project-form.js

import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import YearSelect from '../../utilities/year-select';
import FormButtons from '../../utilities/form-buttons';

const ProjectForm = React.createClass({
  getInitialState() {
    return {formMessage: ''};
  },
  componentDidMount() {
    $('.tag-input input').addClass('form-control').attr('id', 'projectTechnologies').blur();
  },
  handleTitleChange(e) {
    this.props.onTitleChange(e.target.value);
  },
  handleYearChange(value) {
    this.props.onYearChange(value);
  },
  handleDescriptionChange(e) {
    this.props.onDescriptionChange(e.target.value);
  },
  handleTechnologyChange(tags) {
    this.props.onTechnologyChange(tags);
  },
  handleDelete(i) {
      let tags = this.props.data.technologies;
      tags.splice(i, 1);
      this.handleTechnologyChange(tags);
  },
  handleAddition(tag) {
      let tags = this.props.data.technologies;
      tags.push({
          _id: tags.length + 1,
          text: tag
      });
      this.handleTechnologyChange(tags);
  },
  handlePictureChange(e) {
    // console.log(e.target);
    localStorage.removeItem("imgData")
    let reader = new FileReader();
    reader.onload = function () {
        let thisImage = reader.result;
        localStorage.setItem("imgData", thisImage);
    };
    reader.readAsDataURL(e.target.files[0]);

    setTimeout(() => {
      var dataImage = localStorage.getItem('imgData');
      var imgCtr = $('<img/>').prop('src', dataImage);
      $('#imgContainer').html(imgCtr);
    }, 500);

    this.props.onPictureChange(e.target.files[0].name);
  },
  handleSubmit(e) {
    e.preventDefault();
    let {title, year, description, technologies, picture} = this.props.data;
    let pictureObj = $('#imgContainer img');

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!title.trim() || !year || !description.trim() || technologies.length == 0
      || pictureObj.length == 0) {
      $('#form-message').show();
    }

    if (!title.trim()) {
      $('#projectTitle').addClass('required').focus();
      this.setState({formMessage: 'Please put in title.'});
    } else if (!year) {
      $('#projectYear').addClass('required').focus();
      this.setState({formMessage: 'Please put in year.'});
    } else if (!description.trim()) {
      $('#projectDescription').addClass('required').focus();
      this.setState({formMessage: 'Please put in description.'});
    } else if (technologies.length == 0) {
      $('#projectTechnologies').addClass('required').focus();
      this.setState({formMessage: 'Please put in at least one technology.'});
    } else if (pictureObj.length == 0) {
      this.setState({formMessage: 'Please upload a screenshot.'});
    } else {
      this.props.onProjectSubmit({title, year, picture, description, technologies});
    }

  },
  render() {
    return (
      <div id="project-form" className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <p id="form-message">{this.state.formMessage}</p>
            <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
              <fieldset className="form-group">
                <label htmlFor="projectTitle">Title</label>
                <input type="text" className="form-control" id="projectTitle"
                  value={this.props.data.title} onChange={this.handleTitleChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectYear">Year of completion</label>
                <YearSelect value={this.props.data.year} idName="projectYear"
                  onSelectChange={this.handleYearChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <textarea className="form-control" id="projectDescription" rows="4"
                  value={this.props.data.description}
                  onChange={this.handleDescriptionChange}></textarea>
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectTechnologies">Technologies</label>
                <ReactTags tags={this.props.data.technologies}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}                  
                    classNames={{
                      tags: 'tags-container',
                      tagInput: 'tag-input',
                      tag: 'tag',
                      remove: 'tag-remove',
                    }}
                  />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectPicture">Screenshot</label>
                <input type="file" className="form-control-file" id="projectPicture"
                  onChange={this.handlePictureChange} />
                <div id="imgContainer"></div>
              </fieldset>
              <FormButtons />
            </form>
          </div>
      </div>
    )
  }
});

export default ProjectForm;
