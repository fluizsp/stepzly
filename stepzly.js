'use strict'
const p = require('./lib/properties')
const v = require('./lib/values')
const d = require('./lib/data')
const Promise = require('bluebird')
const { resolve } = require('path')
class Steps {
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
    resolveValue(value) {
        let returnValue = value;
        if (typeof value == 'string' || value instanceof String) {
            let placeholderCheck = null;
            while (placeholderCheck = this.placeholderRegex.exec(value)) {
                let newValue = p.retrieve(this.state, placeholderCheck[1])
                returnValue = typeof newValue !== 'object' ? returnValue.replace(placeholderCheck[0], newValue) : newValue
            }
        }
        return returnValue
    };
    performSet(set, resolve) {
        if (!Array.isArray(set.to))
            set.to = [set.to]
        if (!Array.isArray(set.from))
            set.from = [set.from]
        let value = null;
        const target = set.response ? this.response : this.state
        for (let i = 0; i < set.to.length; i++) {
            if (set.from[i] !== undefined)
                value = this.resolveValue(set.from[i])
            p.assign(target, set.to[i], value, set.append)
        }
        resolve(true)
    }
    performUnset(unset, resolve) {
        if (!Array.isArray(unset.from))
            unset.from = [unset.from]
        const target = unset.response ? this.response : this.state
        for (let i = 0; i < unset.from.length; i++) {
            p.remove(target, unset.from[i])
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
    performFetch(fetch, resolve) {
        let headers = {}
        let bodyData = {}
        fetch.url = this.resolveValue(fetch.url)
        if (fetch.headers !== undefined)
            fetch.headers.map((header, index) => {
                let headerKey = Object.keys(header)[0]
                headers[headerKey] = this.resolveValue(header[headerKey])
            })
        if (fetch.body) {
            if (typeof fetch.body == 'object')
                this.resolveObject(fetch.body)
            bodyData = fetch.body
        }
        let req = {
            url: fetch.url,
            headers: headers,
            contentType: fetch.contentType,
            verb: fetch.verb,
            body: bodyData
        }
        let res = d.fetch(req, res => {
            p.assign(this.state, fetch.to, res)
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
        if (step.loopOver)
            step.loopOver = this.resolveValue(step.loopOver)

        loopPromises.push(new Promise(resolve => {
            if (step.set)
                this.performSet(step, resolve)
            if (step.unset)
                this.performUnset(step.unset, resolve)
            if (step.fetch)
                this.performFetch(step.fetch, resolve)
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
module.exports = Steps