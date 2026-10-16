-- ratings.sql
-- Gives every verified vendor a rating between 3.0 and 5.0.
-- Without this, every vendor's rating is NULL and GET /api/vendors/top-rated
-- always returns an empty array.
-- Run AFTER vendors.sql. Safe to run more than once: it sets the same values each time.

UPDATE vendors
SET rating = ROUND(3 + MOD(id * 7, 21) / 10, 1)
WHERE is_verified = 1;