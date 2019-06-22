module.exports = function(app) {

	var mycontroller = require('../controllers/mycontroller.js');

	app.get('/listUsers', mycontroller.listUsers);

	app.get('/gridview', mycontroller.gridView);
	
	app.get('/chargePts', mycontroller.chargingPoints);

}