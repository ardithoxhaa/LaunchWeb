-- Check if analytics table exists and has data
SELECT 'Table exists' AS status FROM information_schema.tables 
WHERE table_schema = 'launchweb' AND table_name = 'website_analytics';

-- Show table structure
DESCRIBE website_analytics;

-- Show current data (if any)
SELECT COUNT(*) AS total_records FROM website_analytics;

-- Add some test data to verify dashboard works
INSERT INTO website_analytics (website_id, page_path, ip_address, user_agent, referrer, created_at) VALUES
(1, '/', '127.0.0.1', 'Mozilla/5.0 Test Browser', 'https://google.com', NOW() - INTERVAL 1 DAY),
(1, '/about', '192.168.1.1', 'Mozilla/5.0 Test Browser', 'https://facebook.com', NOW() - INTERVAL 2 DAY),
(2, '/', '10.0.0.1', 'Mozilla/5.0 Test Browser', NULL, NOW() - INTERVAL 3 DAY),
(2, '/contact', '172.16.0.1', 'Mozilla/5.0 Test Browser', 'https://twitter.com', NOW() - INTERVAL 4 DAY),
(3, '/', '203.0.113.1', 'Mozilla/5.0 Test Browser', 'https://linkedin.com', NOW() - INTERVAL 5 DAY);

-- Verify test data was added
SELECT 
  wa.website_id,
  w.name AS website_name,
  wa.page_path,
  wa.ip_address,
  wa.created_at
FROM website_analytics wa
JOIN websites w ON w.id = wa.website_id
ORDER BY wa.created_at DESC
LIMIT 10;
