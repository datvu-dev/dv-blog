(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var AddLink = React.createClass({
  displayName: 'AddLink',
  render: function render() {
    var linkItem = void 0;

    if (localStorage.getItem('user')) {
      linkItem = React.createElement(
        Link,
        { to: {
            pathname: this.props.path,
            state: { modal: this.props.isModal }
          } },
        'Add'
      );
    }

    return React.createElement(
      'span',
      null,
      linkItem
    );
  }
});
// public/js/components/confirm-dialog.js

var Promise = $.Deferred;

var Confirm = React.createClass({
  displayName: 'Confirm',
  getDefaultProps: function getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    };
  },
  abort: function abort() {
    return this.promise.reject();
  },
  confirm: function confirm() {
    return this.promise.resolve();
  },
  componentDidMount: function componentDidMount() {
    this.promise = new Promise();
  },
  render: function render() {
    return React.createElement(Modal, null, React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'modal-header' },
        React.createElement(
          'h4',
          { className: 'modal-title' },
          this.props.message
        )
      ),
      React.createElement(
        'div',
        { className: 'modal-body' },
        this.props.description ? this.props.description : ''
      ),
      React.createElement(
        'div',
        { className: 'modal-footer' },
        React.createElement(
          'div',
          { className: 'text-right' },
          React.createElement(
            'button',
            { role: 'abort', type: 'button', className: 'btn btn-default',
              onClick: this.abort },
            this.props.abortLabel
          ),
          React.createElement(
            'button',
            { role: 'confirm', type: 'button', className: 'btn btn-primary',
              ref: 'confirm', onClick: this.confirm },
            this.props.confirmLabel
          )
        )
      )
    ));
  }
});

var confirmAction = function confirmAction(message) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var props = $.extend({ message: message }, options);
  var wrapper = document.body.appendChild(document.createElement('div'));
  var component = ReactDOM.render(React.createElement(Confirm, props), wrapper);

  var cleanup = function cleanup() {
    ReactDOM.unmountComponentAtNode(wrapper);
    setTimeout(function () {
      wrapper.remove();
    });
  };

  return component.promise.always(cleanup).promise();
};
var DeleteLink = React.createClass({
  displayName: 'DeleteLink',
  render: function render() {
    var linkItem = void 0;
    var text = this.props.linkText ? this.props.linkText : 'Remove';
    var className = this.props.linkClass ? this.props.linkClass : 'utility-link';

    if (localStorage.getItem('user')) {
      linkItem = React.createElement(
        'a',
        { className: className,
          onClick: this.props.onDelete },
        React.createElement(
          'small',
          null,
          text
        )
      );
    }

    return React.createElement(
      'span',
      null,
      linkItem
    );
  }
});
var EditLink = React.createClass({
  displayName: 'EditLink',
  render: function render() {
    var linkItem = void 0;

    if (localStorage.getItem('user')) {
      linkItem = React.createElement(
        Link,
        { className: 'utility-link', to: {
            pathname: this.props.path,
            state: { modal: this.props.isModal }
          } },
        React.createElement(
          'small',
          null,
          'Edit'
        )
      );
    }

    return React.createElement(
      'span',
      null,
      linkItem
    );
  }
});
// public/js/components/modal.js

var Modal = React.createClass({
  displayName: 'Modal',
  render: function render() {
    return React.createElement(
      'div',
      { id: 'modal' },
      React.createElement('div', { className: 'modal-backdrop in' }),
      React.createElement(
        'div',
        { className: 'modal in', tabIndex: '-1', role: 'dialog', 'aria-hidden': 'false', ref: 'modal', style: { display: 'block' } },
        React.createElement(
          'div',
          { className: 'modal-dialog' },
          React.createElement(
            'div',
            { className: 'modal-content' },
            this.props.children
          )
        )
      )
    );
  }
});
// public/js/components/popup-form.js

