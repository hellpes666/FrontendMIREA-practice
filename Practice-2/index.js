const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
	if (req.url === "/") {
		const filePath = path.join(__dirname, "index.html");

		fs.readFile(filePath, (err, data) => {
			if (err) {
				res.writeHead(500, {
					"Content-Type": "text/plain; charset=UTF-8",
				});
				return res.end("Ошибка загрузки файла");
			}

			res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
			res.end(data);
		});
	} else {
		res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
		res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 Не найдено</title>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>Страница не найдена</h1>
                <p>${req.url} не существует</p>
            </body>
            </html>
        `);
	}
});

const port = 666;
server.listen(port, () => {
	console.log(`Сервер работает на http://localhost:${port}`);
});
