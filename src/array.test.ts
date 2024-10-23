import { expect, test } from 'vitest';
import moshi, { spread } from './moshi';

test('empty', () => {
  const result = moshi.array().value();

  expect(result).toEqual([]);
});

test('prefix values', () => {
  const result = moshi.array(['prefix', 'is', 'here']).value();

  expect(result).toEqual(['prefix', 'is', 'here']);
});

test('no condition, include', () => {
  const result = moshi
    .array<string>()
    .with('everything')
    .with('is')
    .with('in')
    .value();

  expect(result).toEqual(['everything', 'is', 'in']);
});

test('no condition, function arg, include', () => {
  const result = moshi
    .array<string>()
    .with(() => 'everything')
    .with(() => 'is')
    .with(() => 'in')
    .value();

  expect(result).toEqual(['everything', 'is', 'in']);
});

test('truthy condition, include', () => {
  const result = moshi
    .array<string>()
    .with(true, 'boolean')
    .with(1, 'number')
    .with(1n, 'bigint')
    .with(Symbol('key'), 'symbol')
    .with('lol', 'string')
    .with([], 'empty array')
    .with({}, 'empty object')
    .value();

  expect(result).toEqual([
    'boolean',
    'number',
    'bigint',
    'symbol',
    'string',
    'empty array',
    'empty object',
  ]);
});

test('falsy condition, exclude', () => {
  const result = moshi
    .array<string>()
    .with(null, 'null')
    .with(undefined, 'undefined')
    .with(false, 'false')
    .with(Number.NaN, 'Number.NaN')
    .with(0, '0')
    .with(-0, '-0')
    .with(0n, '0n')
    .with('', 'empty string')
    // .with(document.all, 'not in')
    .value();

  expect(result).toEqual([]);
});

test('mixed conditions', () => {
  const result = moshi
    .array<string>()
    .with('', '[exclude] empty string')
    .with(true, '[include] boolean')
    .with(null, '[exclude] null')
    .with(1, '[include] number')
    .with(undefined, '[exclude] undefined')
    .with(1n, '[include] bigint')
    .with(false, '[exclude] false')
    .with(Symbol('key'), '[include] symbol')
    .with(Number.NaN, '[exclude] Number.NaN')
    .with('lol', '[include] string')
    .with(0, '[exclude] 0')
    .with([], '[include] empty array')
    .with(-0, '[exclude] -0')
    .with({}, '[include] empty object')
    .with(0n, '[exclude] 0n')
    .value();

  expect(result).toEqual([
    '[include] boolean',
    '[include] number',
    '[include] bigint',
    '[include] symbol',
    '[include] string',
    '[include] empty array',
    '[include] empty object',
  ]);
});

test('spread() array', () => {
  const result = moshi
    .array<number>()
    .with(spread([4, 5, 6]))
    .value();

  expect(result).toEqual([4, 5, 6]);
});

test('function arg, spread() array', () => {
  const result = moshi
    .array<number>()
    .with(() => spread([4, 5, 6]))
    .value();

  expect(result).toEqual([4, 5, 6]);
});

test('condition, spread() array', () => {
  const result = moshi
    .array<number>()
    .with(true, spread([4, 5, 6]))
    .value();

  expect(result).toEqual([4, 5, 6]);
});

test('condition, function arg, spread() array', () => {
  const result = moshi
    .array<number>()
    .with(true, () => spread([4, 5, 6]))
    .value();

  expect(result).toEqual([4, 5, 6]);
});

test('different value types', () => {
  const noop = () => {};
  const result = moshi
    .array()
    .with<boolean>(true)
    .with(false)
    .with<number>(0)
    .with(1)
    .with<bigint>(0n)
    .with(1n)
    .with<symbol>(Symbol.for('key'))
    .with<string>('lol')
    .with<number[]>([1, 2, 3])
    .with(spread([4, 5, 6]))
    .with<{ a: number; b: number }>({ a: 1, b: 2 })
    .with<() => void>(() => noop)
    .with(() => spread([7, 8, 9]))
    .value();

  expect(result).toEqual([
    true,
    false,
    0,
    1,
    0n,
    1n,
    Symbol.for('key'),
    'lol',
    [1, 2, 3],
    4,
    5,
    6,
    { a: 1, b: 2 },
    noop,
    7,
    8,
    9,
  ]);
});

