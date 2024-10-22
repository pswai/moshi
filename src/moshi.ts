const SPREAD = Symbol('spread');

class MoshiArray<T> {
  private readonly items: T[] = [];

  constructor(prefixValues?: T[]) {
    if (prefixValues) {
      this.items = prefixValues;
    }
  }

  with<U extends T>(value: U): MoshiArray<T | U>;
  with<U = never>(value: NoInfer<U>): MoshiArray<T | U>;
  with<U extends T>(toInclude: any, value: U): MoshiArray<T | U>;
  with<U = never>(toInclude: any, value: NoInfer<U>): MoshiArray<T | U>;
  with<U>(...args: [any, U] | [U]) {
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
    return this.items;
  }

  private addValue(value: any, evaluateFunction = true) {
    if (evaluateFunction && typeof value === 'function') {
      this.addValue(value(), false);
    } else if (value && typeof value === 'object' && 'type' in value) {
      if (value.type === SPREAD) {
        this.items.push(...value.spreadTarget);
      }
    } else {
      this.items.push(value);
    }
  }
}

export function array<T>(prefixValues?: T[]) {
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
