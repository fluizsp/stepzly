'use strict'
const yaml = require('js-yaml')
const fs = require('fs')
const Stepzly = require('../../stepzly')
const stepsDoc = yaml.load(fs.readFileSync('examples/example05/steps.yaml', 'utf8'))
const steps = new Stepzly(stepsDoc.steps, null)
steps.run(true).then(output => {
    try {
        console.log(output);
        fs.writeFileSync('result.json', JSON.stringify(output, null, 4))
    }
     catch (err) {
    }
});