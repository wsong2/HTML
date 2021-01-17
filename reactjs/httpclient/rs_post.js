const http = require('http')

const data = JSON.stringify({
  	"code": "nodefd",
	"price": 666.55,
	"descr": "item Node5",
	"remark": "nodejs heep",
	"qty":1
})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/ackjson',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
  }
}

const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);

	let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        //console.log('Body: end');
        console.log('-- Body --');
        console.log(JSON.parse(data));
    });
})

req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end()
