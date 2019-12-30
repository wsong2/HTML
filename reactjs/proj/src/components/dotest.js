//import { log_record } from './helper.js';
const hlper = require('./helper.js');

var log1 = hlper.log_record();

log1.addMessage(3, 'Msg 3');
log1.addMessage(1, 'abc');
log1.addMessage(3, '123z');

var log2 = hlper.log_record();
log2.addMessage(2, '123 777');
log2.addMessage(1, 'SWX');
log2.addMessage(3, 'msg##1');

var arr = log1.getList();
arr.forEach(m => {
	console.log('1> ' + m);
});

arr = log2.getList();
arr.forEach(m => {
	console.log('2> ' + m);
});