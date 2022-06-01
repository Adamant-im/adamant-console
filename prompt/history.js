class History {
  constructor() {
    this.history = [];
    this.current = 0;
  }

  add(...args) {
    this.current += 1;

    const len = this.history.push(...args);

    if (len > 500) {
      this.history.shift();

      return len - 1;
    }

    return len;
  }

  next(str) {
    if (this.history.length <= this.current) {
      return str;
    }

    this.current += 1;

    return this.history[this.current];
  }

  back(str) {
    if (this.current < 1) {
      return str;
    }

    this.current -= 1;

    return this.history[this.current];
  }
}

module.exports = History;
