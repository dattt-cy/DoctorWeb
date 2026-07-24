CREATE TABLE blog_post_revision (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt VARCHAR(500),
    content LONGTEXT,
    category VARCHAR(100),
    cover_image VARCHAR(500),
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    tags VARCHAR(500),
    created_at DATETIME NOT NULL,
    INDEX idx_revision_post_created (post_id, created_at),
    CONSTRAINT fk_revision_post FOREIGN KEY (post_id) REFERENCES blog_post(id) ON DELETE CASCADE
);
