const account = require('./account');
const get = require('./get');
const node = require('./node');
const send = require('./send');
const delegate = require('./delegate');
const vote = require('./vote');

module.exports = {
  ...account,
  ...get,
  ...node,
  ...send,
  ...delegate,
  ...vote,
};
