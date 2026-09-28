# Week 7 Partner Test Results

## Partner test execution

Pending. No partner contract or partner-authored test suite has been provided
yet, and no partner API URL is available here. Therefore, partner tests have
not been run against this API, and there are no partner findings to report.

## Local automated tests

**Execution result:** `npm test` passed on 2026-09-29: 3 test suites passed,
29 tests passed, 0 failed. The command runs Jest in-band and exercises the
Express app through Supertest.

| Test file | Coverage |
| --- | --- |
| `__tests__/customers.test.js` | Customer update success and response shape; missing and wrong-typed fields; omitted optional estate; unknown and non-numeric customer IDs. |
| `__tests__/orders.test.js` | Active-estate and schedule responses, including empty results; order creation success; missing fields, zero or wrongly typed values, unknown customer, and unknown supplied vendor. |
| `__tests__/vendors.test.js` | Top-rated vendors and vendor locations, including empty results and response types; vendor update success and validation; unknown and non-numeric IDs; vendor deletion success and not-found behavior. |

The suite checks response status codes and bodies, and verifies invalid inputs
are rejected before any database query is made. Its MySQL query layer is
mocked, so these results cover route behavior and response contracts, not live
database integration. The Postman collection also contains request test
scripts, but no collection-run result is recorded here. These results are not
evidence of partner testing.

## Findings and classification

- **Real bug fixed:** Creating an order with `volume: 0` was rejected as
  “All fields are required” before the positive-volume validation ran. The
  required-field check now distinguishes a missing volume from zero, allowing
  the endpoint to return its specific “Volume must be greater than 0” response.
- **Contract ambiguities:** Not assessed; partner tests have not been received.
- **Misunderstandings:** Not assessed; partner tests have not been received.
- **Partner findings against this API:** Pending partner test execution.
- **Our findings against the partner API:** Pending receipt of the partner's
  contract and a reachable server.

## Next steps

Exchange `openapi.yaml` with the ring partner, receive their contract, prepare
tests from that contract, and run both test suites against the other person's
reachable API. Update this report with the actual failures, fixes, and
classifications after that exchange.