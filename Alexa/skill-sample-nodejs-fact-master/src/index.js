'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');


var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Space Facts';


exports.handler = function(event, context, callback) {
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
        // Get a random space fact from the space facts list
        var slots = {};
        var inputAction = '';
        var inputElement = '';
        var inputChildElement = '';
        if(this.event.request.intent){
            slots = this.event.request.intent.slots;
            inputAction = slots.Action.value;
            switch(inputAction){
                case 'create':
                    inputElement = element(slots.Element.value);
                    if(slots.ChildElement.value){
                        inputChildElement = element(slots.ChildElement.value);
                    }
                    break;
                case 'delete':
                    break;
                case 'edit':
                    break;
                default:
            }
        }
        else {
            inputAction = "App launched";
        }

        // Create speech output
        if (inputChildElement != '' && slots.Amount.value){
            var ObjToSend = {
                "parent" : { "element": inputElement,
                "width": 500,
                "height": 300,
                "bg": "red",
                "id": "testID" },
                "Child" : {
                    "Amount" : slots.Amount.value,
                    "element" : {
                        "element": inputChildElement,
                        "width": 500,
                        "height": 300,
                        "bg": "red",
                        "id": "testID"
                    }
                }
            }
            //inputAction + " with a " + inputElement + " with "
            //+ slots.Amount.value + " " + inputChildElement;
        }else{
            var ObjToSend = {
                "element": inputElement,
                "width": 500,
                "height": 300,
                "bg": "red",
                "id": "testID"
            }
        }

        request.post(
            'https://lazywebdev.herokuapp.com/data',
            JSON.stringify(ObjToSend),
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );


        this.emit(':tellWithCard', "hello", SKILL_NAME,  "hello");
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
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

var element = function(element){
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
