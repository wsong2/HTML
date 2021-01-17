module.exports = function(app) {

	var apicontroller = require('../controllers/apicontroller.js');
	var mycontroller = require('../controllers/mycontroller.js');

	app.post('/api/rec/addnew', apicontroller.newItem);
	app.get('/api/rec/list', apicontroller.allItems);
	app.delete('/api/rec/:id', apicontroller.deleteItem);
	
	//
	app.post('/form/addnew', mycontroller.htmlPost);

	app.get('/gridview', mycontroller.gridView);

	// http client
	app.get('/ack/:tagId', mycontroller.getPathParam);

	app.get('/ackjson', mycontroller.getQryParam);
	
	app.post('/ackjson', mycontroller.postResp);
	
}