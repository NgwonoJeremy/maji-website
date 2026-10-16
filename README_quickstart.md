# Maji Platform - SkillsBridge API


## Overview

The Maji Platform SkillsBridge API is a read-only API exposed by Maji so that SkillsBridge can read estate, vendor and active delivery schedule information. It is intended for the SkillsBridge integration; for example, SkillsBridge uses vendor locations to suggest water vendor stations as physical meetup venues for skill sessions.

- Version: 1.0.0 (OpenAPI 3.0.0)
- The four endpoints below are all `GET` and return JSON arrays.
- Base URL: `<BASE_URL>` (locally: `http://localhost:<PORT>/api`)
- Rendered API docs: `<LINK_TO_SWAGGER_OR_REDOC_PAGE>`
- The Maji platform also has other internal endpoints (orders, customers, vendor updates). They are not part of the SkillsBridge integration and are not documented here.

## Authentication

`<"No authentication is required for now.">`

## Endpoints

### 1. Estates with active orders

`GET /orders/active/estates`

Estates where active orders are taking place. No parameters.

```bash
curl <BASE_URL>/orders/active/estates
```

Response `200` (replace with your real output):

```json
[
  { "estate": "Kasarani" }
]
```

### 2. Delivery schedules for active orders

`GET /orders/active/schedules`

Active delivery schedules by estate. No parameters.

```bash
curl <BASE_URL>/orders/active/schedules
```

Response `200` (replace with your real output):

```json
[
  { "estate": "Kasarani", "deliveryTime": "14:00" }
]
```

### 3. Top-rated vendors

`GET /vendors/top-rated`

Top-rated vendors and their business information. No parameters.

```bash
curl <BASE_URL>/vendors/top-rated
```

Response `200` (replace with your real output):

```json
[
  {
    "vendorId": 7,
    "businessName": "Maji Fresh",
    "estate": "Kasarani",
    "rating": 4.8,
    "isVerified": true,
    "isOnline": true,
    "ownerName": "John Doe",
    "phone": "0712345678"
  }
]
```

| Field | Type | Required |
|---|---|---|
| vendorId | integer | yes |
| businessName | string | yes |
| estate | string | yes |
| rating | number | yes |
| isVerified | boolean | yes |
| isOnline | boolean | yes |
| ownerName | string | no |
| phone | string | no |

### 4. Vendor locations

`GET /vendors/locations`

Each water vendor's station name and primary target estate. No parameters.

```bash
curl <BASE_URL>/vendors/locations
```

Response `200` (replace with your real output):

```json
[
  { "vendorId": 7, "businessName": "Maji Fresh", "estate": "Kasarani" }
]
```

## Errors

If something goes wrong on the server, these endpoints return status `500` with a JSON body containing an `error` message:

| Endpoint | Status | Body |
|---|---|---|
| `/orders/active/estates` | 500 | `{ "error": "Failed to fetch active estates" }` |
| `/orders/active/schedules` | 500 | `{ "error": "Failed to fetch active delivery schedules" }` |
| `/vendors/top-rated` | 500 | `{ "error": "Failed to fetch top-rated vendors" }` |
| `/vendors/locations` | 500 | `{ "error": "Failed to fetch vendor locations" }` |



## Run locally

Requires Node.js and a MySQL database.

```bash
git clone <https://github.com/NgwonoJeremy/maji-website.git>
cd <YOUR_REPO_FOLDER>
npm install
<create your .env file: list the variable names your db.js reads>
<database setup: how to create the tables and any seed data>
npm run server
```

The server listens on port `<PORT>`. Then run the quickstart below.

## Quickstart

```bash
curl http://localhost:<PORT>/api/vendors/locations
```


