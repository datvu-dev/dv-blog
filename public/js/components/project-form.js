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
