const { versions, currentVersion } = require("../server/partner");

// Real example bodies from SafeMeds' deprecation notice (12 Nov 2026).
const v1Body = [
  { productId: 22, productName: "Lifestraw Drops", averageRating: 5, reviewCount: 1, topComment: "Top quality stuff" },
  { productId: 19, productName: "Aquamira", averageRating: 4.9, reviewCount: 8, topComment: "Cleans water instantly every time" },
];
const v2Body = { data: v1Body, count: 2 };

test("v1 and v2 give Maji exactly the same thing", () => {
  expect(versions.v1.parse(v1Body)).toEqual(v1Body);
  expect(versions.v2.parse(v2Body)).toEqual(v1Body);
});

test("the wrong parser fails loudly, not quietly", () => {
  expect(() => versions.v1.parse(v2Body)).toThrow("unexpected v1 shape");
  expect(() => versions.v2.parse(v1Body)).toThrow("unexpected v2 shape");
});

test("v2 rejects a body with no data list", () => {
  expect(() => versions.v2.parse({ count: 0 })).toThrow("unexpected v2 shape");
  expect(() => versions.v2.parse(null)).toThrow("unexpected v2 shape");
});

test("each version calls its own path", () => {
  expect(versions.v1.path).toBe("/reviews");
  expect(versions.v2.path).toBe("/v2/reviews");
});

test("PARTNER_VERSION picks the version, and a typo fails loudly", () => {
  expect(currentVersion("v1")).toBe(versions.v1);
  expect(currentVersion("v2")).toBe(versions.v2);
  expect(() => currentVersion("v3")).toThrow("Unknown PARTNER_VERSION");
});