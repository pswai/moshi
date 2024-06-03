export function moshi() {
  const rules = [];

  const obj = {
    with: (...args) => {
      if (args.length === 1) {
        rules.push([true, args[0]]);
      } else {
        rules.push(args);
      }
      return obj;
    },
    and: (...args) => {
      const value = args.at(-1);
      const conds = args.slice(0, -1);
      return obj.with(
        () => conds.every((cond) => getFunctionValue(cond)),
        value,
      );
    },
    or: (...args) => {
      const value = args.at(-1);
      const conds = args.slice(0, -1);
      return obj.with(
        () => conds.some((cond) => getFunctionValue(cond)),
        value,
      );
    },
    toArray: () => {
      return rules.reduce((memo, rule) => {
        const [cond, value] = rule;

        if (getFunctionValue(cond)) {
          memo.push(getFunctionValue(value));
        }

        return memo;
      }, []);
    },
    toObject: () => {
      return rules.reduce((memo, rule) => {
        const [cond, value] = rule;

        if (getFunctionValue(cond)) {
          Object.assign(memo, getFunctionValue(value));
        }

        return memo;
      }, {});
    },
  };

  return obj;
}

function getFunctionValue(maybeFunction) {
  if (typeof maybeFunction === 'function') {
    return maybeFunction();
  }
  return maybeFunction;
}
