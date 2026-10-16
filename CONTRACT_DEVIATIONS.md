# CONTRACT_DEVIATIONS.md

Contract Changes

The original SkillsBridge–Maji contract was revised after reviewing the actual API scope and implementation requirements.
The new contract now contains four read-only GET endpoints focused on the data SkillsBridge needs from Maji.

To implement the other APIs, we created a practice.js file where we created various APIs that use various method (PUT, DELETE, POST) for Maji only.


1. Estate Endpoint: GET /estates
The original response contained: id,name and deliveryStatus. It also accepted an optional deliveryStatus query parameter.
New version: GET /orders/active/estates
The response now contains: estate
Why?It  directly represents the requirement to identify estates where active orders are taking place. The response was simplified to return the estate information required by the revised SkillsBridge integration.

2. Vendor Station Endpoint: GET /vendors/stations
The original response contained:vendorId,stationName,targetEstateId
We change it in order to use the vendor information represented by the Maji API and database: the vendor ID, business/station name, and estate.
New Version: GET /vendors/locations
Contains:vendorId, businessName, estate


3. Customer Payment Method Endpoint: GET /customers/payment-method
This endpoint returned: customerId and paymentMethod
It was removed from the SkillsBridge contract.
The revised SkillsBridge contract is limited to the read-only estate, delivery-schedule, and vendor information represented by the four final GET endpoints.

4. Customer Delete Endpoint

Original:DELETE /customers/{id}
This endpoint was removed from the SkillsBridge contract because this endpoint was also not listed as a need from SkillBridge.

5. Driver Interest Endpoint: POST /estates/{estateId}/driver-interests
This endpoint was removed from the SkillsBridge apicontract because driver-interest creation is therefore outside maji juridiction. 

Additions to contract:

6. Active Delivery Schedule Endpoint: GET /orders/active/schedule

Maji explicitly exposes active delivery schedules so that SkillsBridge can read delivery timing information by estate.

7. Top-Rated Vendor Endpoint: GET /vendors/top-rated

Maji exposes vendor information required by the revised SkillsBridge integration, including vendor rating and availability information.
## Week 8 changes to openapi.yaml

8. Servers added
Added a `servers` section listing the live URL (`https://maji-api-onrender-com.onrender.com/api`) and the local URL (`http://localhost:3001/api`), so the rendered docs show where to send requests.
Why? The original contract had no base URL, so a reader of the docs couldn't make a request without asking us.

9. 500 error response documented
Each endpoint now lists a `500` response with the body `{ "error": "<message>" }`.
Why? The implementation already returned this when the database is unreachable, but the contract only described the `200` case.

10. Examples replaced with real data
The examples now come from real API responses. The biggest change is `deliveryTime`: the old example was `"14:00"`, but the real values are delivery windows such as `"Afternoon (12pm - 6pm)"`.
Why? The type (string) was always correct, but the old example suggested a clock time, which would mislead a consumer parsing the field.

No endpoint paths, field names or field types changed.