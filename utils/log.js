import { highlight } from 'cli-highlight';

const stringify = (obj = {}) => JSON.stringify(obj, null, 2);

export const log = (...args) => {
  const res = Object.assign({}, ...args);

  console.log(
    highlight(stringify(res), { language: 'json', ignoreIllegals: true }),
  );
};

export const warn = (...args) => {
  const output = args.join(' ');

  log({
    success: false,
    error: output,
  });
};

export const error = (...args) => warn(...args);

export const call = (func, ...callArgs) => {
  return async (...args) => {
    try {
      const output = await func(...callArgs, ...args);

      log(output);
    } catch (error) {
      warn(error);
    }
  };
};
