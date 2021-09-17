//!  РАБОЧИЙ ВАРИАНТ


const http = require('http')
const path = require('path')
const os = require('os')
const chalk = require('chalk')
const colors = require('colors')
const fse = require('fs-extra')
var formidable = require('formidable')


http.createServer(function (req, res) {
    console.log('req.url: ', req.url)

    if (req.url == '/uploads' && req.method === 'POST') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let name = path.basename(files.filetoupload.path)
            let newPath = 'D:/Programming/Libery_NODE.js/WebDev_send_file_server' + req.url + '/' + name
            let oldPath = path.dirname(files.filetoupload.path)
            let fullPath = files.filetoupload.path

            fse.copy(fullPath, newPath + ".jpg", err => {
                if (err) return console.error(err)
                console.log('success!')
            })
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<form action="uploads" method="post" enctype="multipart/form-data">');
            res.write('<input type="file" name="filetoupload"><br>');
            res.write('<input type="submit">');
            res.write('</form>');
            res.end();
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="uploads" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(3000);