var PopupForm = React.createClass({
  displayName: 'PopupForm',
  render: function render() {
    return React.createElement(Modal, null, React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'modal-header' },
        React.createElement(
          'h4',
          { className: 'modal-title' },
          'Add New Thing'
        )
      ),
      React.createElement(
        'div',
        { className: 'modal-body' },
        this.props.children
      )
    ));
  }
});

var PopupButtons = React.createClass({
  displayName: 'PopupButtons',
  cancel: function cancel() {
    window.history.back();;
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'text-right' },
      React.createElement(
        'button',
        { type: 'button', className: 'btn btn-default', onClick: this.cancel },
        'Cancel'
      ),
      React.createElement(
        'button',
        { type: 'submit', className: 'btn btn-primary', onClick: this.submit },
        'Save'
      )
    );
  }
});
// public/js/components/year-dropdown.js

var YearsSelect = React.createClass({
  displayName: 'YearsSelect',
  onSelectChange: function onSelectChange(e) {
    this.props.onSelectChange(e.target.value);
  },
  render: function render() {
    var currentYear = new Date().getFullYear();
    var years = [];
    var startYear = 2010;

    while (startYear <= currentYear) {
      years.push(startYear++);
    }

    var yearItems = years.map(function (item) {
      return React.createElement(
        'option',
        { key: item, value: item },
        item
      );
    });

    return React.createElement(
      'select',
      { className: 'form-control', id: 'projectYear', value: this.props.value, onChange: this.onSelectChange },
      React.createElement(
        'option',
        { value: '', disabled: 'disabled' },
        ' -- Select year --'
      ),
      yearItems
    );
  }
});
var QualificationForm = React.createClass({
  displayName: 'QualificationForm',
  getInitialState: function getInitialState() {
    return {
      school: '',
      course: '',
      year: '',
      description: ''
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var _ref = this.props.params ? this.props.params : null;

    var id = _ref.id;


    if (id) {
      $.ajax({
        url: '/api/resume/qualification/' + id,
        dataType: 'json',
        cache: false,
        success: function success(data) {
          _this.setState(data[0]);
        },
        error: function error(xhr, status, err) {
          console.error(_this.props.route.url, status, err.toString());
        }
      });
    }
  },
  handleSchoolChange: function handleSchoolChange(e) {
    this.setState({ school: e.target.value });
  },
  handleCourseChange: function handleCourseChange(e) {
    this.setState({ course: e.target.value });
  },
  handleYearChange: function handleYearChange(value) {
    this.setState({ year: value });
  },
  handleDescriptionChange: function handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  },
  handleValidation: function handleValidation(e) {
    e.preventDefault();
    var _state = this.state;
    var school = _state.school;
    var course = _state.course;
    var year = _state.year;
    var description = _state.description;


    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!school.trim() || !course.trim() || !year || !description.trim()) {
      $('#form-message').show();
    }

    if (!school.trim()) {
      $('#qualSchool').addClass('required');
      this.setState({ formMessage: 'Please provide school.' });
    } else if (!course.trim()) {
      $('#qualCourse').addClass('required');
      this.setState({ formMessage: 'Please provide course.' });
    } else if (!year) {
      $('#qualYear').addClass('required');
      this.setState({ formMessage: 'Please provide year.' });
    } else if (!description.trim()) {
      $('#qualDescription').addClass('required');
      this.setState({ formMessage: 'Please provide description.' });
    } else {
      this.handleSubmit({
        school: school,
        course: course,
        year: year,
        description: description
      });
    }
  },
  handleSubmit: function handleSubmit(item) {
    var _this2 = this;

    var id = this.props.params.id ? this.props.params.id : '';

    $.ajax({
      url: '/api/resume/qualification/' + id,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function success(items) {
        _this2.context.router.push('/resume');
      },
      error: function error(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'qualification-form', className: '' },
      React.createElement(
        'p',
        { id: 'form-message' },
        this.state.formMessage
      ),
      React.createElement(
        'form',
        { encType: 'multipart/form-data', onSubmit: this.handleValidation },
        React.createElement(
          'fieldset',
          { className: 'form-group' },
          React.createElement(
            'label',
            { htmlFor: 'qualSchool' },
            'School'
          ),
          React.createElement('input', { type: 'text', className: 'form-control', id: 'qualSchool',
            value: this.state.school, onChange: this.handleSchoolChange })
        ),
        React.createElement(
          'fieldset',
          { className: 'form-group' },
          React.createElement(
            'label',
            { htmlFor: 'qualCourse' },
            'Course'
          ),
          React.createElement('input', { type: 'text', className: 'form-control', id: 'qualCourse',
            value: this.state.course, onChange: this.handleCourseChange })
        ),
        React.createElement(
          'fieldset',
          { className: 'form-group' },
          React.createElement(
            'label',
            { htmlFor: 'qualYear' },
            'Year of completion'
          ),
          React.createElement(YearsSelect, { value: this.state.year,
            onSelectChange: this.handleYearChange })
        ),
        React.createElement(
          'fieldset',
          { className: 'form-group' },
          React.createElement(
            'label',
            { htmlFor: 'qualDescription' },
            'Description'
          ),
          React.createElement('textarea', { className: 'form-control', id: 'qualDescription', rows: '4',
            value: this.state.description,
            onChange: this.handleDescriptionChange })
        ),
        React.createElement(PopupButtons, null)
      )
    );
  }
});

QualificationForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};
var Qualifications = React.createClass({
  displayName: 'Qualifications',
  loadQualifications: function loadQualifications() {
    var _this3 = this;

    $.ajax({
      url: '/api/resume/qualification',
      dataType: 'json',
      cache: false,
      success: function success(data) {
        _this3.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        console.error(_this3.props.route.url, status, err.toString());
      }
    });
  },
  handleDelete: function handleDelete(id) {
    var _this4 = this;

    $.ajax({
      url: '/api/resume/qualification/' + id,
      dataType: 'json',
      type: 'DELETE',
      success: function success(data) {
        _this4.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        // this.setState({data: comments});
        console.error(_this4.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.loadQualifications();
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    this.loadQualifications();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'section-header' },
        React.createElement(
          'h2',
          null,
          'Qualifications'
        ),
        React.createElement(AddLink, { path: '/resume/qualification/add',
          isModal: true })
      ),
      React.createElement(QualificationList, { data: this.state.data, onDelete: this.handleDelete })
    );
  }
});

var QualificationList = React.createClass({
  displayName: 'QualificationList',
  render: function render() {
    var _this5 = this;

    var qualificationItems = this.props.data.map(function (item) {
      return React.createElement(QualificationItem, { school: item.school, course: item.course,
        id: item._id, key: item._id, onDelete: _this5.props.onDelete });
    });

    return React.createElement(
      'div',
      null,
      qualificationItems
    );
  }
});

var QualificationItem = React.createClass({
  displayName: 'QualificationItem',
  deleteItem: function deleteItem() {
    var _this6 = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this qualification?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function () {
      _this6.props.onDelete(_this6.props.id);
    });
  },
  render: function render() {
    var id = this.props.id;


    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        null,
        this.props.school
      ),
      React.createElement(
        'span',
        null,
        this.props.course
      ),
      React.createElement(
        'p',
        null,
        React.createElement(EditLink, { path: '/resume/qualification/edit/' + id,
          isModal: true }),
        React.createElement(DeleteLink, { onDelete: this.deleteItem })
      )
    );
  }
});
var SkillForm = React.createClass({
  displayName: 'SkillForm',
  getInitialState: function getInitialState() {
    return {
      skill: ''
    };
  },
  handleSkillChange: function handleSkillChange(e) {
    this.setState({ skill: e.target.value });
  },
  handleValidation: function handleValidation(e) {
    e.preventDefault();
    var skill = this.state.skill;


    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!skill.trim()) {
      $('#skillName').addClass('required');
      $('#form-message').show();

      this.setState({ formMessage: 'Please provide skill.' });
    } else {
      $('#skillName').val('');
      this.setState({ skill: '' });

      this.handleSubmit({
        skill: skill
      });
    }
  },
  handleSubmit: function handleSubmit(item) {
    var _this7 = this;

    $.ajax({
      url: '/api/resume/skill',
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function success(items) {
        _this7.context.router.push('/resume');
      },
      error: function error(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'skill-form', className: '' },
      React.createElement(
        'p',
        { id: 'form-message' },
        this.state.formMessage
      ),
      React.createElement(
        'form',
        { encType: 'multipart/form-data', onSubmit: this.handleValidation },
        React.createElement(
          'fieldset',
          { className: 'form-group' },
          React.createElement(
            'label',
            { htmlFor: 'skillName' },
            'Add skill'
          ),
          React.createElement('input', { type: 'text', className: 'form-control', id: 'skillName',
            value: this.state.skill, onChange: this.handleSkillChange })
        )
      )
    );
  }
});

SkillForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};
var Skills = React.createClass({
  displayName: 'Skills',
  loadSkills: function loadSkills() {
    var _this8 = this;

    $.ajax({
      url: '/api/resume/skill',
      dataType: 'json',
      cache: false,
      success: function success(data) {
        _this8.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        console.error(_this8.props.route.url, status, err.toString());
      }
    });
  },
  handleDelete: function handleDelete(id) {
    var _this9 = this;

    $.ajax({
      url: '/api/resume/skill/' + id,
      dataType: 'json',
      type: 'DELETE',
      success: function success(data) {
        _this9.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        // this.setState({data: comments});
        console.error(_this9.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.loadSkills();
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    this.loadSkills();
  },
  render: function render() {
    var skillForm = void 0;

    if (localStorage.getItem('user')) {
      skillForm = React.createElement(SkillForm, null);
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'section-header' },
        React.createElement(
          'h2',
          null,
          'Skills'
        )
      ),
      skillForm,
      React.createElement(SkillList, { data: this.state.data, onDelete: this.handleDelete })
    );
  }
});

var SkillList = React.createClass({
  displayName: 'SkillList',
  render: function render() {
    var _this10 = this;

    var skillItems = this.props.data.map(function (item) {
      return React.createElement(SkillItem, { skill: item.skill, id: item._id, key: item._id,
        onDelete: _this10.props.onDelete });
    });

    return React.createElement(
      'div',
      null,
      skillItems
    );
  }
});

var SkillItem = React.createClass({
  displayName: 'SkillItem',
  deleteItem: function deleteItem() {
    var _this11 = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this skill?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function () {
      _this11.props.onDelete(_this11.props.id);
    });
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'tag' },
      this.props.skill,
      React.createElement(DeleteLink, { onDelete: this.deleteItem, linkText: 'X', linkClass: 'tag-remove' })
    );
  }
});
// public/js/pages/home.js

var Home = React.createClass({
  displayName: 'Home',
  render: function render() {
    return React.createElement(
      'h1',
      null,
      'Welcome to the Home Page'
    );
  }
});
// public/js/pages/project-form.js

