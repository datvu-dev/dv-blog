// public/js/pages/project-form.js

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
      technologies: [],
      suggestions: []
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
  getTagSuggestions: function() {
    var skillsUrl = 'http://trendyskills.com/service?q=keywords&key=77MGlB3wzQbD9KfZ';

    $.ajax({
      url: skillsUrl,
      method: 'GET',
      dataType: 'jsonp',
      success: function(res) {
        var suggestionsArr = [];

        res.keywords.map(function(item) {
          suggestionsArr.push(item.keyName);
        });

        this.setState({suggestions: suggestionsArr});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
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

    this.getTagSuggestions();
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
