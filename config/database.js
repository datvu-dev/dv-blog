// config/database.js

var local_db = 'mongodb://localhost:27017/dv_blog';
var prod_db = 'mongodb://test:Test123@ds035796.mlab.com:35796/dv-blog';

module.exports = {
    url : prod_db
};