var ProjectFormPage = React.createClass({
  displayName: 'ProjectFormPage',
  handleProjectSubmit: function handleProjectSubmit(item) {
    var _this12 = this;

    var id = this.props.params.id ? this.props.params.id : '';

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function success(data) {
        if ($('#projectPicture')[0].files[0]) {
          _this12.handleUpload();
        }

        _this12.context.router.push('/projects');
      },
      error: function error(xhr, status, err) {
        console.error(_this12.props.route.url, status, err.toString());
      }
    });
  },
  handleUpload: function handleUpload() {
    var _this13 = this;

    var formData = new FormData();
    var fileObj = $('#projectPicture')[0].files[0];
    formData.append('uploads[]', fileObj, fileObj.name);

    $.ajax({
      url: '/api/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function success(data) {},
      error: function error(xhr, status, err) {
        console.error(_this13.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState: function getInitialState() {
    return { data: {
        title: '',
        year: '',
        picture: '',
        description: '',
        technologies: [],
        suggestions: []
      } };
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(ProjectForm, { onProjectSubmit: this.handleProjectSubmit,
        data: this.state.data, projectID: this.props.params.id })
    );
  }
});

ProjectFormPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

var ProjectForm = React.createClass({
  displayName: 'ProjectForm',
  getInitialState: function getInitialState() {
    return this.props.data;
  },
  getTagSuggestions: function getTagSuggestions() {
    var _this14 = this;

    var skillsUrl = 'http://trendyskills.com/service?q=keywords&key=77MGlB3wzQbD9KfZ';

    $.ajax({
      url: skillsUrl,
      method: 'GET',
      dataType: 'jsonp',
      success: function success(res) {
        var suggestionsArr = [];

        res.keywords.map(function (item) {
          suggestionsArr.push(item.keyName);
        });

        _this14.setState({ suggestions: suggestionsArr });
      },
      error: function error(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  },
  componentDidMount: function componentDidMount() {
    var _this15 = this;

    $('.tag-input input').addClass('form-control').attr('id', 'projectTechnologies').blur();

    if (this.props.projectID) {
      (function () {
        var projectID = _this15.props.projectID;

        _this15.serverRequest = $.ajax({
          url: '/api/projects/' + projectID,
          dataType: 'json',
          cache: false,
          success: function success(data) {
            // console.log(data);
            _this15.setState(data[0]);
            var picName = data[0]['picture'];

            var imgCtr = $('<img/>').prop('src', '/uploads/projects/' + projectID + '/' + picName);
            $('#imgContainer').html(imgCtr);
          },
          error: function error(xhr, status, err) {
            console.error(_this15.props.route.url, status, err.toString());
          }
        });
      })();
    }

    this.getTagSuggestions();
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  },
  handleTitleChange: function handleTitleChange(e) {
    this.setState({ title: e.target.value });
  },
  handleYearChange: function handleYearChange(value) {
    this.setState({ year: value });
  },
  handleDescriptionChange: function handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  },
  handleTechnologyChange: function handleTechnologyChange(tags) {
    this.setState({ technologies: tags });
  },
  handleDelete: function handleDelete(i) {
    var tags = this.state.technologies;
    tags.splice(i, 1);
    this.handleTechnologyChange(tags);
  },
  handleAddition: function handleAddition(tag) {
    var tags = this.state.technologies;
    tags.push({
      _id: tags.length + 1,
      text: tag
    });
    this.handleTechnologyChange(tags);
  },
  handleDrag: function handleDrag(tag, currPos, newPos) {
    var tags = this.state.technologies;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.handleTechnologyChange(tags);
  },
  handlePictureChange: function handlePictureChange(e) {
    // console.log(e.target);
    localStorage.removeItem("imgData");
    var reader = new FileReader();
    reader.onload = function () {
      var thisImage = reader.result;
      localStorage.setItem("imgData", thisImage);
    };
    reader.readAsDataURL(e.target.files[0]);

    setTimeout(function () {
      var dataImage = localStorage.getItem('imgData');
      var imgCtr = $('<img/>').prop('src', dataImage);
      $('#imgContainer').html(imgCtr);
    }, 500);

    this.setState({ picture: e.target.files[0].name });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var _state2 = this.state;
    var title = _state2.title;
    var year = _state2.year;
    var description = _state2.description;
    var technologies = _state2.technologies;
    var picture = _state2.picture;

    var pictureObj = $('#imgContainer img');

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!title.trim() || !year || !description.trim() || technologies.length == 0 || pictureObj.length == 0) {
      $('#form-message').show();
    }

    if (!title.trim()) {
      $('#projectTitle').addClass('required');
      this.setState({ formMessage: 'Please put in title.' });
    } else if (!year) {
      $('#projectYear').addClass('required');
      this.setState({ formMessage: 'Please put in year.' });
    } else if (!description.trim()) {
      $('#projectDescription').addClass('required');
      this.setState({ formMessage: 'Please put in description.' });
    } else if (technologies.length == 0) {
      $('#projectTechnologies').addClass('required');
      this.setState({ formMessage: 'Please put in at least one technology.' });
    } else if (pictureObj.length == 0) {
      this.setState({ formMessage: 'Please upload a screenshot.' });
    } else {
      this.props.onProjectSubmit({
        title: title,
        year: year,
        picture: picture,
        description: description,
        technologies: technologies
      });
    }
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'project-form', className: 'row' },
      React.createElement(
        'div',
        { className: 'col-sm-8 col-sm-offset-2' },
        React.createElement(
          'p',
          { id: 'form-message' },
          this.state.formMessage
        ),
        React.createElement(
          'form',
          { encType: 'multipart/form-data', onSubmit: this.handleSubmit },
          React.createElement(
            'fieldset',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'projectTitle' },
              'Title'
            ),
            React.createElement('input', { type: 'text', className: 'form-control', id: 'projectTitle',
              value: this.state.title, onChange: this.handleTitleChange })
          ),
          React.createElement(
            'fieldset',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'projectYear' },
              'Year of completion'
            ),
            React.createElement(YearsSelect, { value: this.state.year, onSelectChange: this.handleYearChange })
          ),
          React.createElement(
            'fieldset',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'projectDescription' },
              'Description'
            ),
            React.createElement('textarea', { className: 'form-control', id: 'projectDescription', rows: '4',
              value: this.state.description,
              onChange: this.handleDescriptionChange })
          ),
          React.createElement(
            'fieldset',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'projectTechnologies' },
              'Technologies'
            ),
            React.createElement(ReactTags, { tags: this.state.technologies,
              handleDelete: this.handleDelete,
              handleAddition: this.handleAddition,
              handleDrag: this.handleDrag,
              suggestions: this.state.suggestions,
              classNames: {
                tags: 'tags-container',
                tagInput: 'tag-input',
                tag: 'tag',
                remove: 'tag-remove',
                suggestions: 'tag-suggestions'
              }
            })
          ),
          React.createElement(
            'fieldset',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'projectPicture' },
              'Screenshot'
            ),
            React.createElement('input', { type: 'file', className: 'form-control-file', id: 'projectPicture',
              onChange: this.handlePictureChange }),
            React.createElement('div', { id: 'imgContainer' })
          ),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-primary' },
            'Save Project'
          )
        )
      )
    );
  }
});
// public/js/pages/project-view.js

