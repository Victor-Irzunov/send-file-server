//! только Прослушивание запросов

var http = require('http'),
	inspect = require('util').inspect;      //Если вам нужно поддерживать очень старые браузеры

var Busboy = require('busboy');

http.createServer(function (req, res) {
	if (req.method === 'POST') {
		var busboy = new Busboy({ headers: req.headers });
		busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			console.log('------File: [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

			file.on('data', function (data) {
				console.log('file.on "data": [' + fieldname + '] got ' + data.length + ' bytes');
			});

			file.on('end', function () {
				console.log('file.on "end": [' + fieldname + '] Finished');
			});
		});


		busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
			console.log('Field [' + fieldname + ']: value: ' + inspect(val));
		});

		busboy.on('finish', function () {
			console.log('Done parsing form! /Сделан синтаксический разбор формы');
			res.writeHead(303, { Connection: 'close', Location: '/' });
			res.end();
		});

		req.pipe(busboy);

	} else if (req.method === 'GET') {
		res.writeHead(200, { Connection: 'close' });
		res.end('<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
					<input type="text" name="textfield"><br />\
					<input type="file" name="filefield"><br />\
					<input type="submit">\
					</form>\
				</body></html>');
	}
}).listen(8000, function () {
	console.log('Listening for requests/Прослушивание запросов');
});