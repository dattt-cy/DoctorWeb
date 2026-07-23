CREATE TABLE IF NOT EXISTS blog_post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt VARCHAR(500),
    content LONGTEXT,
    category VARCHAR(100),
    cover_image VARCHAR(500),
    status VARCHAR(50) DEFAULT 'DRAFT',
    reading_time INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    published_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    created_by VARCHAR(255),
    INDEX idx_blog_slug (slug),
    INDEX idx_blog_category (category),
    INDEX idx_blog_status (status)
);
