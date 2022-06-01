exports.requiredParam = (name) => {
  throw new Error(`Missing parameter '${name}'`);
};
