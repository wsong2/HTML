module.exports = function(app) {

	var mycontroller = require('../controllers/mycontroller.js');

	app.get('/gridview', mycontroller.gridView);
	
	app.get('/chargePts', mycontroller.chargingPoints);
	
	app.post('/simjson', mycontroller.postResp);
}