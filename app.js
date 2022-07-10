'use strict'
const yaml = require('js-yaml')
const fs = require('fs')
const Stepzly = require('./stepzly')
const doc = yaml.load(fs.readFileSync('draft4.yaml', 'utf8'))
const steps = new Stepzly(doc.steps, null)
steps.run(true).then(output => {
    try {
        console.log(output);
        fs.writeFileSync('result.json', JSON.stringify(output, null, 4))
    } catch (err) {
    }
});