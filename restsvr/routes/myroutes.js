module.exports = function(app) {
//export default function(app) {
	var apicontroller = require('../controllers/apicontroller.js');
	var mycontroller = require('../controllers/mycontroller.js');
	var jsoncontroller = require('../controllers/jsoncontroller.js');
	var ctcontroller = require('../controllers/ctcontroller.js');

	app.post('/api/rec/addnew', apicontroller.newItem);
	app.post('/api/rec/update', apicontroller.updateItem);
	app.delete('/api/rec/:id', apicontroller.deleteItem);
	app.get('/api/rec/list', apicontroller.allItems);
	
	//
	app.post('/form/addnew', mycontroller.htmlPost);
	app.post('/page/addnew', mycontroller.pagePost);

	// http client
	app.get('/ack/:tagId', mycontroller.getPathParam);

	app.get('/ackjson', mycontroller.getQryParam);
	
	// btntabs.html
	app.post('/ackjson', mycontroller.postResp);
	
	// container
	app.get('/data/:id', ctcontroller.getPathParam);
	app.get('/update/:id', ctcontroller.updateState);	
	app.post('/upload/state', ctcontroller.receiveUpdate);
	
	// app2 routes
	app.post('/form2/data', jsoncontroller.ackdata);
}
