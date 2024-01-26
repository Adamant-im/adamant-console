const api = require('../../utils/api');
const config = require('../../utils/config');
const { requiredParam } = require('../../utils/validate');

exports.voteFor = async (
  delegateArr = requiredParam('delegates'),
  passPhrase,
) => {
  const delegates = delegateArr;

  for (const [index, delegate] of delegates.entries()) {
    const voteDirection = delegate.charAt(0);

    if (!['+', '-'].includes(voteDirection)) {
      delegates[index] = `+${delegate}`;
    }
  }

  const res = await api.voteForDelegate(
    passPhrase || config.passPhrase,
    delegates,
  );

  return res.data || res;
};
