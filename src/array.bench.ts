import { bench, describe } from 'vitest';
import moshi from './moshi';

const counts = [1, 10, 100, 1_000, 10_000];

describe('array, with(n)', () => {
  for (const count of counts) {
    bench(`with(n) x${count}`, () => {
      let m = moshi.array<number>();

      for (let i = 0; i < count; ++i) {
        m = m.with(i);
      }

      m.value();
    });
  }
});

describe('array, with(n) x1000, keep calling value()', () => {
  for (const count of counts) {
    bench(`value() x${count}`, () => {
      let m = moshi.array<number>();
      for (let i = 0; i < 1000; ++i) {
        m = m.with(i);
      }
      for (let i = 0; i < count; ++i) {
        m.value();
      }
    });
  }
});

for (const count of counts) {
  describe(`compare to native x${count}`, () => {
    bench('native', () => {
      const arr: number[] = [];

      for (let i = 0; i < count; ++i) {
        if (i % 2 === 0) {
          arr.push(i);
        }
      }
    });

    bench('moshi', () => {
      let m = moshi.array<number>();

      for (let i = 0; i < count; ++i) {
        m = m.with(i % 2 === 0, i);
      }

      m.value();
    });
  });
}
