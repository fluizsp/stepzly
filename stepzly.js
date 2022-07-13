'use strict'
const p = require('./lib/properties')
const v = require('./lib/values')
const d = require('./lib/data')
const Promise = require('bluebird')
class Stepzly {
    constructor(steps, initialState, logExtension) {
        this._steps = steps
        this.logOutput = ""
        this.logExtension = logExtension
        this.state = initialState === undefined || initialState === null ? {} : initialState
        this.response = {}
        this.errors = []
        this.placeholderRegex = new RegExp('{{([a-z0-9\.\_]+)}}', 'gi');
    }
    log(line) {
        line = `${new Date().toISOString()} ${line}\n`
        this.logOutput += line
        if (this.logExtension)
            this.logExtension(line)
    }
    resolveParam(param, index) {
        let returnParam = param;
        if (typeof param == 'string' || value instanceof String) {
            let indexMatch = param.match('{{index}}', 'g')
            if (indexMatch) {
                returnParam = returnParam.replace('{{index}}', index)
            }
        }
        return returnParam
    };
    resolveValue(value, index) {
        let returnValue = value;
        if (typeof value == 'string' || value instanceof String) {
            let indexMatch = value.match('{{index}}', 'g')
            if (indexMatch) {
                returnValue = returnValue.replace('{{index}}', index)
            }
            let placeholderCheck = null;
            while (placeholderCheck = this.placeholderRegex.exec(returnValue)) {
                this.placeholderRegex.lastIndex = 0
                let newValue = p.retrieve(this.state, placeholderCheck[1])
                returnValue = returnValue == placeholderCheck[0] || typeof newValue == 'object' ? newValue :
                    returnValue.replace(placeholderCheck[0], newValue)
            }
        }
        return returnValue
    };
    performSet(step, resolve) {
        let set = step.set
        if (!Array.isArray(set.to))
            set.to = [set.to]
        if (!Array.isArray(set.from))
            set.from = [set.from]
        let value = null;
        const target = set.response ? this.response : this.state
        for (let i = 0; i < set.to.length; i++) {
            if (set.from[i] !== undefined)
                value = this.resolveValue(set.from[i], step.loopIndex)
            p.assign(target, this.resolveParam(set.to[i], step.loopIndex), value, set.append)
        }
        resolve(true)
    }
    performUnset(step, resolve) {
        let unset = step.unset
        if (!Array.isArray(unset.from))
            unset.from = [unset.from]
        const target = unset.response ? this.response : this.state
        for (let i = 0; i < unset.from.length; i++) {
            unset.from[i] = this.resolveParam(unset.from[i], step.loopIndex)
            p.remove(target, unset.from[i])
        }
        resolve(true)
    }
    performConvert(step, resolve) {
        let convert = step.convert
        if (!Array.isArray(convert.to))
            convert.to = [convert.to]
        if (!Array.isArray(convert.from))
            convert.from = [convert.from]
        let value = null;
        for (let i = 0; i < convert.to.length; i++) {
            if (convert.from[i] !== undefined) {
                value = this.resolveValue(convert.from[i], step.loopIndex)
                value = v.convert(value, convert.conversion)
            }
            p.assign(this.state, this.resolveParam(convert.to[i], step.loopIndex), value)
        }
        resolve(true)
    }
    performCalculate(step, resolve) {
        let calculate = step.calculate
        if (!Array.isArray(calculate.from))
            calculate.from = [calculate.from]
        let value = this.resolveValue(calculate.from[0], step.loopIndex);
        for (let i = 1; i < calculate.from.length; i++) {
            if (calculate.from[i] !== undefined) {
                value = v.calculate(value, this.resolveValue(calculate.from[i], step.loopIndex), calculate.operator)
            }
            p.assign(this.state, this.resolveParam(calculate.to, step.loopIndex), value)
        }
        resolve(true)
    }
    performSplit(step, resolve) {
        let split = step.split
        if (!Array.isArray(split.to))
            split.to = [split.to]
        if (!Array.isArray(split.from))
            split.from = [split.from]
        let value = null;
        for (let i = 0; i < split.from.length; i++) {
            if (split.from[i] !== undefined) {
                value = v.split(this.resolveValue(split.from[i], step.loopIndex), split.separator)
                p.assign(this.state, this.resolveParam(split.to[i], step.loopIndex), value)
            }
        }
        resolve(true)
    }
    performJoin(step, resolve) {
        let join = step.join
        if (!Array.isArray(join.to))
            join.to = [join.to]
        if (!Array.isArray(join.from))
            join.from = [join.from]
        let value = null;
        for (let i = 0; i < join.to.length; i++) {
            if (join.from[i] !== undefined) {
                value = v.join(this.resolveValue(join.from[i], step.loopIndex), join.separator)
                p.assign(this.state, this.resolveParam(join.to[i], step.loopIndex), value)
            }
        }
        resolve(true)
    }
    performExtract(step, resolve) {
        let extract = step.extract
        if (!Array.isArray(extract.to))
            extract.to = [extract.to]
        if (!Array.isArray(extract.from))
            extract.from = [extract.from]
        let value = null;
        for (let i = 0; i < extract.to.length; i++) {
            if (extract.from[i] !== undefined) {
                value = v.extract(this.resolveValue(extract.from[i], step.loopIndex), extract.expression, extract.expressionOptions)
                p.assign(this.state, this.resolveParam(extract.to[i], step.loopIndex), value)
            }
        }
        resolve(true)
    }
    resolveObject(object) {
        for (let attr in object) {
            if (typeof object[attr] !== 'object')
                object[attr] = this.resolveValue(object[attr])
            if (typeof object[attr] == 'object')
                this.resolveObject(object[attr])
        }
    }
    performFetch(step, resolve) {
        let fetch = step.fetch
        let headers = {}
        let bodyData = {}
        let url = this.resolveValue(fetch.url, step.loopIndex)
        if (fetch.headers !== undefined)
            fetch.headers.map((header, index) => {
                let headerKey = Object.keys(header)[0]
                headers[headerKey] = this.resolveValue(header[headerKey], step.loopIndex)
            })
        if (fetch.body) {
            if (typeof fetch.body == 'object')
                this.resolveObject(fetch.body)
            bodyData = fetch.body
        }
        let req = {
            url: url,
            headers: headers,
            contentType: fetch.contentType,
            verb: fetch.verb,
            body: bodyData
        }
        let res = d.fetch(req, res => {
            p.assign(this.state, this.resolveParam(fetch.to, step.loopIndex), res)
            resolve(true)
        }, (err) => {
            this.errors.push(`Error in performFetch: ${err}`)
            resolve(true)
        }, log => { this.log(log) })
    }
    runStep(step) {
        this.log(`Performing step ${step.name ?? 'unnamed step'}`)
        let loopPromises = []
        step.loopIndex = 0
        step.loopCount = 1
        if (step.loopOver) {
            step.loopOver = p.retrieve(this.state, step.loopOver)
            step.loopCount = step.loopOver.length
        }
        for (step.loopIndex; step.loopIndex < step.loopCount; step.loopIndex++)
            loopPromises.push(new Promise(resolve => {
                let indexedStep = Object.assign({}, step)
                if (indexedStep.set)
                    this.performSet(indexedStep, resolve)
                if (indexedStep.unset)
                    this.performUnset(indexedStep, resolve)
                if (indexedStep.fetch)
                    this.performFetch(indexedStep, resolve)
                if (indexedStep.convert)
                    this.performConvert(indexedStep, resolve)
                if (indexedStep.calculate)
                    this.performCalculate(indexedStep, resolve)
                if (indexedStep.split)
                    this.performSplit(indexedStep, resolve)
                if (indexedStep.join)
                    this.performJoin(indexedStep, resolve)
                if (indexedStep.extract)
                    this.performExtract(indexedStep, resolve)
            }))
        return Promise.all(loopPromises).then(new Promise((resolve) => {
            resolve(true);
        }));
    }
    run(debug = false) {
        this.log('Start: ' + new Date().toISOString())
        return new Promise((resolve) => {
            Promise.each(this._steps, (step, index, length) => {
                return this.runStep(step)
            }).then(() => {
                let responseResult = null;
                this.log('Response length: ' + JSON.stringify(responseResult).length)
                this.log('End: ' + new Date().toISOString())
                responseResult = debug ? {
                    response: this.response,
                    state: this.state,
                    errors: this.errors,
                    log: this.logOutput
                } : this.response ?? {}
                resolve(responseResult)
            })
        })
    }
}
module.exports = Stepzly