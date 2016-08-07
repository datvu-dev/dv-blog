// app/routes.js

// set up modules
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

// load the models
var Todo = require('./models/todo');
var Project = require('./models/project');
var Qualification = require('./models/qualification');

// subpath for uploading files
var uploadSubPath = '';

// check if a directory exists, if not, create one
function checkDirectorySync(directory) {
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}

// APIs
module.exports = function(app) {

  // PROJECTS
  // get all projects
  app.get('/api/projects', function(req, res) {
      Project.find(function(err, projects) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err)
              res.send(err)

          res.json(projects);
      });
  });

  // get project by id
  app.get('/api/projects/:project_id', function(req, res) {
      var projectID = req.params.project_id;
      Project.find({ _id: projectID}, function(err, project) {
          if (err)
              res.send(err);

          res.json(project);
      });

  });

  // create new project
  app.post('/api/projects', function(req, res) {
      Project.create({
          title : req.body.title,
          year : req.body.year,
          picture: req.body.picture,
          description: req.body.description,
          technologies: req.body.technologies
      }, function(err, projects) {
          if (err)
              res.send(err);

          // get and return all the projects after you create another
          Project.find(function(err, projects) {
              if (err)
                  res.send(err)

              var newProject = projects[projects.length - 1];
              uploadSubPath = 'projects/' + newProject._id + '/';
              res.send(newProject);
          });
      });
  });

  // update an existing project
  app.post('/api/projects/:project_id', function(req, res) {
    var projectID = req.params.project_id;

    Project.update({ _id: projectID}, { $set: {
      title : req.body.title,
      year : req.body.year,
      picture: req.body.picture,
      description: req.body.description,
      technologies: req.body.technologies
    }}, function(err, projects) {
        if (err)
            res.send(err);

        uploadSubPath = 'projects/' + projectID + '/';

        Project.find({ _id: projectID}, function(err, project) {
            if (err)
                res.send(err);

            res.json(project);
        });
    });
  });

  // upload files
  app.post('/api/upload', function(req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // check if the project directory exists, if not, create one
    checkDirectorySync(path.join(__dirname, '../public/uploads/' + uploadSubPath));

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../public/uploads/' + uploadSubPath);

    // reset upload subpath
    uploadSubPath = '';

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name), function(err) {
        if (err) {
          throw err;
        }
      });
    });

    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
      res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
  });

  // delete a project
  app.delete('/api/projects/:project_id', function(req, res) {
      var projectID = req.params.project_id;

      Project.remove({
          _id : projectID
      }, function(err, project) {
          if (err)
              res.send(err);

          var filePath = path.join(__dirname, '../public/uploads/projects/' + projectID);

          // get project file
          fs.readdir(filePath, function(err, files) {
            if (err) {
              throw err;
            }

            // remove file
            fs.unlink(filePath + '/' + files[0], function(err) {
              if (err) {
                throw err;
              }

              // remove folder that contains project file
              fs.rmdir(filePath, function(err) {
                if (err) {
                  throw err;
                }
              });
            });
          });

          // get and return all the projects
          Project.find(function(err, projects) {
              if (err)
                  res.send(err)
              res.json(projects);
          });
      });
  });

  // QUALIFICATION
  // get all qualifications
  app.get('/api/resume/qualification', function(req, res) {
      Qualification.find(function(err, qualifications) {
          if (err)
              res.send(err)

          res.json(qualifications);
      });
  });

  // get qualification by id
  app.get('/api/resume/qualification/:id', function(req, res) {
      var id = req.params.id;

      Qualification.find({ _id: id}, function(err, item) {
          if (err)
              res.send(err);

          res.json(item);
      });

  });

  // add new qualification
  app.post('/api/resume/qualification', function(req, res) {
      Qualification.create({
          school : req.body.school,
          course : req.body.course,
          year: req.body.year,
          description: req.body.description,
      }, function(err, item) {
          if (err)
              res.send(err);

          res.json(item);
      });
  });

  // update an existing qualification
  app.post('/api/resume/qualification/:id', function(req, res) {
    var id = req.params.id;

    Qualification.update({ _id: id}, { $set: {
      school : req.body.school,
      course : req.body.course,
      year: req.body.year,
      description: req.body.description,
    }}, function(err, item) {
        if (err)
            res.send(err);

        res.json(item);
    });
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
      res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

};
