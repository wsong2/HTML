import express, { urlencoded, json } from 'express';
var app1 = express();
var app2 = express();

import myroutes from './routes/myroutes.js';

// app
app1.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app1.use(urlencoded({ extended: true }));
app1.use(json());
app1.use(express.static('webcontents'));

// app2
app2.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

app2.use(json());

var app = express();

app.use("/form2", app2);
app.use("/", app1);

myroutes(app);

const port = 3000;

var server = app.listen(port, function () {
  let host = server.address().address;
  // var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})
