module.exports = function(app) {

	var mycontroller = require('../controllers/mycontroller.js');

	app.get('/listUsers', mycontroller.listUsers);

}