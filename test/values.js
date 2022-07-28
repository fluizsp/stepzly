const assert = require('assert')
const v = require('../lib/values')
describe('Values -> Convert', function () {
    const startDate = new Date()
    const startDateTicks = Number(startDate) / 1000
    const testObject = {
        var01: 50.05,
        var02: 60,
        var03: "70",
        var04: 1,
        var05: "true",
        var06: 946684800,
        var07: startDate
    }
    const result01 = v.convert(testObject.var01, 'toString')
    const result02 = v.convert(testObject.var02, 'toNumber')
    const result03 = v.convert(testObject.var03, 'toNumber')
    const result03s = v.convert(testObject.var03, 'toString')
    const result04 = v.convert(testObject.var04, 'toBoolean')
    const result05 = v.convert(testObject.var05, 'toBoolean')
    const result06 = v.convert(testObject.var06, 'toDate')
    const result07 = v.convert(testObject.var07, 'toNumber')
    it('result01 should be a string and equals to "50.05"', function () {
        assert.equal(typeof result01, 'string')
        assert.equal(result01, '50.05')
    })
    it('result02 should be a number and equals to 60', function () {
        assert.equal(typeof result02, 'number')
        assert.equal(result02, 60)
    })
    it('result03 should be a number and equals to 70', function () {
        assert.equal(typeof result03, 'number')
        assert.equal(result03, 70)
    })
    it('result03s should be a string and equals to 70', function () {
        assert.equal(typeof result03s, 'string')
        assert.equal(result03s, '70')
    })
    it('result04 should be a boolean and equals to true', function () {
        assert.equal(typeof result04, 'boolean')
        assert.equal(result04, true)
    })
    it('result05 should be a boolean and equals to true', function () {
        assert.equal(typeof result05, 'boolean')
        assert.equal(result05, true)
    })
    it('result06 should be a date and equals to 2000-01-01T00:00:00Z', function () {
        assert.equal(result06 instanceof Date, true)
        assert.equal(result06.toString(), new Date('2000-01-01T00:00:00Z'))
    })
    it(`result07 should be a number and equals to startDateTicks (${startDateTicks})`, function () {
        assert.equal(typeof result07, 'number')
        assert.equal(result07, startDateTicks)
    })
})
describe('Values -> Calulate', function () {
    const testObject = {
        var01: 50.05,
        var02: 60,
        var03: 70,
        var04: 80,
        var05: 18
    }
    const result01 = v.calculate(testObject.var01, 100, '+')
    const result02 = v.calculate(testObject.var02, 10, '-')
    const result03 = v.calculate(testObject.var03, 10, '*')
    const result04 = v.calculate(testObject.var04, 10, '/')
    const result05 = v.calculate(testObject.var05, 5, '%')
    it('result01 should be equals to 150.05', function () {
        assert.equal(result01, 150.05)
    })
    it('result02 should be equals to 50', function () {
        assert.equal(result02, 50)
    })    
    it('result03 should be equals to 700', function () {
        assert.equal(result03, 700)
    })   
    it('result04 should be equals to 8', function () {
        assert.equal(result04, 8)
    })   
    it('result05 should be equals to 3', function () {
        assert.equal(result05, 3)
    })        
})