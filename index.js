/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to converter. What would you like to convert?',
            HELP_MESSAGE: 'You can convert any measurement you have, for example from inches to yards or vice versa. Try it',
            GOODBYE_MESSAGE: 'Goodbye!',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry, there was a problem. Please try again.',
            CONVERT_MESSAGE: '%.2f %s is %.2f %s.',
            CONVERT_MESSAGE2: 'Esaú say that',
            UNSUPPORTED_CONVERSION: 'Sorry, I can\'t convert from %s to %s.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido al convertidor de Esaú. ¿Qué te gustaría convertir?',
            HELP_MESSAGE: 'puedes convertir alguna medida que tengas de por ejemplo de centimetros a metros o viceversa. Intentalo',
            GOODBYE_MESSAGE: '¡Adiós!',
            FALLBACK_MESSAGE: 'Lo siento, no sé sobre eso. Por favor intenta de nuevo.',
            ERROR_MESSAGE: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor intenta nuevamente.',
            CONVERT_MESSAGE: '%.2f %s son %.2f %s.',
            CONVERT_MESSAGE2: 'Esaú dice que',
            UNSUPPORTED_CONVERSION: 'Lo siento, no puedo convertir de %s a %s.'
        }
    }
};
const conversionRates = {
    'feet': {
        'inches': 12,
        'yards': 0.333333
    },
    'inches': {
        'feet': 0.0833333,
        'yards': 0.0277778
    },
    'yards': {
        'feet': 3,
        'inches': 36
    }
};

const conversionEsp = {
    'metros': {
        'centímetros': 100,
        'kilómetros': 0.001
    },
    'centímetros': {
        'metros': 0.01,
        'kilómetros': 0.00001
    },
    'kilómetros': {
        'metros': 1000,
        'centímetros': 100000
    }
};
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertidorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertidorIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const { uno, medida, medidaapasar } = handlerInput.requestEnvelope.request.intent.slots;
        const fromUnit = medida.value.toLowerCase();
        const toUnit = medidaapasar.value.toLowerCase();
        const value = parseFloat(uno.value);
        
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const isEnglish = locale.startsWith('en');
        const conversionTable = isEnglish ? conversionRates : conversionEsp;

        let speakOutput = requestAttributes.t('CONVERT_MESSAGE2');

        if (conversionTable[fromUnit] && conversionTable[fromUnit][toUnit]) {
            const convertedValue = value * conversionTable[fromUnit][toUnit];
            speakOutput += requestAttributes.t('CONVERT_MESSAGE', value, fromUnit, convertedValue, toUnit);
        } else {
            speakOutput += requestAttributes.t('UNSUPPORTED_CONVERSION', fromUnit, toUnit);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELLO_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
         const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t(`REFLECTOR_MESSAGE ${intentName}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope), // Utiliza Alexa.getLocale para obtener el idioma de la solicitud
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertidorIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
          .addRequestInterceptors(LocalizationInterceptor, LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();