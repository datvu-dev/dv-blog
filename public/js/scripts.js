var Home = React.createClass({
  render: function() {
    return (<h1>Welcome to the Home Page</h1>);
  }
});
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

        this.props.history.push('/projects');
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
      year : null,
      picture: '',
      description: '',
      technologies: ''
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

var ProjectForm = React.createClass({
  getInitialState: function() {
    return this.props.data;
  },
  componentDidMount: function() {
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
  handleYearChange: function(e) {
    this.setState({year: e.target.value});
  },
  handleDescriptionChange: function(e) {
    this.setState({description: e.target.value});
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
    var pictureName = this.state.picture;
    var pictureObj = $('#imgContainer img');

    $('#form-message').hide();
    $('.form-control').removeClass('required');

    if (!title || !year || !description || pictureObj.length == 0) {
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
    } else if (pictureObj.length == 0) {
      this.setState({formMessage: 'Please upload a screenshot.'});
    } else {
      this.props.onProjectSubmit({
        title: title,
        year: year,
        picture: pictureName,
        description: description,
        technologies: 'Angular JS'
      });
    }

  },
  render: function() {
    return (
      <div id="project-form" className="row">
          <div className="col-sm-8 col-sm-offset-2 text-center">
            <p id="form-message">{this.state.formMessage}</p>
            <form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
              <fieldset className="form-group">
                <label for="projectTitle">Title</label>
                <input type="text" className="form-control" id="projectTitle" value={this.state.title} onChange={this.handleTitleChange} />
              </fieldset>
              <fieldset className="form-group">
                <label for="projectYear">Year of completion</label>
                <select className="form-control" id="projectYear" value={this.state.year} onChange={this.handleYearChange}>
                  <option>2012</option>
                  <option>2013</option>
                  <option>2014</option>
                  <option>2015</option>
                  <option>2016</option>
                </select>
              </fieldset>
              <fieldset className="form-group">
                <label for="projectDescription">Description</label>
                <textarea className="form-control" id="projectDescription" rows="4"  value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
              </fieldset>
              <fieldset className="form-group">
                <label for="projectPicture">Screenshot</label>
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
// js/projects.js

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
    this.props.history.push('/project/' + id + '/edit');
  },
  handleProjectDelete: function(id) {
    $.ajax({
      url: '/api/projects/' + id,
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
    this.loadProjectsList();
  },
  render: function() {
    return (
      <div>
        <Link to="/project/new" className="btn btn-primary">New Project</Link>
        <ProjectsList data={this.state.data} onProjectEdit={this.goToProjectEdit} />
      </div>
    );
  }
});

var ProjectsList = React.createClass({
  render: function() {
    var projectEditFunc = this.props.onProjectEdit;
    var projectItems = this.props.data.map(function(item) {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id} key={item._id} onProjectEdit={projectEditFunc} />
      );
    });

    return (
      <div id="projects-list">
        {projectItems}
      </div>
    )
  }
});

var ProjectItem = React.createClass({
  editProject: function() {
    this.props.onProjectEdit(this.props.id);
  },
  render: function() {
    return (
      <div className="card">
        <img className="card-img-top" data-src="{this.props.img}" alt="Card image cap" />
        <div className="card-block">
          <h4 className="card-title">{this.props.title}</h4>
          <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          <p><small><a onClick={this.editProject}>Edit</a></small></p>
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
// app-render.js

var {Router, Route, IndexRoute, IndexLink, Link} = ReactRouter;

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
        <div id="main-content">{this.props.children}</div>
        <footer>
        </footer>
      </div>
    );
  }
});

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="todos" url="/api/todos" component={TodoBox} />
      <Route path="projects" url="/api/projects/" component={ProjectsPage} />
      <Route path="project/new" url="/api/projects/" component={ProjectFormPage} />
      <Route path="project/:project_id/edit" url="/api/projects/" component={ProjectFormPage} />
    </Route>
  </Router>,
  document.getElementById('container')
);
