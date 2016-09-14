// public/js/import.js

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, IndexLink, Link, browserHistory} from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';
var AddLink = React.createClass({
  render() {
    let linkItem;

    if (localStorage.getItem('user')) {
      linkItem = <Link to={{
          pathname: this.props.path,
          state: {modal: this.props.isModal}
        }}>Add</Link>
    }

    return (
     <span>
        {linkItem}
     </span>
   );
  }
});
// public/js/components/confirm-dialog.js

var Promise = $.Deferred;

var Confirm = React.createClass({
  displayName: 'Confirm',
  getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    }
  },
  abort() {
    return this.promise.reject();
  },
  confirm() {
    return this.promise.resolve();
  },
  componentDidMount() {
    this.promise = new Promise();
  },
  render() {
    return React.createElement(Modal, null,
      <div>
        <div className="modal-header">
          <h4 className="modal-title">{this.props.message}</h4>
        </div>
        <div className="modal-body">
          {this.props.description ? this.props.description : ''}
        </div>
        <div className="modal-footer">
          <div className="text-right">
            <button role="abort" type="button" className="btn btn-default"
              onClick={this.abort}>{this.props.abortLabel}</button>
            <button role="confirm" type="button" className="btn btn-main"
              ref="confirm" onClick={this.confirm}>{this.props.confirmLabel}</button>
          </div>
        </div>
      </div>
    )
  }
});

var confirmAction = (message, options = {}) => {
  let props = $.extend({message: message}, options);
  let wrapper = document.body.appendChild(document.createElement('div'));
  let component = ReactDOM.render(React.createElement(Confirm, props), wrapper);

  var cleanup = () => {
    ReactDOM.unmountComponentAtNode(wrapper);
    setTimeout(function() {
      wrapper.remove();
    });
  }

  return component.promise.always(cleanup).promise();
}
var DeleteLink = React.createClass({
  render() {
    let linkItem;
    let text = this.props.linkText ? this.props.linkText : 'Remove';
    let className = this.props.linkClass ? this.props.linkClass : 'utility-link';

    if (localStorage.getItem('user')) {
      linkItem = <a className={className}
        onClick={this.props.onDelete}><small>{text}</small></a>
    }

    return (
     <span>
        {linkItem}
     </span>
   );
  }
});
var EditLink = React.createClass({
  render() {
    let linkItem;

    if (localStorage.getItem('user')) {
      linkItem = <Link className="utility-link" to={{
        pathname: this.props.path,
        state: {modal: this.props.isModal}
      }}><small>Edit</small></Link>
    }

    return (
     <span>
        {linkItem}
     </span>
   );
  }
});
// public/js/components/modal.js

