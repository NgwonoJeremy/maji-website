// The ONE place that knows the shape of SafeMeds' /reviews response (v1 or v2).

const pick = (r) => ({
  productId: r.productId,
  productName: r.productName,
  averageRating: r.averageRating,
  reviewCount: r.reviewCount,
  topComment: r.topComment,
});
 
const versions = {
  v1: {
    path: "/reviews",
    parse: (body) => {
      if (!Array.isArray(body)) throw new Error("unexpected v1 shape");
      return body.map(pick);
    },
  },
  v2: {
    path: "/v2/reviews",
    parse: (body) => {
      if (!body || !Array.isArray(body.data)) throw new Error("unexpected v2 shape");
      return body.data.map(pick);
    },
  },
};
 
// Picks the version from .env (PARTNER_VERSION=v1 or v2). A typo fails loudly at startup.
function currentVersion(name = process.env.PARTNER_VERSION || "v1") {
  const ver = versions[name];
  if (!ver) throw new Error(`Unknown PARTNER_VERSION "${name}" (use v1 or v2)`);
  return ver;
}
 
module.exports = { versions, currentVersion };