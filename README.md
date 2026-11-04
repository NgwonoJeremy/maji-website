# Maji Platform API

## Overview

Maji is a Kenyan water delivery platform that connects customers with water vendors, from orders as small as 20 litres. This API exposes five read-only endpoints for **SkillsBridge**: estates with active orders, active delivery schedules, top-rated vendors and vendor locations. SkillsBridge uses this data to recommend local skill-exchange sessions and to suggest water vendor stations as meetup venues.

- **Base URL:** `https://maji-api-onrender-com.onrender.com/api`
- **Rendered API docs:** [View the docs (Redoc)](https://redocly.github.io/redoc/?url=https://raw.githubusercontent.com/NgwonoJeremy/maji-website/main/openapi.yaml)
- **Contract:** [`openapi.yaml`](openapi.yaml)
- All five endpoints are `GET` and return a JSON array. Only `/vendors/locations` and `/vendors/all` take a parameter: an optional `estate` filter.

> **First request may be slow.** The API runs on Render's free tier, which sleeps after about 15 minutes without traffic. The first request after that can take up to a minute while the server wakes up. Later requests are fast.

## Quickstart

Paste this into a browser, or run it in a terminal:

```bash
curl https://maji-api-onrender-com.onrender.com/api/vendors/locations
```

You should get a JSON array of 50 vendors, starting with:

```json
[
  { "vendorId": 1, "businessName": "Chemchemi Fresh Water Co.", "estate": "Kasarani" },
  { "vendorId": 2, "businessName": "Maji Safi Enterprises", "estate": "Madaraka" }
]
```

## Authentication

Every endpoint needs an API key, sent in the X-API-Key header. Ask the Maji team for yours.
curl -H "X-API-Key: YOUR_API_KEY" https://maji-api-onrender-com.onrender.com/api/vendors/locations
| Situation | Status | Body |
|---|---|---|
| Key missing or wrong | 401 | { "error": "Missing or invalid API key" } |
| More than 100 requests per minute | 429 | { "error": "Too many requests", "retryAfterSeconds": 42 } |
A 429 also carries a Retry-After header (seconds to wait). 
Limit: 100 requests per minute per key

## Endpoints

The responses below are real output from the live API, shortened to the first items.

### 1. Estates with active orders

`GET /orders/active/estates`

Each estate that has at least one order with status `pending`, `accepted` or `on the way`. Each estate appears once.

```bash
curl https://maji-api-onrender-com.onrender.com/api/orders/active/estates
```

Response `200` (first 2 of 23):

```json
[
  { "estate": "Lang'ata" },
  { "estate": "South C" }
]
```

| Field | Type | Required |
|---|---|---|
| estate | string | yes |

### 2. Delivery schedules for active orders

`GET /orders/active/schedules`

Each distinct estate and delivery window among active orders. An estate can appear more than once if it has orders in different windows.

```bash
curl https://maji-api-onrender-com.onrender.com/api/orders/active/schedules
```

Response `200` (first 2 of 24):

```json
[
  { "estate": "Lang'ata", "deliveryTime": "Afternoon (12pm - 6pm)" },
  { "estate": "South C", "deliveryTime": "Morning (6am - 12pm)" }
]
```

| Field | Type | Required | Notes |
|---|---|---|---|
| estate | string | yes | |
| deliveryTime | string | yes | A delivery window such as `Morning (6am - 12pm)`, not a clock time |

### 3. Top-rated vendors

`GET /vendors/top-rated`

The highest-rated **verified** vendor in each estate. If two vendors in an estate share the top rating, both are returned.

```bash
curl https://maji-api-onrender-com.onrender.com/api/vendors/top-rated
```

Response `200` (first 2 of 18):

```json
[
  {
    "vendorId": 17,
    "businessName": "AquaFresh Nairobi",
    "estate": "Dagoretti",
    "rating": 4.4,
    "isVerified": true,
    "isOnline": false,
    "ownerName": "Daniel Mutua",
    "phone": "0718045704"
  },
  {
    "vendorId": 27,
    "businessName": "Fadhili Water Enterprises",
    "estate": "Eldoret (Nairobi Area)",
    "rating": 3,
    "isVerified": true,
    "isOnline": false,
    "ownerName": "Eliud Kipchoge",
    "phone": "0718124894"
  }
]
```

| Field | Type | Required | Notes |
|---|---|---|---|
| vendorId | integer | yes | |
| businessName | string | yes | |
| estate | string | yes | |
| rating | number | yes | Between 3 and 5. Whole numbers appear without a decimal (`3`, not `3.0`) |
| isVerified | boolean | yes | Always `true` for this endpoint |
| isOnline | boolean | yes | |
| ownerName | string | no | |
| phone | string | no | Kept as a string to preserve the leading `0` |

### 4. Vendor locations

`GET /vendors/locations`

Every vendor's station (business) name and primary estate. Add the optional `estate` parameter to get only the vendors in one estate.

| Query parameter | Required | Description |
|---|---|---|
| `estate` | no | Only return vendors in this estate, e.g. `Kasarani`. Must match Maji's spelling (e.g. `Lang'ata`, not `Langata`); capitalisation is ignored. Omit it to get all vendors. |

**All vendors:**

```bash
curl https://maji-api-onrender-com.onrender.com/api/vendors/locations
```

Response `200` (first 2 of 50):

```json
[
  { "vendorId": 1, "businessName": "Chemchemi Fresh Water Co.", "estate": "Kasarani" },
  { "vendorId": 2, "businessName": "Maji Safi Enterprises", "estate": "Madaraka" }
]
```

| Field | Type | Required |
|---|---|---|
| vendorId | integer | yes |
| businessName | string | yes |
| estate | string | yes |

**Vendors in one estate:**

```bash
curl "https://maji-api-onrender-com.onrender.com/api/vendors/locations?estate=Kasarani"
```

Response `200`:

```json
[
  { "vendorId": 1, "businessName": "Chemchemi Fresh Water Co.", "estate": "Kasarani" },
  { "vendorId": 30, "businessName": "Waridi Water Co.", "estate": "Kasarani" }
]
```

- An estate with no vendors returns `200` with an empty array `[]`.
- An empty value (`?estate=`) returns `400` with `{ "error": "estate must be a non-empty string" }`.
- In code, encode the estate name, e.g. `encodeURIComponent("Lang'ata")`. Use `/orders/active/estates` to see Maji's estate names.

### 5. All vendors

`GET /vendors/all`

Every vendor with business name, estate, rating, status and owner contact details, ordered by estate then rating (highest first). Add the optional `estate` parameter to get only the vendors in one estate.

```bash
curl https://maji-api-onrender-com.onrender.com/api/vendors/all
curl "https://maji-api-onrender-com.onrender.com/api/vendors/all?estate=Kasarani"
```

| Field | Type | Required | Notes |
|---|---|---|---|
| vendorId | integer | yes | |
| businessName | string | yes | |
| estate | string | yes | |
| rating | number | yes | |
| isVerified | boolean | yes | |
| isOnline | boolean | yes | |
| ownerName | string | no | |
| phone | string | no | Kept as a string to preserve the leading `0` |

An empty `estate` (`/vendors/all?estate=`) returns `400` with `{ "error": "estate must be a non-empty string" }`.

## Errors

A successful call always returns status `200` and a JSON **array**. Check the status code first, because failures look different:

| Situation | Status | Body |
|---|---|---|
| `estate` given but empty (`/vendors/locations?estate=`) | `400` | `{ "error": "estate must be a non-empty string" }` |
| Server can't reach the database | `500` | JSON object with an `error` field (see below) |
| Mistyped path (e.g. `/vendors/toprated`) | `404` | **HTML page, not JSON:** `<pre>Cannot GET /api/vendors/toprated</pre>` |
| Server waking from sleep | — | No response for up to a minute, then a normal `200` |

Real `500` response from `/vendors/locations`, captured while the database was unreachable:

```json
{ "error": "Failed to fetch vendor locations" }
```

The `error` text for each endpoint:

| Endpoint | `error` value |
|---|---|
| `/orders/active/estates` | `Failed to fetch active estates` |
| `/orders/active/schedules` | `Failed to fetch active delivery schedules` |
| `/vendors/top-rated` | `Failed to fetch top-rated vendors` |
| `/vendors/locations` | `Failed to fetch vendor locations` |

If you get a `404` HTML page, check the path spelling and that it starts with `/api`.

## Run the API locally

Requires [Node.js](https://nodejs.org/) and a MySQL or MariaDB database (for example, XAMPP).

**1. Clone and install**

```bash
git clone https://github.com/NgwonoJeremy/maji-website.git
cd maji-website
npm install
```

**2. Create the database**

Create an empty database (for example `maji_platform`) in phpMyAdmin. Open its **SQL** tab, paste the full contents of [`db/railway_setup.sql`](db/railway_setup.sql) and click **Go**. This creates the tables and loads 100 customers, 50 vendors and 50 orders. The last query prints the counts, which should be `100, 50, 50, 25`.

Run it **once** on an empty database. Running it again duplicates vendors and orders.

**3. Create a `.env` file** in the project root (copy `.env.example`) and fill in your database details:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=maji_platform
DB_USER=root
DB_PASSWORD=
JWT_SECRET=any-long-random-string
PORT=3001
```

`DB_PASSWORD` is empty for a default XAMPP install. `JWT_SECRET` is only used by the login route, but it must be set.

**4. Start the server**

```bash
npm run server
```

You should see:

```
Server running on http://localhost:3001
Connected to MySQL — maji_platform
```

**5. Try it**

```bash
curl http://localhost:3001/api/vendors/locations
```

## About the web app

This repository also contains the Maji web app (React, Leaflet, FontAwesome) for customers, vendors and admins. To run it, start the API as above, then in a second terminal:

```bash
npm run dev
```

and open `http://localhost:5173`.