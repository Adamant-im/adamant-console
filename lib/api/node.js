const api = require('../../utils/api');

exports.getNodeHeight = async () => {
  const res = await api.get('blocks/getHeight');

  return res.data || res;
};

exports.getNodeVersion = async () => {
  const res = await api.get('peers/version');

  return res.data || res;
};