var Modal = React.createClass({
  displayName: 'Modal',
  render() {
    return (
      <div id="modal">
        <div className="modal-backdrop in"></div>
        <div className="modal in" tabIndex="-1" role="dialog" aria-hidden="false" ref="modal" style={{display: 'block'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
});
// public/js/components/popup-form.js

var PopupForm = React.createClass({
  render() {
    return React.createElement(Modal, null,
      <div>
        <div className="modal-header">
          <h4 className="modal-title">Add New Thing</h4>
        </div>
        <div className="modal-body">{this.props.children}</div>
      </div>
    )
  }
});

var PopupButtons = React.createClass({
  cancel() {
    window.history.back();;
  },
  render() {
    return (
      <div className="text-right">
        <button type="button" className="btn btn-default" onClick={this.cancel}>Cancel</button>
        <button type="submit" className="btn btn-main" onClick={this.submit}>Save</button>
      </div>
    )
  }
});
// public/js/components/year-dropdown.js

var YearsSelect = React.createClass({
  onSelectChange(e) {
    this.props.onSelectChange(e.target.value);
  },
  render() {
    let currentYear = new Date().getFullYear();
    let years = [];
    let startYear = 2010;

    while (startYear <= currentYear) {
      years.push(startYear++);
    }

    let yearItems = years.map(item => {
      return (
        <option key={item} value={item}>{item}</option>
      );
    });

    return (
      <select className="form-control" id="projectYear" value={this.props.value} onChange={this.onSelectChange}>
        <option value="" disabled="disabled"> -- Select year --</option>
        {yearItems}
      </select>
    )
  }
});
var QualificationForm = React.createClass({
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
      $('#form-message').show();
    }

    if (!school.trim()) {
      $('#qualSchool').addClass('required');
      this.setState({formMessage: 'Please provide school.'});
    } else if (!course.trim()) {
      $('#qualCourse').addClass('required');
      this.setState({formMessage: 'Please provide course.'});
    } else if (!year) {
      $('#qualYear').addClass('required');
      this.setState({formMessage: 'Please provide year.'});
    } else if (!description.trim()) {
      $('#qualDescription').addClass('required');
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
              <YearsSelect value={this.state.year}
                onSelectChange={this.handleYearChange} />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="qualDescription">Description</label>
              <textarea className="form-control" id="qualDescription" rows="4"
                value={this.state.description}
                onChange={this.handleDescriptionChange} ></textarea>
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
var Qualifications = React.createClass({
  loadQualifications() {
    $.ajax({
      url: '/api/resume/qualification',
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
      url: `/api/resume/qualification/${id}`,
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
    this.loadQualifications();
  },
  componentWillReceiveProps() {
    this.loadQualifications();
  },
  render() {
    return (
      <div>
        <div className="section-header">
          <h2>Qualifications</h2>
          <AddLink path={'/resume/qualification/add'}
            isModal={true} />
        </div>
        <QualificationList data={this.state.data} onDelete={this.handleDelete} />
      </div>
    );
  }
});

var QualificationList = React.createClass({
  render() {
    let qualificationItems = this.props.data.map(item => {
      return (
        <QualificationItem school={item.school} course={item.course}
        id={item._id} key={item._id} onDelete={this.props.onDelete} />
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
  deleteItem() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this qualification?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onDelete(this.props.id);
    });
  },
  render() {
    let {id} = this.props;

    return (
      <div>
        <span>{this.props.school}</span>
        <span>{this.props.course}</span>
        <p>
          <EditLink path={`/resume/qualification/edit/${id}`}
            isModal={true} />
          <DeleteLink onDelete={this.deleteItem} />
        </p>
      </div>
    );
  }
});
var SkillForm = React.createClass({
  getInitialState() {
    return {
      skill : ''
    };
  },
  handleSkillChange(e) {
    this.setState({skill: e.target.value});
  },
  handleValidation(e) {
    e.preventDefault();
    let {skill} = this.state;

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!skill.trim()) {
      $('#skillName').addClass('required');
      $('#form-message').show();

      this.setState({formMessage: 'Please provide skill.'});
    } else {
      $('#skillName').val('');
      this.setState({skill: ''});

      this.handleSubmit({skill});
    }
  },
  handleSubmit(item) {
    $.ajax({
      url: '/api/resume/skill',
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
      <div id="skill-form" className="">
          <p id="form-message">{this.state.formMessage}</p>
          <form encType="multipart/form-data" onSubmit={this.handleValidation}>
            <fieldset className="form-group">
              <label htmlFor="skillName">Add skill</label>
              <input type="text" className="form-control" id="skillName"
                value={this.state.skill} onChange={this.handleSkillChange} />
            </fieldset>
          </form>
      </div>
    );
  }
});

SkillForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}
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
// public/js/pages/home.js

var Home = React.createClass({
  render() {
    return (<h1>Welcome to Dat Vu Page</h1>);
  }
});
// public/js/pages/project-form.js

var ProjectFormPage = React.createClass({
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

var ProjectForm = React.createClass({
  getInitialState() {
    return this.props.data;
  },
  getTagSuggestions() {
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
  componentDidMount() {
    $('.tag-input input').addClass('form-control').attr('id', 'projectTechnologies').blur();

    if (this.props.projectID) {
      let projectID = this.props.projectID;

      this.serverRequest = $.ajax({
        url: `/api/projects/${projectID}`,
        dataType: 'json',
        cache: false,
        success: data => {
          // console.log(data);
          this.setState(data[0]);
          let picName = data[0]['picture'];

          var imgCtr = $('<img/>').prop('src', `/uploads/projects/${projectID}/${picName}`);
          $('#imgContainer').html(imgCtr);
        },
        error: (xhr, status, err) => {
          console.error(this.props.route.url, status, err.toString());
        }
      });
    }

    this.getTagSuggestions();
  },
  componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  },
  handleTitleChange(e) {
    this.setState({title: e.target.value});
  },
  handleYearChange(value) {
    this.setState({year: value});
  },
  handleDescriptionChange(e) {
    this.setState({description: e.target.value});
  },
  handleTechnologyChange(tags) {
    this.setState({technologies: tags});
  },
  handleDelete(i) {
      let tags = this.state.technologies;
      tags.splice(i, 1);
      this.handleTechnologyChange(tags);
  },
  handleAddition(tag) {
      let tags = this.state.technologies;
      tags.push({
          _id: tags.length + 1,
          text: tag
      });
      this.handleTechnologyChange(tags);
  },
  handleDrag(tag, currPos, newPos) {
      let tags = this.state.technologies;

      // mutate array
      tags.splice(currPos, 1);
      tags.splice(newPos, 0, tag);

      // re-render
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

    this.setState({picture: e.target.files[0].name});
  },
  handleSubmit(e) {
    e.preventDefault();
    let {title, year, description, technologies, picture} = this.state;
    let pictureObj = $('#imgContainer img');

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!title.trim() || !year || !description.trim() || technologies.length == 0
      || pictureObj.length == 0) {
      $('#form-message').show();
    }

    if (!title.trim()) {
      $('#projectTitle').addClass('required');
      this.setState({formMessage: 'Please put in title.'});
    } else if (!year) {
      $('#projectYear').addClass('required');
      this.setState({formMessage: 'Please put in year.'});
    } else if (!description.trim()) {
      $('#projectDescription').addClass('required');
      this.setState({formMessage: 'Please put in description.'});
    } else if (technologies.length == 0) {
      $('#projectTechnologies').addClass('required');
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
                  value={this.state.title} onChange={this.handleTitleChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectYear">Year of completion</label>
                <YearsSelect value={this.state.year} onSelectChange={this.handleYearChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <textarea className="form-control" id="projectDescription" rows="4"
                  value={this.state.description}
                  onChange={this.handleDescriptionChange}></textarea>
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectTechnologies">Technologies</label>
                <ReactTags tags={this.state.technologies}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    suggestions={this.state.suggestions}
                    classNames={{
                      tags: 'tags-container',
                      tagInput: 'tag-input',
                      tag: 'tag',
                      remove: 'tag-remove',
                      suggestions: 'tag-suggestions'
                    }}
                  />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectPicture">Screenshot</label>
                <input type="file" className="form-control-file" id="projectPicture"
                  onChange={this.handlePictureChange} />
                <div id="imgContainer"></div>
              </fieldset>
              <button type="submit" className="btn btn-main">Save Project</button>
            </form>
          </div>
      </div>
    )
  }
});
// public/js/pages/project-view.js

var ProjectViewPage = React.createClass({
  loadProject() {
    let {id} = this.props.params;

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      cache: false,
      success: data => {
        // console.log(data);
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  handleProjectDelete(id) {
    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: data => {
        this.context.router.push('/projects');
      },
      error: (xhr, status, err) => {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState() {
    return {data: '[]'};
  },
  componentDidMount() {
    this.loadProject();
  },
  render() {
    return (
      <div>
        <Project data={this.state.data} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var Project = React.createClass({
  deleteProject() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onProjectDelete(this.props.data[0]._id);
    });
  },
  render() {
    let {_id, title, picture, description, technologies} = this.props.data[0];
    let picSrc = `/uploads/projects/${_id}/${picture}`;
    let tagItems;

    if (technologies) {
      let count = 0;
      tagItems = technologies.map(item => {
        return (
          <span key={item._id} className="tag">{item.text}</span>
        );
      });
    }

    return (
      <div>
        <h1>{title}</h1>
        <EditLink path={`/project/${_id}/edit`}
          isModal={false} />
        <DeleteLink onDelete={this.deleteProject} />
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});
// public/js/pages/projects-list.js

var ProjectsPage = React.createClass({
  loadProjectsList() {
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: data => {
        // console.log(data);
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.route.url, status, err.toString());
      }
    });
  },
  handleProjectDelete(id) {
    $.ajax({
      url: this.props.route.url + id,
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
    this.loadProjectsList();
  },
  render() {
    return (
      <div>
        <AddLink path={'/project/new'}
          isModal={false} />
        <ProjectsList data={this.state.data} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var ProjectsList = React.createClass({
  render() {
    let projectItems = this.props.data.map(item => {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id}
          key={item._id} onProjectDelete={this.props.onProjectDelete} />
      );
    });

    return (
      <div id="projects-list">
        <div className="row">
          {projectItems}
        </div>
      </div>
    )
  }
});

var ProjectItem = React.createClass({
  deleteProject() {
    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(() => {
      this.props.onProjectDelete(this.props.id);
    });
  },
  render() {
    let {id, img} = this.props;

    return (
      <div className="box col-md-6 col-lg-4">
        <div className="box-img">
          <img src={`/uploads/projects/${id}/${img}`}
            alt="Card image cap" />
        </div>
        <div className="box-content">
          <h4 className="box-title"><Link to={`/project/${id}`}>
            {this.props.title}</Link>
          </h4>
          <p className="box-text">This is a longer card with supporting text
            below as a natural lead-in to additional content. This content is a
            little bit longer.</p>
          <EditLink path={`/project/${id}/edit`}
            isModal={false} />
          <DeleteLink onDelete={this.deleteProject} />
        </div>
      </div>
    )
  }
});
// public/js/pages/resume.js

var ResumePage = React.createClass({
  render() {
    return (
      <div>
        <Qualifications />
        <Skills />
      </div>
    );
  }
});
// js/scripts.js

var TodoBox = React.createClass({
  loadToDoList: function() {
    $.ajax({
      url: this.props.route.url,
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
  handleTodoSubmit: function(item) {
    var items = this.state.data;
    var newItems = items.concat([item]);
    this.setState({data: newItems});
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: items});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoDelete: function(id) {
    // var items = this.state.data;
    // var newItems = items.concat([item]);
    // this.setState({data: newItems});
    $.ajax({
      url: '/api/todos/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: item,
      success: function(data) {
        // this.setState({data: data});
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
    this.loadToDoList();
  },
  render: function() {
    return (
      <div>
        <Banner data={this.state.data} />
        <TodoList onTodoDelete={this.handleTodoDelete} data={this.state.data} />
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
});

var Banner = React.createClass({
  render: function() {
    return (
      <div className="jumbotron text-center">
          <h1>I am a Todo-aholic <span className="label label-info">{this.props.data.length}</span></h1>
      </div>
    )
  }
});

var TodoList = React.createClass({
  render: function() {
    var todoItems = this.props.data.map(function(item) {
      return (
        <TodoItem text={item.text} id={item._id} key={item._id} />
      );
    });

    return (
      <div id="todo-list" className="row">
          <div className="col-sm-4 col-sm-offset-4">
              {todoItems}
          </div>
      </div>
    )
  }
});

var TodoItem = React.createClass({
  handleComplete: function() {
    $.ajax({
      url: '/api/todos/' + this.props.id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        // this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="checkbox">
          <label>
              <input type="checkbox" onChange={this.handleComplete} /> {this.props.text}
          </label>
      </div>
    )
  }
});

var TodoForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onTodoSubmit({text: text});
    this.setState({text: ''});
  },
  render: function() {
    return (
      <div id="todo-form" className="row">
          <div className="col-sm-8 col-sm-offset-2 text-center">
              <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                      <input type="text" className="form-control input-lg text-center" placeholder="I want to buy a puppy that will love me forever" value={this.state.text} onChange={this.handleTextChange}/>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg">Add</button>
              </form>
          </div>
      </div>
    )
  }
});
// public/js/app-wrapper.js
"use strict";
var App = React.createClass({
  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  },
  componentDidMount() {
    $.ajax({
      url: '/api/checkauthentication',
      dataType: 'json',
      cache: false,
      success: authenticated => {
        if (authenticated) {
          localStorage.setItem('user', 'datvu');
        }
        else {
          localStorage.removeItem('user');
        }

      },
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
    });
  },
  render() {
    let {location} = this.props;
    let isModal = (location.state && location.state.modal &&
      this.previousChildren);

    return (
      <div>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/resume">Resume</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/todos">To-do List</Link>
          </nav>
        </header>
        <div id="content">
          {isModal ? this.previousChildren : this.props.children}
          {isModal && (
            <Modal isOpen={true} returnTo={location.state.returnTo}>
              {this.props.children}
            </Modal>
          )}
        </div>
        <footer>
        </footer>
      </div>
    );
  }
});

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="todos" url="/api/todos" component={TodoBox} />
      <Route path="resume" url="/api/resume/" component={ResumePage} />
      <Route path="resume/qualification/add" url="/api/resume/qualification" component={QualificationForm} />
      <Route path="resume/qualification/edit/:id" url="/api/resume/qualification" component={QualificationForm} />
      <Route path="projects" url="/api/projects/" component={ProjectsPage} />
      <Route path="project/new" url="/api/projects/" component={ProjectFormPage} />
      <Route path="project/:id" url="/api/projects/" component={ProjectViewPage} />
      <Route path="project/:id/edit" url="/api/projects/" component={ProjectFormPage} />
    </Route>
  </Router>,
  document.getElementById('main')
);
