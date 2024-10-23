const SPREAD_KEY = '__MOSHI_SPREAD_KEY__';

type SpreadAction<T = unknown> = {
  type: typeof SPREAD_KEY;
  spreadTarget: T[];
};
type SpreadValueType<T> = T extends SpreadAction<infer V> ? V : never;
type ValueArg<T> = (() => T) | T;

function isSpreadAction<T>(value: unknown): value is SpreadAction<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === SPREAD_KEY
  );
}

class MoshiArray<T> {
  private readonly items: T[] = [];

  constructor(prefixValues?: T[]) {
    if (prefixValues) {
      this.items = prefixValues;
    }
  }

  with<U extends T>(value: ValueArg<U>): MoshiArray<T | U>;
  with<S extends SpreadAction>(
    value: ValueArg<S>,
  ): MoshiArray<T | SpreadValueType<S>>;
  with<U = never>(value: NoInfer<ValueArg<U>>): MoshiArray<T | U>;

  with<U extends T>(toInclude: unknown, value: ValueArg<U>): MoshiArray<T | U>;
  with<S extends SpreadAction>(
    toInclude: unknown,
    value: ValueArg<S>,
  ): MoshiArray<T | SpreadValueType<S>>;
  with<U = never>(
    toInclude: unknown,
    value: ValueArg<NoInfer<U>>,
  ): MoshiArray<T | U>;

  with<U>(...args: [unknown, U] | [U]) {
    // Do nothing if nothing is passed
    if (args.length < 1) {
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

  private getItemsWithNewValue<U>(
    value: U,
    evaluateFunction?: boolean,
  ): (T | U)[];
  private getItemsWithNewValue<U>(
    value: SpreadAction<U>,
    evaluateFunction?: boolean,
  ): (T | U)[];
  private getItemsWithNewValue<U>(
    value: U | SpreadAction<U>,
    evaluateFunction = true,
  ): (T | U)[] {
    if (evaluateFunction && typeof value === 'function') {
      return this.getItemsWithNewValue(value(), false);
    }
    if (isSpreadAction(value)) {
      return [...this.items, ...value.spreadTarget];
    }

    return [...this.items, value];
  }
}

export function array<T = never>(prefixValues?: T[]) {
  return new MoshiArray(prefixValues);
}

export function spread<T>(value: T[]): SpreadAction<T> {
  return {
    type: SPREAD_KEY,
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
