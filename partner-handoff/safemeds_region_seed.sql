-- =====================================================================
-- SafeMeds demo data: regions that match the estates used in Maji
-- FOR THE SAFEMEDS TEAM. Run in the Supabase SQL editor (Postgres).
-- NOT part of Maji's own database; do not run this in MySQL.
--
-- Assumptions (please check against your table):
--   prescription_events(region text, illness_category text, dispensed_at timestamptz)
--   with id (and any other column) generated automatically.
--
-- Region format: nairobi-demo-<estate>, lower case, spaces become "-",
-- apostrophes dropped. Same style as your existing 'nairobi-demo-kibera'
-- (Kibera is already in your data, so it is left out below).
--
-- Estate (Maji)   -> region value
--   Kasarani      -> nairobi-demo-kasarani      Westlands   -> nairobi-demo-westlands
--   Ruiru         -> nairobi-demo-ruiru         Umoja       -> nairobi-demo-umoja
--   Githurai      -> nairobi-demo-githurai      Embakasi    -> nairobi-demo-embakasi
--   Kileleshwa    -> nairobi-demo-kileleshwa    Rongai      -> nairobi-demo-rongai
--   Madaraka      -> nairobi-demo-madaraka      Roysambu    -> nairobi-demo-roysambu
--   Kahawa        -> nairobi-demo-kahawa        Lang'ata    -> nairobi-demo-langata
--   South C       -> nairobi-demo-south-c       South B     -> nairobi-demo-south-b
--   Karen         -> nairobi-demo-karen         Kilimani    -> nairobi-demo-kilimani
--   Eastleigh     -> nairobi-demo-eastleigh     Ngong       -> nairobi-demo-ngong
--   Thika Road    -> nairobi-demo-thika-road    Tena        -> nairobi-demo-tena
--   Syokimau      -> nairobi-demo-syokimau      Lavington   -> nairobi-demo-lavington
--   Kitengela     -> nairobi-demo-kitengela     Kawangware  -> nairobi-demo-kawangware
--   Dagoretti     -> nairobi-demo-dagoretti     Buruburu    -> nairobi-demo-buruburu
--   Kangemi       -> nairobi-demo-kangemi       Parklands   -> nairobi-demo-parklands
--   Muthaiga      -> nairobi-demo-muthaiga      Imara Daima -> nairobi-demo-imara-daima
--
-- What it creates, per region:
--   * 1 Cholera prescription per day for the 7 days before yesterday (the
--     baseline), so every region has some history.
--   * For SPIKE regions only: 12 prescriptions yesterday. With a baseline
--     average of 1 per day this passes your rule (>= 5 and >= 3x), so an
--     alert appears. Other regions correctly return an empty list.
-- Alerts only show for 7 days, so re-run the spike part to refresh the demo.
-- Running this twice doubles the rows. To undo (keeps Kibera):
--   DELETE FROM prescription_events
--   WHERE region LIKE 'nairobi-demo-%' AND region <> 'nairobi-demo-kibera';
-- =====================================================================

-- 1) Baseline: one Cholera prescription per day, days -8 to -2
INSERT INTO prescription_events (region, illness_category, dispensed_at)
SELECT 'nairobi-demo-' || r.slug,
       'Cholera',
       date_trunc('day', now()) - (d || ' days')::interval + interval '12 hours'
FROM (VALUES
  ('kasarani'),('westlands'),('ruiru'),('umoja'),('githurai'),('embakasi'),
  ('kileleshwa'),('rongai'),('madaraka'),('roysambu'),('kahawa'),('langata'),
  ('south-c'),('south-b'),('karen'),('kilimani'),('eastleigh'),('ngong'),
  ('thika-road'),('tena'),('syokimau'),('lavington'),('kitengela'),
  ('kawangware'),('dagoretti'),('buruburu'),('kangemi'),('parklands'),
  ('muthaiga'),('imara-daima')
) AS r(slug)
CROSS JOIN generate_series(2, 8) AS d;

-- 2) Spike yesterday in a few regions (edit this list as you like)
INSERT INTO prescription_events (region, illness_category, dispensed_at)
SELECT 'nairobi-demo-' || s.slug,
       s.illness,
       date_trunc('day', now()) - interval '1 day' + (g || ' hours')::interval
FROM (VALUES
  ('kasarani',  'Cholera'),
  ('umoja',     'Typhoid'),
  ('embakasi',  'Cholera'),
  ('githurai',  'Typhoid'),
  ('ruiru',     'Cholera')
) AS s(slug, illness)
CROSS JOIN generate_series(1, 12) AS g;
