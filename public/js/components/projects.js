// js/projects.js

var ProjectsList = React.createClass({
  loadProjectsList: function() {
    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  loadSingleProject: function(project_id) {
    $.ajax({
      url: this.props.route.url + '/' + project_id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        // this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    });
  },
  handleProjectSubmit: function(item, pic) {
    var items = this.state.data;
    var newItems = items.concat([item]);
    this.setState({data: newItems});
    console.log(item);

    $.ajax({
      url: this.props.route.url,
      dataType: 'json',
      type: 'POST',
      data: item,
      success: function(data) {
        console.log(data);

        this.handleUpload();
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: items});
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
        console.log(formData);
        console.log('upload complete');
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.route.url, status, err.toString());
      }.bind(this)
    })
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
        <ProjectsList data={this.state.data} />
        <ProjectForm onProjectSubmit={this.handleProjectSubmit} />
      </div>
    );
  }
});

var ProjectsList = React.createClass({
  render: function() {
    var projectItems = this.props.data.map(function(item) {
      return (
        <ProjectItem title={item.title} img={item.picture} id={item._id} key={item._id} />
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
    console.log(this.props.id);
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

var ProjectForm = React.createClass({
  getInitialState: function() {
    return {
      title : this.state.title,
      year : this.state.year,
      picture: '',
      description: this.state.description,
      technologies: ''
    };
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
    console.log(e.target);
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

    this.setState({picture: e.target.files[0]});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var year = this.state.year;
    var description = this.state.description.trim();
    var picture = this.state.picture.name;
    var picObj = {name: picture, path: $('#imgContainer img').attr('src')};

    if (!title || !year || !description) {
      return;
    }

    this.props.onProjectSubmit({
      title: title,
      year: year,
      picture: picture,
      description: description,
      technologies: 'Angular JS'
    }, picObj);

    this.setState({
      title : '',
      year : null,
      picture: '',
      description: '',
      technologies: ''
    });
  },
  render: function() {
    return (
      <div id="project-form" className="row">
          <div className="col-sm-8 col-sm-offset-2 text-center">
            <form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
              <fieldset className="form-group">
                <label for="projectTitle">Title</label>
                <input type="text" className="form-control" id="projectTitle" value={this.state.title} onChange={this.handleTitleChange} />
              </fieldset>
              <fieldset className="form-group">
                <label for="projectYear">Year of completion</label>
                <select className="form-control" id="projectYear" selected={this.state.year} onChange={this.handleYearChange}>
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
                <label for="projectPicture">Screenshots</label>
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
