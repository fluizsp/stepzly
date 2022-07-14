'use strict'
const Stepzly = require('../../stepzly')
const steps = [
    {
        set: {
            to: ['Name', 'Age'],
            from: ['John', 20]
        },
        name: 'Set Some Vars'
    }
]
const stepzly = new Stepzly(steps, null)
stepzly.run(true).then(output => {
    try {
        console.log(output);
    }
    catch (err) {
    }
});