var ProjectViewPage = React.createClass({
  displayName: 'ProjectViewPage',
  loadProject: function loadProject() {
    var _this16 = this;

    var id = this.props.params.id;


    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      cache: false,
      success: function success(data) {
        // console.log(data);
        _this16.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        console.error(_this16.props.route.url, status, err.toString());
      }
    });
  },
  handleProjectDelete: function handleProjectDelete(id) {
    var _this17 = this;

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: function success(data) {
        _this17.context.router.push('/projects');
      },
      error: function error(xhr, status, err) {
        // this.setState({data: comments});
        console.error(_this17.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState: function getInitialState() {
    return { data: '[]' };
  },
  componentDidMount: function componentDidMount() {
    this.loadProject();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(Project, { data: this.state.data, onProjectDelete: this.handleProjectDelete })
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

var Project = React.createClass({
  displayName: 'Project',
  deleteProject: function deleteProject() {
    var _this18 = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function () {
      _this18.props.onProjectDelete(_this18.props.data[0]._id);
    });
  },
  render: function render() {
    var _props$data$ = this.props.data[0];
    var _id = _props$data$._id;
    var title = _props$data$.title;
    var picture = _props$data$.picture;
    var description = _props$data$.description;
    var technologies = _props$data$.technologies;

    var picSrc = '/uploads/projects/' + _id + '/' + picture;
    var tagItems = void 0;

    if (technologies) {
      var count = 0;
      tagItems = technologies.map(function (item) {
        return React.createElement(
          'span',
          { key: item._id, className: 'tag' },
          item.text
        );
      });
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        title
      ),
      React.createElement(EditLink, { path: '/project/' + _id + '/edit',
        isModal: false }),
      React.createElement(DeleteLink, { onDelete: this.deleteProject }),
      React.createElement(
        'p',
        null,
        React.createElement('img', { src: picSrc })
      ),
      React.createElement(
        'p',
        null,
        tagItems
      ),
      React.createElement(
        'p',
        null,
        description
      )
    );
  }
});
// public/js/pages/projects-list.js

var ProjectsPage = React.createClass({
  displayName: 'ProjectsPage',
  loadProjectsList: function loadProjectsList() {
    var _this19 = this;

    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: function success(data) {
        // console.log(data);
        _this19.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        console.error(_this19.props.route.url, status, err.toString());
      }
    });
  },
  handleProjectDelete: function handleProjectDelete(id) {
    var _this20 = this;

    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: function success(data) {
        _this20.setState({ data: data });
      },
      error: function error(xhr, status, err) {
        // this.setState({data: comments});
        console.error(_this20.props.route.url, status, err.toString());
      }
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.loadProjectsList();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Link,
        { to: '/project/new', className: 'btn btn-primary' },
        'New Project'
      ),
      React.createElement(ProjectsList, { data: this.state.data, onProjectDelete: this.handleProjectDelete })
    );
  }
});

ProjectsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

var ProjectsList = React.createClass({
  displayName: 'ProjectsList',
  render: function render() {
    var _this21 = this;

    var projectItems = this.props.data.map(function (item) {
      return React.createElement(ProjectItem, { title: item.title, img: item.picture, id: item._id,
        key: item._id, onProjectDelete: _this21.props.onProjectDelete });
    });

    return React.createElement(
      'div',
      { id: 'projects-list', className: 'container' },
      React.createElement(
        'div',
        { className: 'row' },
        projectItems
      )
    );
  }
});

var ProjectItem = React.createClass({
  displayName: 'ProjectItem',
  deleteProject: function deleteProject() {
    var _this22 = this;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function () {
      _this22.props.onProjectDelete(_this22.props.id);
    });
  },
  render: function render() {
    var _props = this.props;
    var id = _props.id;
    var img = _props.img;


    return React.createElement(
      'div',
      { className: 'box col-md-6 col-lg-4' },
      React.createElement(
        'div',
        { className: 'box-img' },
        React.createElement('img', { src: '/uploads/projects/' + id + '/' + img,
          alt: 'Card image cap' })
      ),
      React.createElement(
        'div',
        { className: 'box-content' },
        React.createElement(
          'h4',
          { className: 'box-title' },
          React.createElement(
            Link,
            { to: '/project/' + id },
            this.props.title
          )
        ),
        React.createElement(
          'p',
          { className: 'box-text' },
          'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
        ),
        React.createElement(EditLink, { path: '/project/' + id + '/edit',
          isModal: false }),
        React.createElement(DeleteLink, { onDelete: this.deleteProject })
      )
    );
  }
});
// public/js/pages/resume.js

var ResumePage = React.createClass({
  displayName: 'ResumePage',
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(Qualifications, null),
      React.createElement(Skills, null)
    );
  }
});
// js/scripts.js

