const express = require('express');
const httpProxy = require('http-proxy')

const app = express();

var proxy = httpProxy.createProxyServer({});

app.use('/', express.static('public'))
app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.all('/todos/*', async (req, res) => {
	const target = process.env.BACKEND_URL + req.path.replace(/^\/todos/, '');
	proxy.web(req, res, { 
		target: target,
		ignorePath: true
	});
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server listening on port ${port}`));
