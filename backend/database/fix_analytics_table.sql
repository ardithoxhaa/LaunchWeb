-- Fix analytics table if it exists but has issues
DROP TABLE IF EXISTS website_analytics;

-- Recreate table with correct structure
CREATE TABLE website_analytics (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  website_id BIGINT UNSIGNED NOT NULL,
  page_path VARCHAR(255) NOT NULL DEFAULT '/',
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_website_created (website_id, created_at),
  INDEX idx_created_date (created_at),
  CONSTRAINT fk_website_analytics_website FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
