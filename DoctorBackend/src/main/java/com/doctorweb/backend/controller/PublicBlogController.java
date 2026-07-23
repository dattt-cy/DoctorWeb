package com.doctorweb.backend.controller;

import com.doctorweb.backend.domain.BlogPost;
import com.doctorweb.backend.service.BlogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/blogs")
public class PublicBlogController {

    private final BlogService blogService;

    public PublicBlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogPost>> getPublishedPosts(Pageable pageable) {
        return ResponseEntity.ok(blogService.getPublishedPosts(pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        blogService.incrementViewCount(slug);
        return ResponseEntity.ok(blogService.getPostBySlug(slug));
    }
}
