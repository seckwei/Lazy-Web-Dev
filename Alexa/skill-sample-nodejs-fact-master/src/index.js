'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Lazy Web Dev';

var output = [
    "Looking good!",
    "Personally, I'd change that'",
    "What do you think?",
    "Have you heard of CSS? I think you should look in to it.",
    "Nice Job!",
    "I don't think you wanted to do that, did you?",
    "Oooh Fancy",
    "Now that's semantic!",
    "You're a beginner at this aren't you?"
];

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetAction');
    },
    'GetActionIntent': function () {
        this.emit('GetAction');
    },
    'GetAction': function () {

        var slots = {};
        var inputAction = '';
        var inputElement = '';
        var inputChildElement = '';
        var ObjToSend = {};
        console.log("before");
        if (this.event.request.intent) {
            slots = this.event.request.intent.slots;
            inputAction = slots.Action.value;
            console.log("switch " + inputAction);
            switch (inputAction) {

                case 'create':
                    console.log('create');
                    inputElement = element(slots.Element.value);
                    if (slots.ChildElement.value) {
                        inputChildElement = element(slots.ChildElement.value);
                    }

                    if (inputChildElement != '' && slots.Amount.value) {
                        ObjToSend = {
                            "action": inputAction,
                            "parent": {
                                "element": inputElement,
                                "width": "auto",
                                "height": "auto"
                            },
                            "children": {
                                "amount": slots.Amount.value,
                                "child": {
                                    "element": inputChildElement,
                                    "width": "auto",
                                    "height": "auto"
                                }
                            }
                        };
                    } else {
                        var height = slots.Height ? slots.Height.value : '';
                        var width = slots.Width ? slots.Width.value : '';
                        var ID = slots.ElemID ? slots.ElemID.value : '';
                        var bgColour = slots.Colour ? slots.Colour.value : '';
                        var content = slots.Text ? slots.Text.value : '';

                        ObjToSend = {
                            "action": inputAction,
                            "element": inputElement,
                            "width": width,
                            "height": height,
                            "id": ID,
                            "bg": bgColour,
                            "content": content
                        };
                    }
                    break;
                case 'delete':
                    console.log('delete');
                    ObjToSend = {
                        "action": inputAction,
                        "id": slots.ElemID ? slots.ElemID.value : ''
                    };
                    break;
                default:
                    console.log('edit');
                    var height = slots.Height ? slots.Height.value : '';
                    var width = slots.Width ? slots.Width.value : '';
                    var ID = slots.ElemID ? slots.ElemID.value : '';
                    var bgColour = slots.Colour ? slots.Colour.value : '';
                    var content = slots.Text ? slots.Text.value : '';

                    ObjToSend = {
                        "action": inputAction,
                        "element": inputElement,
                        "width": width,
                        "height": height,
                        "bg": bgColour,
                        "id": ID,
                        "bg": bgColour,
                        "content": content
                    };
                    console.log('edit '+ ObjToSend);
                    break;
            }
        } else {
            inputAction = "App launched";
            console.log("else");
        }

        request({
            url: 'https://lazywebdev.herokuapp.com/data',
            method: 'POST',
            body: ObjToSend,
            json: true
        }, (err, res, body) => {
            console.log('Error:', body);
            var pharse = Math.floor((Math.random() * output.length))
            this.emit(':tellWithCard', output[pharse]);
        });
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say things like create a list with five list items, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

var element = function (element) {
    switch (element) {
        case 'div':
        case 'divs':
            return 'div';
            break;
        case 'paragraph':
        case 'paragraphs':
            return 'p';
            break;
        case 'article':
        case 'articles':
            return 'article';
            break;
        case 'list':
        case 'lists':
            return 'ul';
            break;
        case 'list item':
        case 'list items':
            return 'li';
            break;
        case 'image':
        case 'images':
            return 'img';
            break;
        case 'header':
        case 'headers':
            return 'h1';
            break;
        case 'section':
        case 'sections':
            return 'section';
            break;
        default:

    }
}
