-- A small, believable world for the agent to reason about. Timestamps are
-- relative to now() so the demo always looks like it is happening today.

INSERT INTO deploys (service, commit_sha, message, author, deployed_at) VALUES
  ('checkout', 'a41f9c2', 'Batch inventory lookups in cart summary', 'maria', now() - interval '52 minutes'),
  ('checkout', '7be01d4', 'Bump payment client to 4.2.0', 'dev-bot', now() - interval '3 hours'),
  ('search',   'c09e331', 'Switch ranking to v3 embeddings', 'tomas', now() - interval '26 minutes'),
  ('search',   '5d1a0e8', 'Add synonyms for seasonal queries', 'li', now() - interval '1 day'),
  ('auth',     'e2c7f10', 'Rotate session signing keys', 'sam', now() - interval '5 hours'),
  ('notify',   '91aa2b6', 'Retry webhook deliveries with jitter', 'priya', now() - interval '2 days');

INSERT INTO incidents (title, service, severity, status, summary, opened_at, updated_at) VALUES
  ('Checkout p95 latency over 2s', 'checkout', 'sev2', 'open',
   'Latency alert fired on POST /checkout. Customers report a slow spinner on the payment step.',
   now() - interval '41 minutes', now() - interval '41 minutes'),
  ('Search returns empty results for some queries', 'search', 'sev3', 'investigating',
   'Support has three tickets about searches like "winter jacket" returning nothing.',
   now() - interval '18 minutes', now() - interval '12 minutes'),
  ('Login failures for SSO users', 'auth', 'sev1', 'resolved',
   'Okta users could not sign in after key rotation. Rolled back signing key config.',
   now() - interval '5 hours', now() - interval '4 hours');

INSERT INTO incident_updates (incident_id, author, body, created_at) VALUES
  (2, 'li', 'Looking at the ranking service logs, nothing obvious yet.', now() - interval '12 minutes'),
  (3, 'sam', 'Rolled back the key rotation. Logins recovering.', now() - interval '4 hours 20 minutes'),
  (3, 'sam', 'Error rate back to baseline. Resolving.', now() - interval '4 hours');

-- One hour of per-minute metrics per service. Checkout degrades right after
-- the a41f9c2 deploy; search error rate creeps up after c09e331.
INSERT INTO metrics (service, minute, p95_ms, error_rate, rps)
SELECT s.service,
       date_trunc('minute', now()) - (m || ' minutes')::interval,
       CASE
         WHEN s.service = 'checkout' AND m < 52 THEN 1900 + (random() * 900)::int
         WHEN s.service = 'checkout' THEN 310 + (random() * 60)::int
         WHEN s.service = 'search' THEN 120 + (random() * 40)::int
         ELSE 80 + (random() * 30)::int
       END,
       CASE
         WHEN s.service = 'search' AND m < 26 THEN 0.04 + random() * 0.03
         WHEN s.service = 'checkout' AND m < 52 THEN 0.006 + random() * 0.004
         ELSE random() * 0.003
       END,
       CASE s.service WHEN 'checkout' THEN 180 WHEN 'search' THEN 640 ELSE 90 END + (random() * 40)::int
FROM (VALUES ('checkout'), ('search'), ('auth'), ('notify')) AS s(service),
     generate_series(0, 59) AS m;
