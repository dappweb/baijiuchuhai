
-- 百酒出海数据库结构
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image_url TEXT,
  publish_date TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE site_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_key TEXT NOT NULL UNIQUE, -- 例如 'home_cta_title', 'seo_main_title'
  content_value TEXT,
  last_updated INTEGER DEFAULT (unixepoch())
);
