var http = require('http'),
	path = require('path'),
	os = require('os'),
	fs = require('fs');

var Busboy = require('busboy');

http.createServer(function (req, res) {
	if (req.url === '/') {
		fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
			if (err) {
				throw err
			}
			res.writeHead(200, {
				"Content-Type": "text/html"
			})
			res.end(data)
		})
		if (req.url === '/' && req.method === 'POST') {

			var busboy = new Busboy({ headers: req.headers });
			busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

				var saveTo = path.join(__dirname, 'uploads', path.basename(filename));
				file.pipe(fs.createWriteStream(saveTo));
			});
			busboy.on('finish', function () {
				res.writeHead(200, { 'Connection': 'close' });
				res.end("Good !");
			});
			return req.pipe(busboy);
		}
		// res.writeHead(404);
		// res.end();
	}

}).listen(8001, function () {
	console.log('Запущено');
});