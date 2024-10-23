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
      throw new Error('`with()` expects at least 1 argument');
    }

    if (args.length === 1) {
      return new MoshiArray(this.getItemsWithNewValue(args[0]));
    }

    const [toInclude, value] = args;
    if (typeof toInclude === 'function') {
      if (toInclude()) {
        return new MoshiArray(this.getItemsWithNewValue(value));
      }
    } else if (toInclude) {
      return new MoshiArray(this.getItemsWithNewValue(value));
    }

    return this;
  }

  value() {
    return this.items;
  }

  private getItemsWithNewValue(value: any, evaluateFunction = true): any[] {
    if (evaluateFunction && typeof value === 'function') {
      return this.getItemsWithNewValue(value(), false);
    }
    if (value && typeof value === 'object' && 'type' in value) {
      if (value.type === SPREAD) {
        return [...this.items, ...value.spreadTarget];
      }
    }

    return [...this.items, value];
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
