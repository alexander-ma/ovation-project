/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Boston Flight finder skill! Try asking me to find the cheapest flight from Austin to Boston given a certain date.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Ovation Project', speechText)
      .getResponse();
  },
};

const FindFlightIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FindFlightIntent';
  },
  handle(handlerInput) {
    var date = handlerInput.requestEnvelope.request.intent.slots.date.value;

    // Testing purposes!
    //const speechText = 'Traveling from ' + city + ' to Boston on ' + date;


    /************************************************************************************************************************************************************
    // Scraping airhob.com for price information.

    // Unfortunately, the scraping takes longer than 8 seconds, and Alexa times out after that time window.
    // Ideally, I would make an API call of some sort to a airfare API in order to have data retrieval be much faster.
    // For now, I'll have it hard-coded. :(

    const rp = require('request-promise');
    const cheerio = require('cheerio');

    // Formatting date in order to be used in URI

    var split = date.split('-');
    var new_date = '' + split[1] + '/' + split[2] + '/' + split[0];

    const options = {
      //uri: `https://www.kayak.com/flights/` + flightcode + '-BOS/' + date + '?sort=price_a',
      uri: 'https://www.airhob.com/Flights/Search/Index?origin=AUS&destination=BOS&onwardDate=' + new_date + '&returnDate=&tripType=O&adults=1&childs=0&infants=0&hostAccess=Y&classType=Economy&fareType=N&ProgramId=-1&ProgramName=&TierId=-1&TierName=&originLabel=Austin,%20US%20(AUS)&destinationLabel=Boston,%20US%20(BOS)&lccPref=All&fccPref=All&lccAir=&fccAir=&AllEarnings=true&ShowMiles=false&ShowUpgrades=false&ShowBenefits=false&ShowNoMiles=false&cur=USD&loaded=true',
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var min_price;
    rp(options)
      .then(($) => {
        var prices = new Array();
        var get = false;
        $('.each_flight_pricing_and_actions').children('h4').each(function(i, elem) {
          if(!get){
            var price = $(this).text().trim().replace(/\s+/, "");
            console.log(price);
            prices.push(price);
            get = true;
          }

      });
        min_price = prices[0];
        console.log('The cheapest one-way flight found was $150.');
        //console.log('Cheapest flight found was ' + min_price);

      })
      .catch((err) => {
        console.log(err);
      });

    ************************************************************************************************************************************************************/

    const speechText = 'The cheapest flight that I found was $150';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Ovation Project', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Try asking what the cheapest flight from any city to Boston is with a given date.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Ovation Project', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Task cancelled. Feel free to try the skill again!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Ovation Project', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, there has been an error. Please say again.')
      .reprompt('Sorry, there has been an error. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    FindFlightIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

//=========================================================================================================================================

// Attempted to try a different format of handling Intents in order to be able to access slot attributes. Unfortunately, this doesn't work.

// var Alexa = require('alexa-sdk-core');

// var SKILL_NAME = "Ovation Project";
// var WELCOME_MESSAGE = 'Welcome to the Boston Flight finder skill! Try asking me to find the cheapest flight on airhob.com given an airport code and date.';
// var HELP_MESSAGE = "Try asking for the cheapest flight to Boston is with a given airport code and date.";
// var STOP_MESSAGE = "Goodbye!";


// exports.handler = function(event, context, callback) {
//     var alexa = Alexa.handler(event, context);
//     alexa.registerHandlers(handlers);
//     alexa.execute();
// };

// var handlers = {
//     'LaunchRequest': function () {
//         this.emit(':tell', WELCOME_MESSAGE);
//     },
//     'FindFlightIntent': function () {
//         var airport = this.event.request.intent.slots.place.value;
//         var date = this.event.request.intent.slots.date.value;
//         var output = "This is what I received: " + airport + " on " + date;
//         this.emit(':tellWithCard', speechOutput, SKILL_NAME, output);
//     },
//     'AMAZON.HelpIntent': function () {
//         var speechOutput = HELP_MESSAGE;
//         var reprompt = HELP_MESSAGE;
//         this.emit(':ask', speechOutput, reprompt);
//     },
//     'AMAZON.CancelIntent': function () {
//         this.emit(':tell', STOP_MESSAGE);
//     },
//     'AMAZON.StopIntent': function () {
//         this.emit(':tell', STOP_MESSAGE);
//     }
// };
