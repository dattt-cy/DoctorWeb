package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
    Optional<BlogPost> findBySlugAndStatus(String slug, String status);
    Page<BlogPost> findByStatus(String status, Pageable pageable);
    Page<BlogPost> findByCategoryAndStatus(String category, String status, Pageable pageable);
}
