const stringify = (obj = {}) => JSON.stringify(obj, null, 2);

module.exports = {
  log(...args) {
    const res = Object.assign({}, ...args);

    console.log(stringify(res));
  },
  warn(...args) {
    const output = args.join(' ');

    this.log({
      success: false,
      error: output,
    });
  },
  error(...args) {
    this.warn(...args);
  },
  call(func, ...callArgs) {
    return async (...args) => {
      try {
        const output = await func(...callArgs, ...args);

        this.log(output);
      } catch (error) {
        this.warn(error);
      }
    };
  },
};
