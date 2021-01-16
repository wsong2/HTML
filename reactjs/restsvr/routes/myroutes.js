module.exports = function(app) {

	var mycontroller = require('../controllers/mycontroller.js');

	app.get('/gridview', mycontroller.gridView);
	
	app.get('/api/rec/list', mycontroller.allItems);
	app.delete('/api/rec/:id', mycontroller.deleteItem);
	
	app.post('/simjson', mycontroller.postResp);
	
}