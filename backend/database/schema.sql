CREATE DATABASE IF NOT EXISTS launchweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE launchweb;

CREATE TABLE roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_id INT UNSIGNED NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB;

CREATE TABLE refresh_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_tokens_hash (token_hash),
  KEY idx_refresh_tokens_user_id (user_id),
  CONSTRAINT fk_refresh_tokens_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE businesses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  industry VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_businesses_user_id (user_id),
  CONSTRAINT fk_businesses_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE templates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  preview_image_url VARCHAR(512) NULL,
  structure_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE websites (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  business_id BIGINT UNSIGNED NOT NULL,
  template_id BIGINT UNSIGNED NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  status ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  settings_json JSON NOT NULL,
  seo_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  published_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_websites_slug (slug),
  KEY idx_websites_business_id (business_id),
  KEY idx_websites_template_id (template_id),
  CONSTRAINT fk_websites_business_id FOREIGN KEY (business_id) REFERENCES businesses (id) ON DELETE CASCADE,
  CONSTRAINT fk_websites_template_id FOREIGN KEY (template_id) REFERENCES templates (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  website_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  path VARCHAR(200) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  meta_json JSON NOT NULL,
  builder_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_website_path (website_id, path),
  KEY idx_pages_website_id (website_id),
  CONSTRAINT fk_pages_website_id FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE components (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(60) NOT NULL,
  order_index INT NOT NULL,
  props_json JSON NOT NULL,
  style_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_components_page_id (page_id),
  CONSTRAINT fk_components_page_id FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  website_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  type ENUM('IMAGE','FILE') NOT NULL,
  url VARCHAR(1024) NOT NULL,
  meta_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_assets_website_id (website_id),
  KEY idx_assets_user_id (user_id),
  CONSTRAINT fk_assets_website_id FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE,
  CONSTRAINT fk_assets_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE website_versions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  website_id BIGINT UNSIGNED NOT NULL,
  version_number INT NOT NULL,
  snapshot_json JSON NOT NULL,
  created_by_user_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_versions_website_version (website_id, version_number),
  KEY idx_versions_website_id (website_id),
  CONSTRAINT fk_versions_website_id FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE,
  CONSTRAINT fk_versions_created_by_user_id FOREIGN KEY (created_by_user_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB;