test('function `toInclude`, truthy condition, include', () => {
  const result = moshi
    .array<string>()
    .with(() => true, 'boolean')
    .with(() => 1, 'number')
    .with(() => 1n, 'bigint')
    .with(() => Symbol('key'), 'symbol')
    .with(() => 'lol', 'string')
    .with(() => [], 'empty array')
    .with(() => ({}), 'empty object')
    .value();

  expect(result).toEqual([
    'boolean',
    'number',
    'bigint',
    'symbol',
    'string',
    'empty array',
    'empty object',
  ]);
});

test('function `toInclude`, falsy condition, exclude', () => {
  const result = moshi
    .array<string>()
    .with(() => null, 'null')
    .with(() => undefined, 'undefined')
    .with(() => false, 'false')
    .with(() => Number.NaN, 'Number.NaN')
    .with(() => 0, '0')
    .with(() => -0, '-0')
    .with(() => 0n, '0n')
    .with(() => '', 'empty string')
    // .with(() => document.all, 'not in')
    .value();

  expect(result).toEqual([]);
});

test('function `toInclude`, mixed conditions', () => {
  const result = moshi
    .array<string>()
    .with(() => '', '[exclude] empty string')
    .with(() => true, '[include] boolean')
    .with(() => null, '[exclude] null')
    .with(() => 1, '[include] number')
    .with(() => undefined, '[exclude] undefined')
    .with(() => 1n, '[include] bigint')
    .with(() => false, '[exclude] false')
    .with(() => Symbol('key'), '[include] symbol')
    .with(() => Number.NaN, '[exclude] Number.NaN')
    .with(() => 'lol', '[include] string')
    .with(() => 0, '[exclude] 0')
    .with(() => [], '[include] empty array')
    .with(() => -0, '[exclude] -0')
    .with(() => ({}), '[include] empty object')
    .with(() => 0n, '[exclude] 0n')
    .value();

  expect(result).toEqual([
    '[include] boolean',
    '[include] number',
    '[include] bigint',
    '[include] symbol',
    '[include] string',
    '[include] empty array',
    '[include] empty object',
  ]);
});

test('function `toInclude`, mixed conditions, function value arg', () => {
  const result = moshi
    .array<string>()
    .with(
      () => '',
      () => '[exclude] empty string',
    )
    .with(
      () => true,
      () => '[include] boolean',
    )
    .with(
      () => null,
      () => '[exclude] null',
    )
    .with(
      () => 1,
      () => '[include] number',
    )
    .with(
      () => undefined,
      () => '[exclude] undefined',
    )
    .with(
      () => 1n,
      () => '[include] bigint',
    )
    .with(
      () => false,
      () => '[exclude] false',
    )
    .with(
      () => Symbol('key'),
      () => '[include] symbol',
    )
    .with(
      () => Number.NaN,
      () => '[exclude] Number.NaN',
    )
    .with(
      () => 'lol',
      () => '[include] string',
    )
    .with(
      () => 0,
      () => '[exclude] 0',
    )
    .with(
      () => [],
      () => '[include] empty array',
    )
    .with(
      () => -0,
      () => '[exclude] -0',
    )
    .with(
      () => ({}),
      () => '[include] empty object',
    )
    .with(
      () => 0n,
      () => '[exclude] 0n',
    )
    .value();

  expect(result).toEqual([
    '[include] boolean',
    '[include] number',
    '[include] bigint',
    '[include] symbol',
    '[include] string',
    '[include] empty array',
    '[include] empty object',
  ]);
});

test('`with()` should not mutate anything', () => {
  const base = moshi.array(['both']);
  const m1 = base.with('first');
  const m2 = base.with('second');

  expect(m1.value()).toEqual(['both', 'first']);
  expect(m2.value()).toEqual(['both', 'second']);
});

test('`with()` immutability with conditions', () => {
  const base = moshi
    .array(['both'])
    .with(true, 'include')
    .with(false, 'exclude');
  const m1 = base.with(true, 'first');
  const m2 = base.with(false, 'second').with(1, 'second include');

  expect(m1.value()).toEqual(['both', 'include', 'first']);
  expect(m2.value()).toEqual(['both', 'include', 'second include']);
});

test('throws when `with` missing arguments', () => {
  expect(() => {
    // @ts-expect-error Purposely bypass TS for testing purpose
    moshi.array().with();
  }).toThrowError('`with()` expects at least 1 argument');
});
