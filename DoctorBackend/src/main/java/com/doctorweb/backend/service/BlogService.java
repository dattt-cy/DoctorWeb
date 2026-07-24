package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.BlogPost;
import com.doctorweb.backend.repository.BlogPostRepository;
import com.doctorweb.backend.repository.BlogPostRevisionRepository;
import com.doctorweb.backend.domain.BlogPostRevision;
import com.doctorweb.backend.global.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.regex.Pattern;
import java.nio.charset.StandardCharsets;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

@Service
@Transactional
public class BlogService {

    private final BlogPostRepository blogPostRepository;
    private final BlogPostRevisionRepository revisionRepository;

    public BlogService(BlogPostRepository blogPostRepository, BlogPostRevisionRepository revisionRepository) {
        this.blogPostRepository = blogPostRepository;
        this.revisionRepository = revisionRepository;
    }

    public Page<BlogPost> getAllPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable);
    }

    public Page<BlogPost> getPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByStatus("PUBLISHED", pageable);
    }

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));
    }

    public BlogPost getPostBySlug(String slug) {
        return blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));
    }

    public BlogPost getPublishedPostBySlug(String slug) {
        return blogPostRepository.findBySlugAndStatus(slug, "PUBLISHED")
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));
    }

    public BlogPost createPost(BlogPost post) {
        post.setStatus(normalizeStatus(post.getStatus()));
        post.setSlug(generateSlug(post.getTitle()));
        post.setContent(sanitizeContent(post.getContent()));
        post.setReadingTime(calculateReadingTime(post.getContent()));
        if (post.getFeatured() == null) {
            post.setFeatured(false);
        }
        if (post.getViewCount() == null) {
            post.setViewCount(0L);
        }
        if ("PUBLISHED".equals(post.getStatus()) && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        return blogPostRepository.save(post);
    }

    public BlogPost updatePost(Long id, BlogPost updatedPost) {
        BlogPost existingPost = getPostById(id);
        createRevision(existingPost);
        return applyUpdate(existingPost, updatedPost);
    }

    public BlogPost autosavePost(Long id, BlogPost updatedPost) {
        return applyUpdate(getPostById(id), updatedPost);
    }

    private BlogPost applyUpdate(BlogPost existingPost, BlogPost updatedPost) {
        
        if (!existingPost.getTitle().equals(updatedPost.getTitle())) {
            existingPost.setTitle(updatedPost.getTitle());
            // Giữ URL ổn định sau khi tạo để không làm hỏng backlink và thứ hạng SEO.
        }
        
        existingPost.setExcerpt(updatedPost.getExcerpt());
        existingPost.setContent(sanitizeContent(updatedPost.getContent()));
        existingPost.setReadingTime(calculateReadingTime(existingPost.getContent()));
        existingPost.setCategory(updatedPost.getCategory());
        existingPost.setCoverImage(updatedPost.getCoverImage());
        existingPost.setCoverImageAlt(updatedPost.getCoverImageAlt());
        existingPost.setCoverPositionX(updatedPost.getCoverPositionX() == null ? 50 : updatedPost.getCoverPositionX());
        existingPost.setCoverPositionY(updatedPost.getCoverPositionY() == null ? 50 : updatedPost.getCoverPositionY());
        if (updatedPost.getFeatured() != null) {
            existingPost.setFeatured(updatedPost.getFeatured());
        }
        existingPost.setSeoTitle(updatedPost.getSeoTitle());
        existingPost.setSeoDescription(updatedPost.getSeoDescription());
        existingPost.setPrimaryKeyword(updatedPost.getPrimaryKeyword());
        existingPost.setTags(updatedPost.getTags());
        
        String newStatus = normalizeStatus(updatedPost.getStatus());
        if (!existingPost.getStatus().equals(newStatus)) {
            existingPost.setStatus(newStatus);
            if ("PUBLISHED".equals(newStatus) && existingPost.getPublishedAt() == null) {
                existingPost.setPublishedAt(LocalDateTime.now());
            }
        }
        
        return blogPostRepository.save(existingPost);
    }

    public java.util.List<BlogPostRevision> getRevisions(Long postId) {
        getPostById(postId);
        return revisionRepository.findTop20ByPostIdOrderByCreatedAtDesc(postId);
    }

    public BlogPost restoreRevision(Long postId, Long revisionId) {
        BlogPost post = getPostById(postId);
        BlogPostRevision revision = revisionRepository.findById(revisionId)
                .filter(item -> item.getPostId().equals(postId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên bản"));
        createRevision(post);
        post.setTitle(revision.getTitle());
        post.setExcerpt(revision.getExcerpt());
        post.setContent(revision.getContent());
        post.setCategory(revision.getCategory());
        post.setCoverImage(revision.getCoverImage());
        post.setSeoTitle(revision.getSeoTitle());
        post.setSeoDescription(revision.getSeoDescription());
        post.setTags(revision.getTags());
        post.setReadingTime(calculateReadingTime(post.getContent()));
        return blogPostRepository.save(post);
    }

    private void createRevision(BlogPost post) {
        revisionRepository.save(BlogPostRevision.builder()
                .postId(post.getId()).title(post.getTitle()).excerpt(post.getExcerpt())
                .content(post.getContent()).category(post.getCategory()).coverImage(post.getCoverImage())
                .seoTitle(post.getSeoTitle()).seoDescription(post.getSeoDescription()).tags(post.getTags())
                .createdAt(LocalDateTime.now()).build());
    }

    public int repairVietnameseEncoding() {
        int repaired = 0;
        for (BlogPost post : blogPostRepository.findAll()) {
            boolean changed = false;
            String title = repairMojibake(post.getTitle());
            String excerpt = repairMojibake(post.getExcerpt());
            String content = repairMojibake(post.getContent());
            String category = repairMojibake(post.getCategory());
            String seoTitle = repairMojibake(post.getSeoTitle());
            String seoDescription = repairMojibake(post.getSeoDescription());
            String tags = repairMojibake(post.getTags());
            if (!java.util.Objects.equals(title, post.getTitle())) { post.setTitle(title); changed = true; }
            if (!java.util.Objects.equals(excerpt, post.getExcerpt())) { post.setExcerpt(excerpt); changed = true; }
            if (!java.util.Objects.equals(content, post.getContent())) { post.setContent(content); changed = true; }
            if (!java.util.Objects.equals(category, post.getCategory())) { post.setCategory(category); changed = true; }
            if (!java.util.Objects.equals(seoTitle, post.getSeoTitle())) { post.setSeoTitle(seoTitle); changed = true; }
            if (!java.util.Objects.equals(seoDescription, post.getSeoDescription())) { post.setSeoDescription(seoDescription); changed = true; }
            if (!java.util.Objects.equals(tags, post.getTags())) { post.setTags(tags); changed = true; }
            if (changed) { blogPostRepository.save(post); repaired++; }
        }
        for (BlogPostRevision revision : revisionRepository.findAll()) {
            revision.setTitle(repairMojibake(revision.getTitle()));
            revision.setExcerpt(repairMojibake(revision.getExcerpt()));
            revision.setContent(repairMojibake(revision.getContent()));
            revision.setCategory(repairMojibake(revision.getCategory()));
            revision.setSeoTitle(repairMojibake(revision.getSeoTitle()));
            revision.setSeoDescription(repairMojibake(revision.getSeoDescription()));
            revision.setTags(repairMojibake(revision.getTags()));
            revisionRepository.save(revision);
        }
        return repaired;
    }

    private String repairMojibake(String value) {
        if (value == null) return null;
        String current = value;
        for (int i = 0; i < 3 && mojibakeScore(current) > 0; i++) {
            String decoded = new String(current.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
            if (decoded.indexOf('\uFFFD') >= 0 || mojibakeScore(decoded) >= mojibakeScore(current)) break;
            current = decoded;
        }
        return current;
    }

    private long mojibakeScore(String value) {
        return value.chars().filter(ch ->
                ch == 0x00C3 || ch == 0x00C2 || ch == 0x00C4 || ch == 0x00C6
        ).count();
    }

    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    public void incrementViewCount(String slug) {
        BlogPost post = getPublishedPostBySlug(slug);
        if (post.getViewCount() == null) {
            post.setViewCount(1L);
        } else {
            post.setViewCount(post.getViewCount() + 1);
        }
        blogPostRepository.save(post);
    }

    private String normalizeStatus(String status) {
        return "PUBLISHED".equals(status) ? "PUBLISHED" : "DRAFT";
    }

    private int calculateReadingTime(String html) {
        if (html == null || html.isBlank()) {
            return 1;
        }
        String plainText = html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
        if (plainText.isEmpty()) {
            return 1;
        }
        int wordCount = plainText.split("\\s+").length;
        return Math.max(1, (int) Math.ceil(wordCount / 220.0));
    }

    private String sanitizeContent(String html) {
        if (html == null) return "";
        Safelist safelist = Safelist.relaxed()
                .addTags("figure", "figcaption")
                .addAttributes("a", "target", "rel", "id")
                .addAttributes(":all", "class")
                .addProtocols("img", "src", "http", "https");
        return Jsoup.clean(html, "", safelist, new org.jsoup.nodes.Document.OutputSettings().prettyPrint(false));
    }

    private String generateSlug(String title) {
        if (title == null || title.trim().isEmpty()) {
            return java.util.UUID.randomUUID().toString().substring(0, 8);
        }
        
        String slug = Normalizer.normalize(title, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        slug = pattern.matcher(slug).replaceAll("");
        slug = slug.toLowerCase(Locale.ENGLISH);
        slug = slug.replaceAll("[^a-z0-9\\s-]", ""); // Remove invalid chars
        slug = slug.replaceAll("\\s+", "-"); // Replace spaces with -
        slug = slug.replaceAll("-+", "-"); // Collapse dashes
        
        // Loại bỏ dấu gạch ngang ở đầu và cuối nếu có
        slug = slug.replaceAll("^-|-$", "");
        
        // Nếu tiêu đề toàn tiếng Nhật/ký tự đặc biệt dẫn đến slug rỗng
        if (slug.isEmpty()) {
            slug = "post-" + java.util.UUID.randomUUID().toString().substring(0, 8);
        }
        
        // Ensure slug is unique
        String originalSlug = slug;
        int count = 1;
        while (blogPostRepository.findBySlug(slug).isPresent()) {
            slug = originalSlug + "-" + count++;
        }
        
        return slug;
    }
}
