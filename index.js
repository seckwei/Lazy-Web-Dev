'use strict';

const express = require('express'), 
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    randomWord = require('random-words');

const PORT = process.env.PORT || '8080',
    ENV = (process.env.NODE_ENV)? 'prod' : 'dev';

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Ignore favicon
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(200);
});

// Home page
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if(!process.env.NODE_ENV){
            data = data.toString().replace(/https/gi, 'http');
        }
        res.send(data);
    });
});


const DEFAULT = {
    ID: 'defaultID',
    ELEMENT: 'div',
    WIDTH: 'auto',
    HEIGHT: 'auto',
    BG: 'transparent',
    CONTENT: '',
    UNITS: 'px'
};

const autoElem = ['p', 'ol', 'ul', 'li', 'h1', 'img'];
function isAutoElem(elem){
    return autoElem.some((item)=>{
        return elem === item;
    });
}

function processElement(data, DEFAULT){
    let element = {
        id : data.id || randomWord(),
        element : data.element || DEFAULT.ELEMENT,
        units : data.units || DEFAULT.UNITS,
        width : (data.width || (!isAutoElem(data.element)? '100' : DEFAULT.WIDTH)).toString(),
        height : (data.height || (!isAutoElem(data.element)? '100' : DEFAULT.HEIGHT)).toString(),
        bg : data.bg || DEFAULT.BG,
        content : data.content || DEFAULT.CONTENT
    }
    element.width = element.width.replace(/auto(px|\%)/gi, 'auto');
    element.height = element.height.replace(/auto(px|\%)/gi, 'auto');

    return element;
}

// API - Receive POST data
app.post('/data', (req, res) => {
    console.log('Data posted', req.body);

    let body = req.body,
        action = body.action || undefined,
        message = {};

    switch(action){
        case 'create': {
            // Nested elements
            if(body.parent && body.children){
                message.parent = processElement(body.parent, DEFAULT);
                message.children = {};
                message.children.child = processElement(body.children.child, DEFAULT);
                message.children.ID = randomWord(parseInt(body.children.amount));
            }
            // Default single element
            else {
                message = processElement(body, DEFAULT);
            }
            break;
        }
        case 'edit': {
            message = {
                id: body.id,
                height: body.height || null,
                width: body.width || null,
                bg: body.bg || null
            };
            break;
        }
        case 'delete': {
            message = {
                id: body.id
            };
            break;
        }
        case 'bootstrap': {
            message = body;
            break;
        }
    }
    message.action = action;
    io.emit('message', message);

    console.log('Data sent to client');
    console.log(message);

    res.send('OK');
});

// Server-side Sockets
io.on('connection', function (socket) {
    console.log('Client connected');
});