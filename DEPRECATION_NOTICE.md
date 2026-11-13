# Maji API: Update to the Active Estates Endpoint

**To:** SkillBridge  
**From:** Maji, Team 4
**Date:** 12 November 2026


Good morning SkillBridge,

We have  released a new version (v2) of our active estates endpoint, and we'd like you to start using it.

The current v1 endpoint will be retired on **13 November 2026**, so please make sure to update your integration before then.

## What has changed?

The main change is how we return the list of active estates.

In v1, the API returns a list directly:

**v1 –** `GET /api/orders/active/estates`

```json
[
  { "estate": "Kasarani" },
  { "estate": "Roysambu" }
]
```

In v2, the list is wrapped in an object containing `data` and `count`:

**v2 –** `GET /api/v2/orders/active/estates`

```json
{
  "data": [
    { "estate": "Kasarani" },
    { "estate": "Roysambu" }
  ],
  "count": 2
}
```

Everything else stays the same. The `estate` field, your API key, the rate limit and our other endpoints (schedules and vendors) are not affected.

## Why are we making this change?

We want to make it easier to introduce additional features in the future, particularly pagination and totals, without having to change the response structure again.

## What do you need to do?

The migration should be straightforward:

1. Update your request URL to `/api/v2/orders/active/estates`.
2. Instead of reading the list directly from the response body, access it through `body.data`.
3. You can continue using the same API key (`X-API-Key`). The rate limit also remains unchanged.
4. Test the new endpoint and let us know once you've migrated so we can confirm the v2 requests in our logs.

## Migration timeline

- **12 November 2026:** v2 is available. v1 continues to work but now includes `Deprecation`, `Sunset` and `Link` headers to indicate the upcoming change.
- **13 November 2026:** v1 will stop working.

We recommend making the switch as soon as possible to avoid any interruption to your integration.


If anything is unclear or you run into issues during the migration, feel free to reach out to us. 
Thank you. 

 
**Maji – Team 4**