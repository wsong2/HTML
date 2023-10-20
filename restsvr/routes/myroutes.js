import * as apicontroller from '../controllers/apicontroller.js';
import * as mycontroller from '../controllers/mycontroller.js';
import * as ctcontroller from '../controllers/ctcontroller.js';

export default function(app) {	
	mycontroller.init();

	app.post('/api/rec/addnew', apicontroller.newItem);
	app.post('/api/rec/update', apicontroller.updateItem);	// react tab3.js Update (submit button)
	app.delete('/api/rec/:id', apicontroller.deleteItem);
	app.get('/api/rec/list', apicontroller.allItems);		// react tab3.js Load
	
	// btntabs.html
	// -- tab Diagnosis
	app.post('/form/submit', mycontroller.htmlPost);
	app.get('/ack/:tagId', mycontroller.getPathParam);
	app.get('/ackjson', mycontroller.getQryParam);	
	// -- tab Form
	app.post('/ackjson', mycontroller.postAckJson);
	// app2 routes
	app.post('/form2/ack', mycontroller.postAckForm2);
	//
	
	// container
	app.get('/data/:id', ctcontroller.getPathParam);
	app.get('/gridview', ctcontroller.getQryParam);
	app.get('/update/:id', ctcontroller.updateState);	
	app.post('/upload/state', ctcontroller.receiveUpdate);	
}
