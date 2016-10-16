const request = require('request');

function giphy(text, callback) {
    let url = 'http://api.giphy.com/v1/gifs/search';
        query = text.split(' ').join('+'),
        api = 'dc6zaTOxFJmzC';

    url = `${url}?q=${query}&api_key=${api}`;
    request(url, (err, msg, body) => {
        let res = JSON.parse(body);
        callback(res.data[0].images.fixed_height.url);
    });
}

//giphy("dank memes", console.log);

exports = giphy;