const http = require('http')
const path = require('path')
const fs = require('fs')
const os = require('os')
const chalk = require('chalk')
const colors = require('colors')
const Busboy = require('busboy')
// const FormData = require('form-data')


// console.log('hello'.green)
// console.log(colors.green('hello'))

// console.log('i like cake and pies'.underline.red)
// console.log(colors.red.underline('i like cake and pies'))

// console.log('inverse the color'.inverse)
// console.log(colors.inverse('inverse the color'))

// console.log('OMG Rainbows!'.rainbow)
// console.log(colors.rainbow('OMG Rainbows!'))

// console.log(colors.bgCyan.black('dfbzdfbdfbzdfb'))




//! Cервер для статики (запрашивать и отдовать статику):

http.createServer((req, res) => {

	if (req.url === '/') {                        //корень

		sendRes_f_1('index.html', 'text/html', res)                 //res - чтобы могла ответить за меня    //? text/html -MIME
	}
	else if (/\/uploads\/[^\/]+$/.test(req.url) && req.method === 'POST') {
		console.log(colors.bgCyan.black('if "/uploads/" запуск ф-ции сохранения: '))

		saveUploadFile(req, res)

	}
	else {
		sendRes_f_1(req.url, getContentType_f_2(req.url), res)
	}
	//----------------------------------------------------------------------------
	function saveUploadFile(req, res) {
		console.log('ф-ция сохранения запущена, ждем события.. '.inverse)
		try {
			//_______________________________________________________________________________
			const busboy = new Busboy({ headers: req.headers });

			busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

				console.log('НАКОНЕЦ-ТО запуск события (busboy.on): '.inverse)

				var saveTo = path.join(__dirname, 'uploads', path.basename(filename))

				console.log('файл сохранен !!! (saveTo): ', saveTo)

				file.pipe(fs.createWriteStream(saveTo));
			});
			// busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
			// 	console.log('Жопа [' + fieldname + ']: value: ' + inspect(val));
			// })
			// busboy.on('error', function (error) {
			// 	console.log(chalk.red(error))
			// })
			const filepath = path.join(__dirname + req.url)

			busboy.on('finish', function () {
				console.log('busboy.on "finish"'.inverse)

				res.writeHead(200, { 'Connection': 'close' });
				res.end(path.basename(filepath));
			});
			return req.pipe(busboy);

			// res.writeHead(404);
			// res.end();
			//_______________________________________________________________________________
			// let a = path.parse(req.url).base
			// let b = filepath
			// let c = path.join(__dirname + '/static/images/', a)
			// let d = '/images/' + a
			// fs.rename(b, c, err => {
			// 	if (err) {
			// 		console.log(chalk.red('ошибка: ', err))
			// 	}
			// })

			sendRes_f_1(d, getContentType_f_2(req.url), res)
		}
		catch (e) {
			console.log(chalk.red('Ошибка Витя: ', e))
		}

	}
	//---------------------------------------------------------------------------------------------------------

	//++ отправка
	function sendRes_f_1(url, contentType, res) {

		let file = path.join(__dirname + '/static/', url)

		fs.readFile(file, (err, content) => {                               //content - то что прочитал  //err ошибка в чтении
			if (err) {
				res.writeHead(404)                                             //устанавл правил заголовок
				res.write('::::...file nor found...::::')                      //ответ для тех кто будет обрабатывать (не обязательно)
				res.end()
				console.log(chalk.red(`Витя ошибка 404, сервер не прочитал || файла нет: ${file}`))     //для себя
				//? если ничего не написать сервер будет зависать
			}
			else {
				res.writeHead(200, { 'Content-Type': contentType })
				res.write(content)
				res.end()
				console.log(chalk.blue(`Status: 200, сервер отдал файл: ${file}`))
				if (path.extname(file) === '.jpg') {
					console.log(colors.rainbow(`Ураааааааа!!!! ${file} `))
				}
			}
		})
	}

	//++ тип контента
	function getContentType_f_2(url) {
		switch (path.extname(url)) {                 //.extname - вытащить из url расширение файла
			case ".html":
				return "text/html";
			case ".css":
				return "text/css";
			case ".js":
				return "text/javascript";
			case ".json":
				return "aplication/json";
			// case ".jpg":
			// 	return "image/jpg";
			// case ".jpeg":
			// 	return "image/jpg";
			default:
				return "application/octate-stream";                           //просто вычитать и отдать
		}
	}







}).listen((3000), () => console.log(chalk.cyan(':::::::::......Сервер запучен (порт: 3000)......:::::::::::::')))
