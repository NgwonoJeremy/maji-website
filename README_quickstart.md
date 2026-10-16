# Maji Platform API: Quickstart

The quickstart, endpoint examples, error reference and local setup steps are now in the main [README.md](README.md).

Fastest check that the API is up:

```bash
curl https://maji-api-onrender-com.onrender.com/api/vendors/locations
```

You should get a JSON array of 50 vendors. The first request after about 15 minutes of no traffic can take up to a minute while the server wakes up.