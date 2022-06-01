const api = require('../../utils/api');
const config = require('../../utils/config');
const { requiredParam } = require('../../utils/validate');

exports.createDelegate = async (username = requiredParam('username'), passPhrase) => {
  const res = await api.newDelegate(
    passPhrase || config.passPhrase,
    username,
  );

  return res.data || res;
};
