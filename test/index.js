
var assert = require('assert');
var should = require('should');
var jayson = require('jayson/promise');
var package = require('../package.json')
const $ = require('shelljs');
const { spawn } = require('child_process')



describe('cli testing', function() {
    describe('client version', function() {
        var json_answer=helper('client version')
        it('should return version from package.json', function (){
            json_answer.version.should.be.equal(package.version)
        })
        it('should return success:true', function () {
            json_answer.success.should.be.equal(true)
        })

    }),
    describe('account new', function() {
        var json_answer=helper('account new')
        it('should return success:true', function () {
            json_answer.success.should.be.equal(true)
        })
        it('should have field passPhrase', function () {
            json_answer.account.should.have.property('passPhrase')
        })
        it('should have publicKey', function () {
            json_answer.account.should.have.property('publicKey')
        })
        it('should have privateKey', function () {
            json_answer.account.should.have.property('privateKey')
        })
    })

})

function helper(command) {
    var json_answer=JSON.parse($.exec('node index.js '+command))
    return json_answer
}
