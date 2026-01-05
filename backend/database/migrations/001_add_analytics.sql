-- Migration: Add analytics columns to websites table
-- Run this migration to add view tracking and analytics support

USE launchweb;

-- Add analytics columns to websites table
ALTER TABLE websites 
  ADD COLUMN view_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER published_at,
  ADD COLUMN last_viewed_at DATETIME NULL AFTER view_count;

-- Create analytics table for detailed tracking
CREATE TABLE IF NOT EXISTS website_analytics (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  website_id BIGINT UNSIGNED NOT NULL,
  page_path VARCHAR(200) NULL,
  visitor_ip VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  referrer VARCHAR(512) NULL,
  viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_analytics_website_id (website_id),
  KEY idx_analytics_viewed_at (viewed_at),
  CONSTRAINT fk_analytics_website_id FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE
) ENGINE=InnoDB;
