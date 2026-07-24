package com.doctorweb.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_post_revision")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BlogPostRevision {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "post_id", nullable = false)
    private Long postId;
    @Column(nullable = false)
    private String title;
    @Column(length = 500)
    private String excerpt;
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    private String category;
    @Column(name = "cover_image", length = 500)
    private String coverImage;
    @Column(name = "seo_title")
    private String seoTitle;
    @Column(name = "seo_description", length = 500)
    private String seoDescription;
    @Column(length = 500)
    private String tags;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
