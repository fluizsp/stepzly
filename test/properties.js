const assert = require('assert')
const p = require('../lib/properties')
describe('Properties -> Assign', function () {
    let testObject = {
        startDate: new Date(),
        originalObj: {
            var01: "One"
        },
        originalArray: ['first', 'second', 'third']
    }
    const startDate = new Date()
    p.assign(testObject, 'originalObj.var01', '-01', true)
    p.assign(testObject, 'originalObj.var02', 'Two')
    p.assign(testObject, 'originalObj.var03', 3)
    p.assign(testObject, 'originalObj.var04', testObject.startDate)
    p.assign(testObject, 'newArray.0', 'first')
    p.assign(testObject, 'originalArray', 'fourth', true)
    console.log(testObject)
    it('var01 attribute of originalObj of testObject should be "One-01"', function () {
        assert.equal(testObject.originalObj.var01, 'One-01')
    })
    it('var02 attribute of originalObj of testObject should be "Two"', function () {
        assert.equal(testObject.originalObj.var02, 'Two')
    })
    it('var03 attribute of originalObj of testObject should be 3 (Number)', function () {
        assert.equal(testObject.originalObj.var03, 3)
    })
    it('var04 attribute of originalObj of testObject should be a Date object and equals to startDate attribute', function () {
        assert.equal(testObject.originalObj.var04 instanceof Date, true)
        assert.equal(testObject.originalObj.var04, testObject.startDate)
    })
    it('newArray attribute of testObject should be an Array and the first value should be "first"', function () {
        assert.equal(Array.isArray(testObject.newArray), true)
        assert.equal(testObject.newArray[0], 'first')
    })
    it('originalArray of testObject should be an Array and the fourth value should be "fourth"', function () {
        assert.equal(Array.isArray(testObject.originalArray), true)
        assert.equal(testObject.originalArray[3], 'fourth')
    })
})
describe('Properties -> Retrieve', function () {
    let startDate = new Date()
    let testObject = {
        startDate: startDate,
        originalObj: {
            var01: 'One-01',
            var02: 'Two',
            var03: 3,
            var04: startDate
        },
        originalArray: ['first', 'second', 'third', 'fourth'],
        newArray: ['first']
    }
    let assertStartDate = p.retrieve(testObject, 'startDate')
    let assertVar01 = p.retrieve(testObject, 'originalObj.var01')
    let assertArrayValue0 = p.retrieve(testObject, 'originalArray.0')
    it('assertStartDate of testObject should be equal to startDate', function () {
        assert.equal(assertStartDate, startDate)
    })
    it('assertVar01 should be equal to the source', function () {
        assert.equal(assertVar01, testObject.originalObj.var01)
    })
    it('assertArrayValue0 should be equal to the source', function () {
        assert.equal(assertArrayValue0, testObject.originalArray[0])
    })
})
describe('Properties -> Remove', function () {
    let startDate = new Date()
    let testObject = {
        startDate: startDate,
        originalObj: {
            var01: 'One-01',
            var02: 'Two',
            var03: 3,
            var04: startDate
        },
        originalArray: ['first', 'second', 'third', 'fourth'],
        newArray: ['first']
    }
    p.remove(testObject,'startDate')
    p.remove(testObject,'originalObj.var02')
    p.remove(testObject,'originalArray.2')
    it('startDate of testObject should be null', function () {
        assert.equal(testObject.startDate, null)
    })
    it('var02 of originalObj of of testObject should be null', function () {
        assert.equal(testObject.originalObj.var02, null)
    })
    it('originalArray of of testObject should have a length of 3', function () {
        assert.equal(testObject.originalArray.length, 3)
    })
})