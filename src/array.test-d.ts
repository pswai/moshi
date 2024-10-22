import { test, expectTypeOf, assertType } from "vitest";
import moshi from "./moshi";

test("moshi all", () => {
  expectTypeOf(moshi).toHaveProperty("array");

  expectTypeOf(moshi.array).toBeFunction();
  expectTypeOf(moshi.array).toBeCallableWith([1, 2, 3]);

  // const m = moshi.array();
  // expectTypeOf(m.value()).toEqualTypeOf<unknown[]>();
  // expectTypeOf(m.with(1)).toEqualTypeOf(m);
  // expectTypeOf(m.with(1).value()).toEqualTypeOf<number[]>();

  const m2 = moshi.array([1, 2, 3]);
  expectTypeOf(m2.value()).toEqualTypeOf<number[]>();
  expectTypeOf(m2.with(4)).toEqualTypeOf(m2);
  expectTypeOf(m2.with(4).value()).toEqualTypeOf<number[]>();
  // @ts-expect-error
  assertType(m2.with("string"));

  const m3 = moshi.array([1, "string"]);
  expectTypeOf(m3.value()).toEqualTypeOf<(number | string)[]>();
  expectTypeOf(m3.with(4)).toEqualTypeOf(m3);
  expectTypeOf(m3.with(4).value()).toEqualTypeOf<(number | string)[]>();
  expectTypeOf(m3.with<boolean>(true).value()).toEqualTypeOf<
    (number | string | boolean)[]
  >();

  // @ts-expect-error
  assertType(m3.with(true));
});
