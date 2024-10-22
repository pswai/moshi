import { expect, test } from 'vitest';
import moshi, { spread } from './moshi';

// moshi
//   .array(["these", "are", "prefixes"])
//   .with("always include") // can be in prefix also
//   .with(true, "true include")
//   .with(false, "false not include")
//   .with(["include", "as", "array"])
//   .with(spread(["flattened", "into", "result"]))
//   .with(every(true, true, true), "include")
//   .with(some(true, false, false), "include")
//   .with(() => true, "include")
//   .with(true, () => "include")
//   .with(true, () => spread(["include", "as", "array"]))
//   .with(true, () => () => {})
//   // Factory above, `value` actually returns the resulting array
//   .value();

test('empty', () => {
  const result = moshi.array().value();

  expect(result).toEqual([]);
});

test('prefix values', () => {
  const result = moshi.array(['prefix', 'is', 'here']).value();

  expect(result).toEqual(['prefix', 'is', 'here']);
});

test('if no condition, always include', () => {
  const result = moshi.array().with('everything').with('is').with('in').value();

  expect(result).toEqual(['everything', 'is', 'in']);
});

test('truthy condition, include', () => {
  const result = moshi
    .array()
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
    .array()
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
    .array()
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
    .array()
    .with(spread([4, 5, 6]))
    .value();

  expect(result).toEqual([4, 5, 6]);
});

test('different value types', () => {
  const noop = () => {};
  const result = moshi
    .array()
    .with(true)
    .with(false)
    .with(0)
    .with(1)
    .with(0n)
    .with(1n)
    .with(Symbol.for('key'))
    .with('lol')
    .with([1, 2, 3])
    .with(spread([4, 5, 6]))
    .with({ a: 1, b: 2 })
    .with(() => noop)
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
    .array()
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
    .array()
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
    .array()
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
    .array()
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
