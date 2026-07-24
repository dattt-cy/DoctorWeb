package com.doctorweb.backend.repository;

import com.doctorweb.backend.domain.BlogPostRevision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BlogPostRevisionRepository extends JpaRepository<BlogPostRevision, Long> {
    List<BlogPostRevision> findTop20ByPostIdOrderByCreatedAtDesc(Long postId);
}
