import { test, expectTypeOf, assertType } from "vitest";
import moshi from "./moshi";

test("array function", () => {
  expectTypeOf(moshi).toHaveProperty("array");

  expectTypeOf(moshi.array).toBeFunction();
  expectTypeOf(moshi.array).toBeCallableWith([1, 2, 3]);
  expectTypeOf(moshi.array).toBeCallableWith([1, 'string', false]);
});

test("enforce type of current array", () => {
  const m = moshi.array([1, 2, 3]);
  expectTypeOf(m.value()).toEqualTypeOf<number[]>();
  expectTypeOf(m.with(4)).toEqualTypeOf(m);
  expectTypeOf(m.with(4).value()).toEqualTypeOf<number[]>();

  // @ts-expect-error Type is enforced, can only be number
  assertType(m.with("string"));
});

test("adding new type by specifying generic", () => {
  const m = moshi.array([1, "string"]);
  expectTypeOf(m.value()).toEqualTypeOf<(number | string)[]>();
  expectTypeOf(m.with(4)).toEqualTypeOf(m);
  expectTypeOf(m.with(4).value()).toEqualTypeOf<(number | string)[]>();

  // @ts-expect-error Type is enforced, can only be number | string
  assertType(m.with(true));

  const withBoolean = m.with<boolean>(true);
  expectTypeOf(withBoolean.value()).toEqualTypeOf<
    (number | string | boolean)[]
  >();
  assertType<(number | string | boolean)[]>(withBoolean.with(false).value())
});
