'use strict'
const axios = require('axios')
const qS = require('qs')
const x2js = require('x2js')
function fetch(req, resolve, reject, log) {
  try {
    let fetchUrl = req.url
    let bodyData = req.body
    const xmlConverter=new x2js();
    let verb = req.verb ? req.verb.toLowerCase() : 'get'
    let responseType = 'json'
    if (req.responseType === 'xml' || req.responseType === 'text')
      req.responseType = 'text'
    if (req.contentType !== undefined)
      req.headers['Content-Type'] = req.contentType
    if (req.contentType === 'application/x-www-form-urlencoded')
      bodyData = qS.stringify(req.body)
    if (req.contentType === 'application/xml')
      bodyData = xmlConverter.js2xml(req.body)
    log('Fecthing URL: ' + fetchUrl)
    axios({
      method: verb,
      url: fetchUrl,
      headers: req.headers,
      responseType: responseType,
      data: verb === 'get' ? null : bodyData,
    }).then((fetchResponse) => {
      try {
        let responseData = fetchResponse.data
        if (responseType === 'xml')
          responseData = xmlConverter.xml2js(responseData)
        resolve(responseData)
      } catch (err) {
        reject(err.message)
      }
    }).catch(err => {
      reject(err.message)
    })
  } catch (err) {
    reject(err.message)
  }
}

module.exports = { fetch }