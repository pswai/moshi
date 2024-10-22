const SPREAD = Symbol('spread');

class MoshiArray {
  readonly rules: any[];

  constructor(prefixValues: any[] = []) {
    this.rules = prefixValues;
  }

  with(value: any): this;
  with(toInclude: any, value: any): this;
  with(...args: any[]): this {
    // Do nothing if nothing is passed
    if (args.length < 1) {
      // TODO: Use invariant
      console.warn(`Nothing is passed to \`with()\`, something's missing?`);
      return this;
    }

    if (args.length === 1) {
      this.addValue(args[0]);
      return this;
    }

    const [toInclude, value] = args;
    if (typeof toInclude === 'function') {
      if (toInclude()) {
        this.addValue(value);
      }
    } else if (toInclude) {
      this.addValue(value);
    }

    return this;
  }

  value() {
    return this.rules;
  }

  private addValue(value: any, evaluateFunction = true) {
    if (evaluateFunction && typeof value === 'function') {
      this.addValue(value(), false);
    } else if (value && typeof value === 'object' && 'type' in value) {
      if (value.type === SPREAD) {
        this.rules.push(...value.spreadTarget);
      }
    } else {
      this.rules.push(value);
    }
  }
}

export function array(prefixValues?: any[]) {
  return new MoshiArray(prefixValues);
}

export function spread(value: any[]) {
  return {
    type: SPREAD,
    spreadTarget: value,
  };
}

export default {
  array,
};

// // Sugar
// test.todo("and()/every() helper");
// test.todo("or()/some()/any() helper");

// Question
// - Support async operations?
// - Time complexity: O(n)?
// - Caching?
// - Lazy evaluation?
