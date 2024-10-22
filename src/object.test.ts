// import { expect, test } from "vitest";
// import moshi from "./moshi";

// test("build object", () => {
//   const result = moshi()
//     .with({ first: 1, firstAgain: 10 })
//     .with({ is: 2 })
//     .with({ in: 3 })
//     .toObject();

//   expect(result).toEqual({
//     first: 1,
//     firstAgain: 10,
//     is: 2,
//     in: 3,
//   });
// });

// test("build object 2", () => {
//   const result = moshi()
//     .with(true, { yes: 1 })
//     .with(false, { no: 2 })
//     .with(1, { "yes 2": 3 })
//     .toObject();

//   expect(result).toEqual({
//     yes: 1,
//     "yes 2": 3,
//   });
// });

// test("build object 3", () => {
//   const result = moshi()
//     .with(true, () => ({ yes: 1 }))
//     .with(false, () => ({ no: 2 }))
//     .with(1, () => ({ "yes 2": 3 }))
//     .toObject();

//   expect(result).toEqual({
//     yes: 1,
//     "yes 2": 3,
//   });
// });

// test("build object 3-1", () => {
//   const result = moshi()
//     .with(
//       () => true,
//       () => ({ yes: 1 })
//     )
//     .with(
//       () => false,
//       () => ({ no: 2 })
//     )
//     .with(
//       () => 1,
//       () => ({ "yes 2": 3 })
//     )
//     .toObject();

//   expect(result).toEqual({
//     yes: 1,
//     "yes 2": 3,
//   });
// });

// test("build object 4", () => {
//   const result = moshi()
//     .and(false, false, { no: 1 })
//     .and(false, true, { "no 2": 2 })
//     .and(true, false, { "no 3": 3 })
//     .and(true, true, { yes: 4 })
//     .toObject();

//   expect(result).toEqual({
//     yes: 4,
//   });
// });

// test("build object 4-1", () => {
//   const result = moshi()
//     .and(false, () => false, { no: 1 })
//     .and(() => false, true, { "no 2": 2 })
//     .and(() => true, false, { "no 3": 3 })
//     .and(true, () => true, { yes: 4 })
//     .toObject();

//   expect(result).toEqual({
//     yes: 4,
//   });
// });

// test("build object 5", () => {
//   const result = moshi()
//     .or(false, false, { no: 1 })
//     .or(false, true, { yes: 2 })
//     .or(true, false, { "yes 2": 3 })
//     .or(true, true, { "yes 3": 4 })
//     .toObject();

//   expect(result).toEqual({
//     yes: 2,
//     "yes 2": 3,
//     "yes 3": 4,
//   });
// });

// test("build object 5-1", () => {
//   const result = moshi()
//     .or(false, () => false, { no: 1 })
//     .or(() => false, true, { yes: 2 })
//     .or(() => true, false, { "yes 2": 3 })
//     .or(true, () => true, { "yes 3": 4 })
//     .toObject();

//   expect(result).toEqual({
//     yes: 2,
//     "yes 2": 3,
//     "yes 3": 4,
//   });
// });
