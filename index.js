const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser');

const PORT = process.env.PORT || '8080';

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

app.use(bodyParser.json());

// Home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ignore favicon
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(200);
});

// API - Receive POST data
app.post('/data', (req, res) => {
    console.log('Data posted', req.body);
    let body = req.body;

    io.emit('create', {
        element: body.element,
        width: body.width,
        height: body.height,
        bg: body.bg,
        id: body.id
    });

    res.send('OK');
});

// Server-side Sockets
io.on('connection', function (socket) {
    console.log('Client connected');
});