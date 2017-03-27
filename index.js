'use strict';
const Voxa = require('voxa');
const _ = require('lodash');

const views = {
    Hello: {
        ask: 'Hello! Welcome to the Add skill, what is the first number?',
    },
    waitingForInput: {
        ask: 'Do you have other number to add?'
    },
    SumIntent: {
        tell: 'Your result is {result}'
    }
};

const variables = {
    result: (model) => model.result,
}

const skill = new Voxa({ views, variables });

skill.onIntent('LaunchIntent', (event) => {
    return { reply: 'Hello', to: 'waitingForInput' };
});

skill.onState('waitingForInput', (event) => {
    if (!event.model.values) { event.model.values = [] }

    if (event.intent.name === 'SumIntent') {
        event.model.values.push(parseInt(event.intent.params.number));
        return { reply: 'waitingForInput', to: 'waitingForInput' };
    }

    if (event.intent.name === 'AMAZON.NoIntent') {
        event.model.result = _.sum(event.model.values);
        return { reply: 'SumIntent' };
    }
});

exports.handler = skill.lambda();
