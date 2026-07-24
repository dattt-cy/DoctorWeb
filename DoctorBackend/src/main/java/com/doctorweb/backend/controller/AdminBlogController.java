package com.doctorweb.backend.controller;

import com.doctorweb.backend.domain.BlogPost;
import com.doctorweb.backend.domain.BlogPostRevision;
import com.doctorweb.backend.service.BlogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/blogs")
public class AdminBlogController {

    private final BlogService blogService;

    public AdminBlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogPost>> getAllPosts(Pageable pageable) {
        return ResponseEntity.ok(blogService.getAllPosts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<BlogPost> createPost(@Valid @RequestBody BlogPost post) {
        return ResponseEntity.ok(blogService.createPost(post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @Valid @RequestBody BlogPost post) {
        return ResponseEntity.ok(blogService.updatePost(id, post));
    }

    @PutMapping("/{id}/autosave")
    public ResponseEntity<BlogPost> autosavePost(@PathVariable Long id, @Valid @RequestBody BlogPost post) {
        return ResponseEntity.ok(blogService.autosavePost(id, post));
    }

    @GetMapping("/{id}/revisions")
    public ResponseEntity<java.util.List<BlogPostRevision>> getRevisions(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getRevisions(id));
    }

    @PostMapping("/{id}/revisions/{revisionId}/restore")
    public ResponseEntity<BlogPost> restoreRevision(@PathVariable Long id, @PathVariable Long revisionId) {
        return ResponseEntity.ok(blogService.restoreRevision(id, revisionId));
    }

    @PostMapping("/maintenance/repair-encoding")
    public ResponseEntity<java.util.Map<String, Integer>> repairEncoding() {
        return ResponseEntity.ok(java.util.Map.of("repairedPosts", blogService.repairVietnameseEncoding()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
