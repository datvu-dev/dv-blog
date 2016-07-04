// app/models/project.js
var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    title : String,
    year : Number,
    picture: String,
    description: String,
    technologies: [{_id: Number, text: String}]
});
