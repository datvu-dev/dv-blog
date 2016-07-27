// public/js/require.js

var React = require('react');
var ReactDOM = require('react-dom');
// var {Router, Route, IndexRoute, IndexLink, Link} = require('react-router');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var IndexLink = require('react-router').IndexLink;
var hashHistory = require('react-router').hashHistory;
var ReactTags = require('react-tag-input').WithContext;
var Modal = React.createClass({
  displayName: 'Modal',
  render: function() {
    return (
      <div>
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

var Promise = $.Deferred;

var Confirm = React.createClass({
  displayName: 'Confirm',
  getDefaultProps: function() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    }
  },
  abort: function() {
    return this.promise.reject();
  },
  confirm: function() {
    return this.promise.resolve();
  },
  componentDidMount: function() {
    this.promise = new Promise();
  },
  render: function() {
    return React.createElement(Modal, null,
      <div>
        <div className="modal-header">
          <h4 className="modal-title">{this.props.message}</h4>
        </div>
        <div className="modal-body">{this.props.description ? this.props.description : ''}</div>
        <div className="modal-footer">
          <div className="text-right">
            <button role="abort" type="button" className="btn btn-default" onClick={this.abort}>{this.props.abortLabel}</button>
            <button role="confirm" type="button" className="btn btn-primary" ref="confirm" onClick={this.confirm}>{this.props.confirmLabel}</button>
          </div>
        </div>
      </div>
    )
  }
});

var confirmAction = function(message, options) {
  if (options == null) {
    options = {};
  }

  var props = $.extend({message: message}, options);
  var wrapper = document.body.appendChild(document.createElement('div'));
  var component = ReactDOM.render(React.createElement(Confirm, props), wrapper);

  var cleanup = function() {
    ReactDOM.unmountComponentAtNode(wrapper);
    setTimeout(function() {
      wrapper.remove();
    });
  }

  return component.promise.always(cleanup).promise();
}
// public/js/components/home.js

var Home = React.createClass({
  render: function() {
    return (<h1>Welcome to the Home Page</h1>);
  }
});
// public/js/components/project-form.js

var ProjectFormPage = React.createClass({
  handleProjectSubmit: function(item) {
    var projectID = this.props.params.project_id ? this.props.params.project_id : '';

    $.ajax({
      url: this.props.route.url + projectID,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(data) {
        if ($('#projectPicture')[0].files[0]) {
          this.handleUpload();
        }

        this.context.router.push('/projects');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  handleUpload: function() {
    var formData = new FormData();
    var fileObj = $('#projectPicture')[0].files[0];
    formData.append('uploads[]', fileObj , fileObj.name);

    $.ajax({
      url: '/api/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    })
  },
  getInitialState: function() {
    return {data: {
      title : '',
      year : '',
      picture: '',
      description: '',
      technologies: []
    }};
  },
  render: function() {
    return (
      <div>
        <ProjectForm onProjectSubmit={this.handleProjectSubmit} data={this.state.data} projectID={this.props.params.project_id} />
      </div>
    );
  }
});

ProjectFormPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var YearsSelect = React.createClass({
  onSelectChange: function(e) {
    this.props.onSelectChange(e.target.value);
  },
  render: function() {
    var currentYear = new Date().getFullYear();
    var years = [];
    var startYear = 2010;

    while (startYear <= currentYear) {
      years.push(startYear++);
    }

    var yearItems = years.map(function(item) {
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

var ProjectForm = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  componentDidMount: function() {
    $('.tag-input input').addClass('form-control').attr('id', 'projectTechnologies').blur();

    if (this.props.projectID) {
      var projectID = this.props.projectID;

      this.serverRequest = $.ajax({
        url: '/api/projects/' + projectID,
        dataType: 'json',
        cache: false,
        success: function(data) {
          // console.log(data);
          this.setState(data[0]);

          var imgCtr = $('<img/>').prop('src', '/uploads/projects/' + projectID + '/' +  data[0]['picture']);
          $('#imgContainer').html(imgCtr);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.route.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  componentWillUnmount: function() {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleYearChange: function(value) {
    this.setState({year: value});
  },
  handleDescriptionChange: function(e) {
    this.setState({description: e.target.value});
  },
  handleTechnologyChange: function(tags) {
    this.setState({technologies: tags});
  },
  handleDelete: function(i) {
      var tags = this.state.technologies;
      tags.splice(i, 1);
      this.handleTechnologyChange(tags);
  },
  handleAddition: function(tag) {
      var tags = this.state.technologies;
      tags.push({
          _id: tags.length + 1,
          text: tag
      });
      this.handleTechnologyChange(tags);
  },
  handleDrag: function(tag, currPos, newPos) {
      var tags = this.state.technologies;

      // mutate array
      tags.splice(currPos, 1);
      tags.splice(newPos, 0, tag);

      // re-render
      this.handleTechnologyChange(tags);
  },
  handlePictureChange: function(e) {
    // console.log(e.target);
    localStorage.removeItem("imgData")
    var reader = new FileReader();
    reader.onload = function () {
        var thisImage = reader.result;
        localStorage.setItem("imgData", thisImage);
    };
    reader.readAsDataURL(e.target.files[0]);

    setTimeout(function() {
      var dataImage = localStorage.getItem('imgData');
      var imgCtr = $('<img/>').prop('src', dataImage);
      $('#imgContainer').html(imgCtr);
    }, 500);

    this.setState({picture: e.target.files[0].name});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var year = this.state.year;
    var description = this.state.description.trim();
    var technologies = this.state.technologies;
    var pictureName = this.state.picture;
    var pictureObj = $('#imgContainer img');

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!title || !year || !description || technologies.length == 0 || pictureObj.length == 0) {
      $('#form-message').show();
    }

    if (!title) {
      $('#projectTitle').addClass('required');
      this.setState({formMessage: 'Please put in title.'});
    } else if (!year) {
      $('#projectYear').addClass('required');
      this.setState({formMessage: 'Please put in year.'});
    } else if (!description) {
      $('#projectDescription').addClass('required');
      this.setState({formMessage: 'Please put in description.'});
    } else if (technologies.length == 0) {
      $('#projectTechnologies').addClass('required');
      this.setState({formMessage: 'Please put in at least one technology.'});
    } else if (pictureObj.length == 0) {
      this.setState({formMessage: 'Please upload a screenshot.'});
    } else {
      this.props.onProjectSubmit({
        title: title,
        year: year,
        picture: pictureName,
        description: description,
        technologies: technologies
      });
    }

  },
  render: function() {
    return (
      <div id="project-form" className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <p id="form-message">{this.state.formMessage}</p>
            <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
              <fieldset className="form-group">
                <label htmlFor="projectTitle">Title</label>
                <input type="text" className="form-control" id="projectTitle" value={this.state.title} onChange={this.handleTitleChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectYear">Year of completion</label>
                <YearsSelect value={this.state.year} onSelectChange={this.handleYearChange} />
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <textarea className="form-control" id="projectDescription" rows="4"  value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
              </fieldset>
              <fieldset className="form-group">
                <label htmlFor="projectTechnologies">Technologies</label>
                <ReactTags tags={this.state.technologies}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
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
                <input type="file" className="form-control-file" id="projectPicture"  onChange={this.handlePictureChange} />
                <div id="imgContainer"></div>
              </fieldset>
              <button type="submit" className="btn btn-primary">Save Project</button>
            </form>
          </div>
      </div>
    )
  }
});
// public/js/components/project-view.js

var ProjectViewPage = React.createClass({
  loadProject: function() {
    var projectID = this.props.params.project_id;

    $.ajax({
      url: this.props.route.url + projectID,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  goToProjectEdit: function(id) {
    this.context.router.push('/project/' + id + '/edit');
  },
  handleProjectDelete: function(id) {
    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        this.context.router.push('/projects');
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: '[]'};
  },
  componentDidMount: function() {
    this.loadProject();
  },
  render: function() {
    return (
      <div>
        <Project data={this.state.data} onProjectEdit={this.goToProjectEdit} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectViewPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var Project = React.createClass({
  editProject: function() {
    this.props.onProjectEdit(this.props.data[0]._id);
  },
  deleteProject: function() {
    var propsObj = this.props;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function() {
      propsObj.onProjectDelete(propsObj.data[0]._id);
    });
  },
  render: function() {
    var id = this.props.data[0]._id;
    var title = this.props.data[0].title;
    var picSrc = '/uploads/projects/' + id + '/' + this.props.data[0].picture;
    var description = this.props.data[0].description;
    var tags = this.props.data[0].technologies;

    if (tags) {
      var count = 0;
      var tagItems = tags.map(function(item) {
        return (
          <span key={item._id} className="tag">{item.text}</span>
        );
      });
    }

    return (
      <div>
        <h1>{title}</h1>
        <p>
          <a className="utility-link" onClick={this.editProject}><small>Edit</small></a>
          <a className="utility-link" onClick={this.deleteProject}><small>Delete</small></a>
        </p>
        <p><img src={picSrc} /></p>
        <p>{tagItems}</p>
        <p>{description}</p>
      </div>
    )
  }
});
// public/js/components/projects-list.js

var ProjectsPage = React.createClass({
  loadProjectsList: function() {
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  goToProjectEdit: function(id) {
    this.context.router.push('/project/' + id + '/edit');
  },
  handleProjectDelete: function(id) {
    $.ajax({
      url: this.props.route.url + id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        this.setState({data: data});
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
    this.loadProjectsList();
  },
  render: function() {
    return (
      <div>
        <Link to="/project/new" className="btn btn-primary">New Project</Link>
        <ProjectsList data={this.state.data} onProjectEdit={this.goToProjectEdit} onProjectDelete={this.handleProjectDelete} />
      </div>
    );
  }
});

ProjectsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

var ProjectsList = React.createClass({
  render: function() {
    var projectEditFunc = this.props.onProjectEdit;
    var projectDeleteFunc = this.props.onProjectDelete;
    var projectItems = this.props.data.map(function(item) {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id} key={item._id} onProjectEdit={projectEditFunc} onProjectDelete={projectDeleteFunc} />
      );
    });

    return (
      <div id="projects-list" className="container">
        <div className="row">
          {projectItems}
        </div>
      </div>
    )
  }
});

var ProjectItem = React.createClass({
  editProject: function() {
    this.props.onProjectEdit(this.props.id);
  },
  deleteProject: function() {
    var propsObj = this.props;

    confirmAction('Are you sure?', {
      description: 'Would you like to delete this project?',
      confirmLabel: 'Delete',
      abortLabel: 'Cancel'
    }).then(function() {
      propsObj.onProjectDelete(propsObj.id);
    });
  },
  render: function() {
    return (
      <div className="box col-md-6 col-lg-4">
        <div className="box-img">
          <img src={'/uploads/projects/' + this.props.id + '/' + this.props.img} alt="Card image cap" />
        </div>
        <div className="box-content">
          <h4 className="box-title"><Link to={'/project/' + this.props.id}>{this.props.title}</Link></h4>
          <p className="box-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          <p>
            <a className="utility-link" onClick={this.editProject}><small>Edit</small></a>
            <a className="utility-link" onClick={this.deleteProject}><small>Delete</small></a>
          </p>
        </div>
      </div>
    )
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

var App = React.createClass({
  render: function() {
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
        <div id="content">{this.props.children}</div>
        <footer>
        </footer>
      </div>
    );
  }
});

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="todos" url="/api/todos" component={TodoBox} />
      <Route path="projects" url="/api/projects/" component={ProjectsPage} />
      <Route path="project/new" url="/api/projects/" component={ProjectFormPage} />
      <Route path="project/:project_id" url="/api/projects/" component={ProjectViewPage} />
      <Route path="project/:project_id/edit" url="/api/projects/" component={ProjectFormPage} />
    </Route>
  </Router>,
  document.getElementById('main')
);
