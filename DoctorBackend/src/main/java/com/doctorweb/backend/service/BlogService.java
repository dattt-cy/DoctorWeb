package com.doctorweb.backend.service;

import com.doctorweb.backend.domain.BlogPost;
import com.doctorweb.backend.repository.BlogPostRepository;
import com.doctorweb.backend.global.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@Transactional
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public BlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
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

    public BlogPost createPost(BlogPost post) {
        post.setStatus(normalizeStatus(post.getStatus()));
        post.setSlug(generateSlug(post.getTitle()));
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
        
        if (!existingPost.getTitle().equals(updatedPost.getTitle())) {
            existingPost.setTitle(updatedPost.getTitle());
            existingPost.setSlug(generateSlug(updatedPost.getTitle()));
        }
        
        existingPost.setExcerpt(updatedPost.getExcerpt());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setReadingTime(calculateReadingTime(updatedPost.getContent()));
        existingPost.setCategory(updatedPost.getCategory());
        existingPost.setCoverImage(updatedPost.getCoverImage());
        if (updatedPost.getFeatured() != null) {
            existingPost.setFeatured(updatedPost.getFeatured());
        }
        existingPost.setSeoTitle(updatedPost.getSeoTitle());
        existingPost.setSeoDescription(updatedPost.getSeoDescription());
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

    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    public void incrementViewCount(String slug) {
        BlogPost post = getPostBySlug(slug);
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
