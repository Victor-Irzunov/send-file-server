// https://www.youtube.com/watch?v=OGiePuJqq2M&list=PLM7wFzahDYnHYn81-oqavYIp6vaEd5gdH&index=16
// Загрузка файла на сервер на чистой Node.js
// WebDev с нуля. Канал Алекса Лущенко

function uploadFile_f_3(event) {
	event.preventDefault()

	// let target = event.target || event.srcElement || event.currentTarget            //кросбраузернасть
	let target = event.target
	let file = target.files[0]

	console.log("запущена ф-ция: f_3  const file: ", file)


	let xhr = new XMLHttpRequest()

	xhr.open('POST', '/uploads/' + file.name, true)                        //'/uploads' - куда грузить файл        (куда на севере будет отправляться наш файл)

	//++ посылаем загаловки
	xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryhyDIhnu4zuaQQUeb')
	// xhr.setRequestHeader('Content-Type', 'application/octate-stream;');


	//++Вызывает функцию когда меняется состояние запроса
	xhr.onreadystatechange = function () {
		console.log('запуск ф-ции состояния')
		event = null
		if (xhr.readyState === 4) {                  //*
			if (xhr.status === 200) {
				// Запрос завершен. Здесь можно обрабатывать результат.
				f_4(this.responseText)                   //responseText - возвращает текст ответа от сервера на отправленный запрос. //**
			}
			else {
				console.log('Витя ошибка в состоянии запроса')
			}
		}
	}

	//++ отправляем

	//  var formData = new FormData(); // Создаем объект формы.
	// // // form.append('path', '/'); // Определяем корневой путь.
	// // // for (var i = 0; i < file.length; i++) {
	// // // 	form.append('file[]', file[i]); // Прикрепляем к форме все загружаемые файлы.
	// // // }
	// formData.append("img", 'file')


	xhr.send(file)
	event.target.value = ''                       //можно обойтись и без обнуления
}



function f_4(data) {
	console.log(`%c ф-ция f_4 вот входящие данные: ${data}`, 'background: #00ffff; color: #ff0000;')


	document.querySelector('.icon-image').src = 'images/' + data
	document.querySelector('input[name="imagename"]').value = data
}


document.querySelector('#upload').addEventListener('change', uploadFile_f_3)

//*
//? Объект XHR может иметь следующие состояния:
// 0	UNSENT	Объект был создан. Метод open() ещё не вызывался.
// 1	OPENED	Метод open() был вызван.
// 2	HEADERS_RECEIVED	Метод send() был вызван, доступны заголовки (headers) и статус.
// 3	LOADING	Загрузка; responseText содержит частичные данные.
// 4	DONE	Операция полностью завершена.

//**
// Во время выполнения асинхронных запросов, в значении responseText всегда
// находится текущее содержимое, полученное от сервера, даже если запрос еще не завершен, и данные от сервера не получены полностью.

// Понять, что ответ получен полностью, можно когда значение readyState становится XMLHttpRequest.DONE (4), а значение status становится 200 ("OK").
