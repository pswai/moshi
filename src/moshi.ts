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
        conds.every((cond) => cond),
        value,
      );
    },
    or: (...args) => {
      const value = args.at(-1);
      const conds = args.slice(0, -1);
      return obj.with(
        conds.some((cond) => cond),
        value,
      );
    },
    toArray: () => {
      return rules.flatMap((rule) => {
        const [cond, value] = rule;

        let finalValue = value;
        if (typeof value === 'function') {
          finalValue = value();
        }

        return cond ? [finalValue] : [];
      });
    },
    toObject: () => {
      return rules.reduce((memo, rule) => {
        const [cond, value] = rule;

        let finalValue = value;
        if (typeof value === 'function') {
          finalValue = value();
        }
        if (cond) {
          Object.assign(memo, finalValue);
        }

        return memo;
      }, {});
    },
  };

  return obj;
}
