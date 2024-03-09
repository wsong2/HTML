import {newItem, updateItem, deleteItem,  allItems} from '../controllers/apicontroller.js';
import * as mycontroller from '../controllers/mycontroller.js';
import * as ctcontroller from '../controllers/ctcontroller.js';

export default function(app) {
	mycontroller.init();

	app.post('/api/rec/addnew', newItem);
	app.post('/api/rec/update', updateItem);	// react tab3.js Update (submit button)
	app.delete('/api/rec/:id', deleteItem);
	app.get('/api/rec/list', allItems);		// react tab3.js Load
	
	// btntabs.html
	// -- tab Diagnosis
	app.post('/form/submit', mycontroller.htmlPost);
	app.get('/ack/:tagId',  mycontroller.getPathParam);
	app.get('/ackjson',  mycontroller.getQryParam);	
	// -- tab Form
	app.post('/ackjson',  mycontroller.postAckJson);
	// app2 routes
	app.post('/form2/ack',  mycontroller.postAckForm2);
	//
	
	// ctcontroller
	// btntabs.html DOXML tab
	app.get('/xmldata', ctcontroller.getXmlData);	
}