var TodoBox = React.createClass({
  displayName: 'TodoBox',

  loadToDoList: function loadToDoList() {
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function handleTodoSubmit(item) {
    var items = this.state.data;
    var newItems = items.concat([item]);
    this.setState({ data: newItems });
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({ data: items });
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoDelete: function handleTodoDelete(id) {
    // var items = this.state.data;
    // var newItems = items.concat([item]);
    // this.setState({data: newItems});
    $.ajax({
      url: '/api/todos/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: item,
      success: function (data) {
        // this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.loadToDoList();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(Banner, { data: this.state.data }),
      React.createElement(TodoList, { onTodoDelete: this.handleTodoDelete, data: this.state.data }),
      React.createElement(TodoForm, { onTodoSubmit: this.handleTodoSubmit })
    );
  }
});

var Banner = React.createClass({
  displayName: 'Banner',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'jumbotron text-center' },
      React.createElement(
        'h1',
        null,
        'I am a Todo-aholic ',
        React.createElement(
          'span',
          { className: 'label label-info' },
          this.props.data.length
        )
      )
    );
  }
});

var TodoList = React.createClass({
  displayName: 'TodoList',

  render: function render() {
    var todoItems = this.props.data.map(function (item) {
      return React.createElement(TodoItem, { text: item.text, id: item._id, key: item._id });
    });

    return React.createElement(
      'div',
      { id: 'todo-list', className: 'row' },
      React.createElement(
        'div',
        { className: 'col-sm-4 col-sm-offset-4' },
        todoItems
      )
    );
  }
});

var TodoItem = React.createClass({
  displayName: 'TodoItem',

  handleComplete: function handleComplete() {
    $.ajax({
      url: '/api/todos/' + this.props.id,
      dataType: 'json',
      type: 'DELETE',
      success: function (data) {
        // this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'checkbox' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { type: 'checkbox', onChange: this.handleComplete }),
        ' ',
        this.props.text
      )
    );
  }
});

var TodoForm = React.createClass({
  displayName: 'TodoForm',

  getInitialState: function getInitialState() {
    return { text: '' };
  },
  handleTextChange: function handleTextChange(e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onTodoSubmit({ text: text });
    this.setState({ text: '' });
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'todo-form', className: 'row' },
      React.createElement(
        'div',
        { className: 'col-sm-8 col-sm-offset-2 text-center' },
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement('input', { type: 'text', className: 'form-control input-lg text-center', placeholder: 'I want to buy a puppy that will love me forever', value: this.state.text, onChange: this.handleTextChange })
          ),
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-primary btn-lg' },
            'Add'
          )
        )
      )
    );
  }
});
// public/js/app-wrapper.js
"use strict";
var App = React.createClass({
  displayName: 'App',
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key && nextProps.location.state && nextProps.location.state.modal) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children;
    }
  },
  componentDidMount: function componentDidMount() {
    $.ajax({
      url: '/api/checkauthentication',
      dataType: 'json',
      cache: false,
      success: function success(authenticated) {
        if (authenticated) {
          localStorage.setItem('user', 'datvu');
        } else {
          localStorage.removeItem('user');
        }
      },
      error: function error(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  },
  render: function render() {
    var location = this.props.location;

    var isModal = location.state && location.state.modal && this.previousChildren;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        null,
        React.createElement(
          'nav',
          null,
          React.createElement(
            Link,
            { to: '/' },
            'Home'
          ),
          React.createElement(
            Link,
            { to: '/resume' },
            'Resume'
          ),
          React.createElement(
            Link,
            { to: '/projects' },
            'Projects'
          ),
          React.createElement(
            Link,
            { to: '/todos' },
            'To-do List'
          )
        )
      ),
      React.createElement(
        'div',
        { id: 'content' },
        isModal ? this.previousChildren : this.props.children,
        isModal && React.createElement(
          Modal,
          { isOpen: true, returnTo: location.state.returnTo },
          this.props.children
        )
      ),
      React.createElement('footer', null)
    );
  }
});

ReactDOM.render(React.createElement(
  Router,
  { history: browserHistory },
  React.createElement(
    Route,
    { path: '/', component: App },
    React.createElement(IndexRoute, { component: Home }),
    React.createElement(Route, { path: 'todos', url: '/api/todos', component: TodoBox }),
    React.createElement(Route, { path: 'resume', url: '/api/resume/', component: ResumePage }),
    React.createElement(Route, { path: 'resume/qualification/add', url: '/api/resume/qualification', component: QualificationForm }),
    React.createElement(Route, { path: 'resume/qualification/edit/:id', url: '/api/resume/qualification', component: QualificationForm }),
    React.createElement(Route, { path: 'projects', url: '/api/projects/', component: ProjectsPage }),
    React.createElement(Route, { path: 'project/new', url: '/api/projects/', component: ProjectFormPage }),
    React.createElement(Route, { path: 'project/:id', url: '/api/projects/', component: ProjectViewPage }),
    React.createElement(Route, { path: 'project/:id/edit', url: '/api/projects/', component: ProjectFormPage })
  )
), document.getElementById('main'));

},{}]},{},[1]);
