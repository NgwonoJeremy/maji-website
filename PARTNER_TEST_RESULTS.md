# Week 7 Partner Test Results

## Partner test execution

Pending. No partner contract or partner-authored test suite has been provided
yet, and no partner API URL is available here. Therefore, partner tests have
not been run against this API, and there are no partner findings to report.

## Local automated tests

`npm test` currently passes all 19 Jest/Supertest tests across the eight
requested endpoints. These tests exercise the Express routes and response
contracts, but mock the MySQL query layer. They are not evidence of partner
testing or of behavior against a live database.

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