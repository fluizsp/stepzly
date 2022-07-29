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
describe('Values -> Split & Join', function () {
    const testObject = {
        var01: 'John|Paul|Smith|Thomas',
        var02: [50, 60, 70, 80]
    }
    const result01 = v.split(testObject.var01, '|');
    const result02 = v.join(testObject.var02, ',');
    it('result01 should be equals to an Array of names', function () {
        assert.equal(result01[0], 'John')
        assert.equal(result01[1], 'Paul')
        assert.equal(result01[2], 'Smith')
        assert.equal(result01[3], 'Thomas')
    })
    it('result02 should be equals to "50,60,70,80"', function () {
        assert.equal(result02, '50,60,70,80')
    })
})
describe('Values -> Extract', function () {
    const testObject = {
        var01: '<div class="container"><div class="inline-text">One long string</div><div class="inline-red-icon"></div></div>',
        var02: 'Copy, Neo is the name of the suspect.'
    }
    const result01 = v.extract(testObject.var01, '(?:text\"\>)([a-z0-9 ]+)', 'gi')[1];
    const result02 = v.extract(testObject.var02, '(?:, )([a-z0-9 ]+)(?: is)', 'gi')[1];
    it('result01 should be equals to "One long string"', function () {
        assert.equal(result01, 'One long string')
    })
    it('result02 should be equals to "Neo"', function () {
        assert.equal(result02, 'Neo')
    })
})
describe('Values -> Compare', function () {
    const startDate = new Date()
    const startDateTicks = Number(startDate) / 1000
    const testObject = {
        var01: 50.05,
        var02: 60,
        var03: "70",
        var04: 1,
        var05: "true",
        var06: startDateTicks,
        var07: startDate,
        var08: 'Copy, Neo is the name of the suspect.'
    }
    it('var01 should be "equals" to 50.05', function () {
        assert.equal(v.compare(testObject.var01, 50.05, 'equals'), true)
    })
    it('var01 should also be "equals" to "50.05"', function () {
        assert.equal(v.compare(testObject.var01, '50.05', 'equals'), true)
    })
    it('var02 should be greater than var01', function () {
        assert.equal(v.compare(testObject.var02, testObject.var01, 'greater'), true)
    })
    it('var01 should be lesser than var03', function () {
        assert.equal(v.compare(testObject.var01, testObject.var03, 'lesser'), true)
    })
    it('var04 should be lesser or equals than 1', function () {
        assert.equal(v.compare(testObject.var04, 1, 'lesserorequals'), true)
    })
    it('var05 should be equals to boolean true', function () {
        assert.equal(v.compare(true, testObject.var05, 'equals'), true)
    })
    it('startDate should be equals to var07', function () {
        assert.equal(v.compare(testObject.var07, startDate, 'equals'), true)
    })
    it('var08 should contains "Neo"', function () {
        assert.equal(v.compare(testObject.var08, 'Neo', 'contains'), true)
    })
    it('var01 should be set', function () {
        assert.equal(v.compare(testObject.var01, null, 'isset'), true)
    })
    it('var09 should not be set', function () {
        assert.equal(v.compare(testObject.var09, null, 'isset'), false)
    })    
})