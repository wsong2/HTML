module.exports = function(app) {

	var mycontroller = require('../controllers/mycontroller.js');

	app.get('/gridview', mycontroller.gridView);
	
	app.get('/rec/list', mycontroller.allItems);	//
	
	app.post('/simjson', mycontroller.postResp);
	
}