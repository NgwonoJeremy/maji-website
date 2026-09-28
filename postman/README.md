# Maji API Automated Tests

This folder contains the Postman collection export and instructions for running its API checks.

- Collection export: [`Maji_API_Automated_Tests.postman_collection.json`](Maji_API_Automated_Tests.postman_collection.json)
- Postman account: [Maji API Automated Tests](https://davidmukoya-1761966.postman.co/workspace/2fcf4719-74eb-4a20-82c9-969393dda05e/collection/58575069-30117d3c-d1e7-4aae-a495-6466b83ffc09)
- Postman workspace: David Mukoya's Workspace

## Prerequisites

- Node.js and npm installed, with project dependencies installed using `npm install`.
- MySQL configured and seeded for this project. The API reads `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` from the project `.env` file.
- A customer ID for the update and create-order requests.
- A disposable vendor ID for the update and delete requests.

## Start the API

From the repository root, start the API with:

```bash
npm run server
```

The server listens on `http://localhost:3001` by default. If `PORT` is set in `.env`, it listens on that port instead.

## Configure and run in Postman

Import the collection JSON above if it is not already in your Postman workspace. Set these collection variables before running:

| Variable | Default | Description |
| --- | --- | --- |
| `baseUrl` | `http://localhost:3001/api` | Local API base URL, including `/api` |
| `customerId` | blank | Existing customer record ID |
| `vendorId` | blank | Disposable vendor record ID |

Run the collection from Postman. The GET requests only read data. The POST creates and persists an order. The PUT requests modify the selected customer and vendor records. **DELETE Vendor permanently deletes the selected vendor.** Use test records and do not run the collection against production data.

## Endpoint coverage

| Request | Method and path | Success check |
| --- | --- | --- |
| GET Active Estates | `GET /api/orders/active/estates` | HTTP 200; array entries have an `estate` string |
| GET Active Schedules | `GET /api/orders/active/schedules` | HTTP 200; array entries have `estate` and `deliveryTime` |
| GET Top Rated Vendors | `GET /api/vendors/top-rated` | HTTP 200; verified vendors have ratings from 3 through 5 |
| GET Vendor Locations | `GET /api/vendors/locations` | HTTP 200; entries have vendor ID, business name, and estate |
| POST Create Order | `POST /api/orders` | HTTP 201; response includes the created pending order |
| PUT Update Customer | `PUT /api/customers/{{customerId}}` | HTTP 200; response includes updated customer fields |
| PUT Update Vendor | `PUT /api/vendors/{{vendorId}}` | HTTP 200; response includes updated vendor fields |
| DELETE Vendor | `DELETE /api/vendors/{{vendorId}}` | HTTP 204; response body is empty |

Each request includes Postman test scripts for its expected status and response shape. These checks require the API and database to be running; syntax validation alone does not verify database behavior.

## Week 7 lab tests

The Postman collection is useful for manual/collection-runner checks, but the
Week 7 lab also requires automated tests in the repository. Run those from the
project root with `npm test`. The Jest/Supertest suite is in `__tests__/` and
calls the Express app directly; its SQL layer is mocked, so it does not count
as partner testing against a live database. Partner exchange progress and
results belong in [`../PARTNER_TEST_RESULTS.md`](../PARTNER_TEST_RESULTS.md).
