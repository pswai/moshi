import { test, expectTypeOf, assertType } from 'vitest';
import moshi from './moshi';

test('array function', () => {
  expectTypeOf(moshi).toHaveProperty('array');

  expectTypeOf(moshi.array).toBeFunction();
  expectTypeOf(moshi.array).toBeCallableWith([1, 2, 3]);
  expectTypeOf(moshi.array).toBeCallableWith([1, 'string', false]);
});

test('without prefix values', () => {
  const m = moshi.array();
  expectTypeOf(m.value()).toEqualTypeOf<never[]>();
  expectTypeOf(m.with<number>(4)).toEqualTypeOf(moshi.array<number>());
  expectTypeOf(m.with<number>(4).value()).toEqualTypeOf<number[]>();

  expectTypeOf(m.with<number>(4).with<string>('string').value()).toEqualTypeOf<
    (number | string)[]
  >();

  // @ts-expect-error Adding new type must specify generic
  assertType(m.with(4));
});

test('without prefix values, generic type specified', () => {
  const m = moshi.array<number>();
  expectTypeOf(m.value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with(4)).toEqualTypeOf(m);
  expectTypeOf(m.with(4).value()).toEqualTypeOf<number[]>();

  expectTypeOf(m.with<string>('string').value()).toEqualTypeOf<
    (number | string)[]
  >();
});

test('with prefix values, generic type specified', () => {
  const m = moshi.array<number>([1]);
  expectTypeOf(m.value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with(4)).toEqualTypeOf(m);
  expectTypeOf(m.with(4).value()).toEqualTypeOf<number[]>();

  expectTypeOf(m.with<string>('string').value()).toEqualTypeOf<
    (number | string)[]
  >();

  // @ts-expect-error Enforcing number array
  assertType(moshi.array<number>(['string']));
});

test('enforce type of current array', () => {
  const m = moshi.array([1, 2, 3]);
  expectTypeOf(m.value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with(4)).toEqualTypeOf(m);
  expectTypeOf(m.with(4).value()).toEqualTypeOf<number[]>();

  // @ts-expect-error Type is enforced, can only be number
  assertType(m.with('string'));
});

test('enforce type of current array, functional arg', () => {
  const m = moshi.array([1, 2, 3]);
  expectTypeOf(m.value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with(() => 4)).toEqualTypeOf(m);
  expectTypeOf(m.with(() => 4).value()).toEqualTypeOf<number[]>();

  // @ts-expect-error Type is enforced, can only be number
  assertType(m.with(() => 'string'));
});

test('adding new type by specifying generic', () => {
  const m = moshi.array([1, 'string']);
  expectTypeOf(m.value()).toEqualTypeOf<(number | string)[]>();
  expectTypeOf(m.with(4)).toEqualTypeOf(m);
  expectTypeOf(m.with(4).value()).toEqualTypeOf<(number | string)[]>();

  // @ts-expect-error Type is enforced, can only be number | string
  assertType(m.with(true));

  const withBoolean = m.with<boolean>(true);
  expectTypeOf(withBoolean.value()).toEqualTypeOf<
    (number | string | boolean)[]
  >();
  assertType<(number | string | boolean)[]>(withBoolean.with(false).value());
});

test('conditions', () => {
  const m = moshi.array([1]);
  expectTypeOf(m.with(true, 2).value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with<string>(true, 'string').value()).toEqualTypeOf<
    (number | string)[]
  >();
  // The decision to include is in runtime, so we can't narrow the type during build.
  // This makes sense as types give the intention of "can be" instead of "it is".
  expectTypeOf(m.with<string>(false, 'string').value()).toEqualTypeOf<
    (number | string)[]
  >();
});

test('functional conditions', () => {
  const m = moshi.array([1]);
  expectTypeOf(m.with(() => true, 2).value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with<string>(() => true, 'string').value()).toEqualTypeOf<
    (number | string)[]
  >();
  expectTypeOf(m.with<string>(() => false, 'string').value()).toEqualTypeOf<
    (number | string)[]
  >();
});

test('conditions, functional arg', () => {
  const m = moshi.array([1]);
  expectTypeOf(m.with(true, () => 2).value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with<string>(true, () => 'string').value()).toEqualTypeOf<
    (number | string)[]
  >();
  // The decision to include is in runtime, so we can't narrow the type during build.
  // This makes sense as types give the intention of "can be" instead of "it is".
  expectTypeOf(m.with<string>(false, 'string').value()).toEqualTypeOf<
    (number | string)[]
  >();
});
